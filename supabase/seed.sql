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

-- posts (콜리 사진 + 유튜브 혼합)
insert into posts (type, image_url, youtube_url, body) values
  -- 콜리 사진 게시물
  ('photo', 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=800&q=80', null,
   '콜리가 오늘도 텃밭 순찰 중입니다. 든든한 경비원이에요 🐾'),
  ('photo', 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&q=80', null,
   '햇살 좋은 오후, 콜리랑 텃밭 산책. 고구마 잘 자라고 있어요 🍠'),
  ('photo', 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80', null,
   '수확 끝나고 콜리도 한숨 쉬는 중. 오늘도 수고했어 🌿'),
  ('photo', 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=800&q=80', null,
   '오늘 아침 첫 수확. 올해 고구마는 유난히 실해요'),

  -- 콜리 유튜브 게시물
  ('youtube', null, 'https://www.youtube.com/watch?v=EfwTiHMgJGM',
   '보더콜리 5남매의 하루 🐕 보고 있으면 힐링됩니다'),
  ('youtube', null, 'https://www.youtube.com/watch?v=gY_KujhVW6s',
   '아기 보더콜리들이 처음으로 밭을 뛰어다니는 영상이에요 🐾'),
  ('youtube', null, 'https://www.youtube.com/watch?v=RsSuH8w73KA',
   '농장에서 일하는 보더콜리. 콜리도 이렇게 훈련시켜볼까요 😄');

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
