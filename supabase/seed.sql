-- =====================
-- 콜리네 텃밭 Mock Data
-- =====================

-- products
insert into products (name, price, stock, image_url, status) values
  ('고창 햇고구마 5kg', 25000, 10, null, 'active'),
  ('고창 햇고구마 10kg', 45000, 5, null, 'active'),
  ('햇감자 5kg', 18000, 0, null, 'sold_out'),
  ('콜리네 텃밭 쌈채소 모둠', 8000, 20, null, 'active'),
  ('제철 호박 3개입', 6000, 8, null, 'hidden');

-- posts
insert into posts (type, image_url, body) values
  ('photo', null, '오늘 아침 텃밭에서 수확했어요. 고구마가 실하게 잘 컸네요 🍠'),
  ('photo', null, '콜리가 텃밭 순찰 중입니다. 오늘도 든든한 경비원이에요 🐾'),
  ('photo', null, '첫서리 전에 마지막 수확. 올해 고구마는 정말 달아요.');

-- orders + customers (테스트용 주문 3건)
with o1 as (
  insert into orders (product_id, qty, status)
  select id, 2, 'confirmed' from products where name = '고창 햇고구마 5kg'
  returning id
),
o2 as (
  insert into orders (product_id, qty, status)
  select id, 1, 'shipped' from products where name = '고창 햇고구마 10kg'
  returning id
),
o3 as (
  insert into orders (product_id, qty, status)
  select id, 3, 'pending' from products where name = '콜리네 텃밭 쌈채소 모둠'
  returning id
)
insert into customers (order_id, name, phone, address)
select id, '김민준', '010-1234-5678', '서울 마포구 합정동 123-4' from o1
union all
select id, '이서연', '010-9876-5432', '경기 성남시 분당구 정자동 456' from o2
union all
select id, '박지호', '010-5555-6666', '부산 해운대구 우동 789' from o3;
