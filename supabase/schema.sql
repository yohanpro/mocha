-- =====================
-- 콜리네 텃밭 Phase 1 Schema
-- =====================

create table products (
  id          uuid primary key default gen_random_uuid(),
  name        text    not null,
  price       integer not null,
  stock       integer not null default 0,
  image_url   text,
  status      text    not null default 'active' check (status in ('active', 'sold_out', 'hidden')),
  created_at  timestamptz not null default now()
);

create table orders (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid    not null references products(id),
  qty         integer not null check (qty > 0),
  status      text    not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'done')),
  created_at  timestamptz not null default now()
);

create table customers (
  id        uuid primary key default gen_random_uuid(),
  order_id  uuid not null references orders(id),
  name      text not null,
  phone     text not null,
  address   text not null
);

create table posts (
  id          uuid primary key default gen_random_uuid(),
  type        text default 'photo',
  image_url   text,
  body        text,
  created_at  timestamptz not null default now()
);

-- =====================
-- RLS
-- =====================

alter table products  enable row level security;
alter table orders    enable row level security;
alter table customers enable row level security;
alter table posts     enable row level security;

-- products: 누구나 조회, 관리자만 수정
create policy "products_select" on products for select using (true);
create policy "products_insert" on products for insert with check (auth.role() = 'authenticated');
create policy "products_update" on products for update using (auth.role() = 'authenticated');
create policy "products_delete" on products for delete using (auth.role() = 'authenticated');

-- orders: 누구나 주문 생성, 관리자만 조회·수정
create policy "orders_insert" on orders for insert with check (true);
create policy "orders_select" on orders for select using (auth.role() = 'authenticated');
create policy "orders_update" on orders for update using (auth.role() = 'authenticated');

-- customers: 누구나 배송지 등록, 관리자만 조회
create policy "customers_insert" on customers for insert with check (true);
create policy "customers_select" on customers for select using (auth.role() = 'authenticated');

-- posts: 누구나 조회, 관리자만 수정
create policy "posts_select" on posts for select using (true);
create policy "posts_insert" on posts for insert with check (auth.role() = 'authenticated');
create policy "posts_update" on posts for update using (auth.role() = 'authenticated');
create policy "posts_delete" on posts for delete using (auth.role() = 'authenticated');

-- =====================
-- Storage bucket (상품·피드 이미지)
-- =====================

insert into storage.buckets (id, name, public)
values ('images', 'images', true);

create policy "images_select" on storage.objects for select using (bucket_id = 'images');
create policy "images_insert" on storage.objects for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "images_delete" on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');
