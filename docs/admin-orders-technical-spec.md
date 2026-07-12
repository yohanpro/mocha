# 관리자 주문 목록 — 기술 설계 문서

> 작성일: 2026-06-13 | 대상: `app/admin/dashboard/orders/page.tsx`

아버지가 매일 쓰는 핵심 운영 화면. 주문 조회 → 입금 확인 → 상태 변경(발송/완료)을 한 화면에서 처리한다.

---

## 1. 데이터 — 3테이블 조인

주문 1건은 `orders` + `products`(상품 정보) + `customers`(주문자/배송지)를 합쳐야 의미가 있다.

```
orders ──(product_id)──> products   : N:1 (단일 객체로 임베드)
orders <──(order_id)──── customers  : 1:N (배열로 임베드 → [0] 사용)
```

```ts
// src/entities/order/api.ts
supabase.from("orders").select(
  "id, qty, total_price, status, created_at, products(name, price), customers(name, phone, address, memo)"
)
```

`customers`는 역방향 FK라 PostgREST가 **배열**로 반환한다. 1주문 1고객이므로 `customers[0]`만 사용해 `AdminOrder.customer`로 평탄화한다.

### 타입 추론 이슈 — `.returns<>()`

`types/index.ts`의 `Database` 타입은 `Relationships: []`로 비어 있어 supabase-js가 조인 타입을 추론하지 못한다(런타임 조인은 정상). 실제 응답 형태를 `.returns<OrderJoinRow[]>()`로 명시해 우회한다. 근본 해결은 `Database` 타입에 Relationships를 채우는 것(추후).

---

## 2. RLS — 추가 작업 불필요

`orders`/`customers`의 select 정책이 이미 관리자 전용으로 걸려 있다.

```sql
create policy "orders_select"    on orders    for select using (auth.role() = 'authenticated');
create policy "customers_select" on customers for select using (auth.role() = 'authenticated');
```

→ STEP 3의 인증 게이트(`proxy.ts`)로 로그인한 관리자는 세션 쿠키 기반으로 자동 통과. 서버 클라이언트(`createClient`)가 쿠키를 싣고 가므로 별도 키 없이 조회된다.

---

## 3. 상태 흐름

DB `check` 제약이 허용하는 4단계만 다룬다.

```
pending(입금대기) → confirmed(입금확인) → shipped(배송중) → done(완료)
```

> ⚠️ `entities/order/types.ts`의 `OrderStatus`에는 `cancelled`도 있으나 **DB check 제약엔 없다**. 취소로 업데이트하면 DB가 거부하므로 UI 흐름에서 제외했다. 상태 메타·다음단계는 `STATUS_META` / `NEXT_STEP`(entities)에 도메인 지식으로 집약.

상태 변경은 "다음 단계로 진행" 단일 버튼 방식 — 현재 상태에 따라 `입금 확인` / `발송 처리` / `완료 처리` 중 하나만 노출, `done`이면 "처리 완료" 텍스트. 운영자가 단계를 건너뛰거나 잘못 누를 여지를 줄인다.

---

## 4. 컴포넌트 구조 (FSD)

```
app/admin/dashboard/orders/page.tsx          ← Server Component, getOrders() 조회·조립
  └─ entities/order/ui/OrderCard.tsx          ← 표시 전용 (Server)
       └─ {children}  ← 액션 슬롯
  └─ features/manage-order/ui/OrderStatusControl.tsx  ← "use client", 상태 변경 버튼
       └─ features/manage-order/api/updateOrderStatus.ts ← "use server"
```

**레이어 규칙 유지:** `OrderCard`(entities)는 액션을 직접 import하지 않고 `children` 슬롯으로 받는다. 액션 컴포넌트(features)는 page에서 주입 → `features → entities` 단방향 의존 유지.

---

## 5. 상태 변경 — 서버액션 + revalidate

```ts
// features/manage-order/api/updateOrderStatus.ts
"use server";
export async function updateOrderStatus(orderId, status) {
  if (!ORDER_FLOW.includes(status)) throw ...;   // DB check와 동일 방어
  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin/dashboard/orders");     // 변경 후 서버 재조회
}
```

클라이언트는 `useTransition`으로 호출 → `revalidatePath`가 목록을 재렌더 → 배지·버튼·헤더 카운트가 갱신된다.

---

## 6. 스키마 드리프트 발견·수정 (2026-06-13)

이 화면을 만들며 `supabase/schema.sql`이 라이브 DB보다 낡은 것을 발견, 라이브 조회로 검증 후 동기화했다.

| 테이블 | schema.sql에 누락됐던 것 | 라이브 검증 |
|--------|--------------------------|-------------|
| products | `updated_at` | EXISTS |
| orders | `total_price` | EXISTS (not null, 기본 0) |
| customers | `memo` | EXISTS (nullable) |
| posts | `youtube_url` | EXISTS |

> 트리거(updated_at 자동 갱신, 주문 시 stock 감소/취소 시 복구)는 라이브에 존재하나 PostgREST로 DDL을 못 본다. schema.sql에 `DRIFT NOTE`로 명시했고, 권위 스키마가 필요하면 `supabase db dump --schema public` 권장.

---

## 7. 알려진 한계 / 다음

- seed 주문은 `total_price = 0`이라 화면에 "0원" 표시 (실주문은 정상 금액). 필요 시 seed 보정.
- 페이지네이션 없음(현재 9건). 주문이 많아지면 커서 기반 + 상태 필터 탭 추가.
- 다음 STEP 3 작업: 상품 등록/수정, 피드 등록.
