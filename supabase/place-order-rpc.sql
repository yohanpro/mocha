-- =====================================================================
-- place_order() — 주문 생성 원자화 RPC
-- =====================================================================
-- 왜(WHY):
--   기존 submitOrder는 orders → customers 를 2번에 나눠 insert 했다. 그래서
--     (1) 중간 실패 시 "연락처 없는 고아 주문 + 이미 깎인 재고"가 남고,
--     (2) total_price 를 클라이언트가 계산해 넘겨 → 금액 조작이 가능했다
--         (RLS orders_insert 가 with check(true) 라 아무 금액이나 들어감).
--   이 함수 하나로 둘 다 닫는다. 함수 본문 전체가 "하나의 트랜잭션"이라
--   중간에 실패하면 처음부터 없던 일이 된다(전체 롤백).
--
-- 재고(STOCK):
--   products 의 재고 차감/복구는 "라이브 트리거"가 이미 담당한다
--   (supabase/schema.sql 의 DRIFT NOTE 참고). 그래서 이 함수는 재고를
--   직접 깎지 않는다 — 역할이 겹치면 이중 차감이 난다.
--   대신 insert 전에 해당 상품 행을 잠그고(for update) 재고를 확인해,
--   초과주문(oversell)만 막는다. 실제 차감은 트리거가 한다.
--
-- 권한(SECURITY):
--   소비자는 anon(비로그인)이다. 함수 안에서 건드리는 테이블 중 products
--   는 RLS가 authenticated 전용이라, 일반 실행이면 막힌다. 그래서
--   SECURITY DEFINER — 함수를 "소유자 권한"으로 실행해 RLS를 우회한다.
--   대신 search_path 를 public 으로 고정해 search_path 하이재킹을 막는다
--   (SECURITY DEFINER 함수의 필수 습관).
-- =====================================================================

-- 적용 전 확인용(선택): 재고 트리거가 실제로 존재하는지 눈으로 검증.
-- Supabase 대시보드 > SQL Editor 에서 아래를 먼저 돌려보면 트리거 정의가 보인다.
--   select tgname, tgrelid::regclass as tbl, pg_get_triggerdef(oid)
--   from pg_trigger
--   where tgrelid in ('orders'::regclass, 'products'::regclass)
--     and not tgisinternal;

create or replace function place_order(
  p_product_id uuid,
  p_qty        integer,
  p_name       text,
  p_phone      text,
  p_address    text,
  p_memo       text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product  products%rowtype;
  v_order_id uuid;
begin
  if p_qty is null or p_qty < 1 then
    raise exception '수량이 올바르지 않습니다';
  end if;

  -- 재고 행을 잠근다: 동시에 들어온 주문들이 순서대로 처리되도록(race 방지).
  -- 다른 트랜잭션은 이 행의 잠금이 풀릴 때까지 여기서 대기한다.
  select * into v_product
  from products
  where id = p_product_id
  for update;

  if not found then
    raise exception '상품을 찾을 수 없습니다';
  end if;

  if v_product.status <> 'active' then
    raise exception '판매 중인 상품이 아닙니다';
  end if;

  if v_product.stock < p_qty then
    raise exception '재고가 부족합니다 (남은 수량: %)', v_product.stock;
  end if;

  -- total_price 는 서버(DB)가 계산한다. 클라이언트가 보낸 금액은 쓰지 않는다.
  insert into orders (product_id, qty, total_price, status)
  values (p_product_id, p_qty, v_product.price * p_qty, 'pending')
  returning id into v_order_id;
  -- ↑ 이 insert 가 재고 차감 트리거를 발화시킨다(재고는 여기서 줄어든다).

  insert into customers (order_id, name, phone, address, memo)
  values (v_order_id, p_name, p_phone, p_address, nullif(p_memo, ''));

  return v_order_id;
end;
$$;

-- 비로그인 소비자(anon)와 관리자(authenticated) 모두 호출 가능해야 한다.
grant execute on function place_order(uuid, integer, text, text, text, text)
  to anon, authenticated;
