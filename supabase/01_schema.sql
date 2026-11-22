-- ════════════════════════════════════════════════════════════════════
--  DORIKA — Database Schema  (Supabase / PostgreSQL)
--  Run this in: Supabase Dashboard → SQL Editor → New query
--  File 1 of 3:  schema + tables + helpers
-- ════════════════════════════════════════════════════════════════════

-- Extensions ----------------------------------------------------------
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────
--  ENUMS
-- ─────────────────────────────────────────────────────────────────────
do $$ begin
  create type order_status as enum
    ('pending','confirmed','in_progress','shipped','delivered','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('cod','esewa','khalti','bank_transfer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('unpaid','pending','paid','refunded','failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type custom_status as enum
    ('pending','confirmed','in_progress','shipped','delivered','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('customer','admin');
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────────────────────────────
--  PROFILES  (optional accounts — linked to auth.users)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  phone       text,
  role        user_role not null default 'customer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Helper: is the current user an admin? (SECURITY DEFINER avoids RLS recursion)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Auto-create a profile row when a new auth user signs up.
-- The ADMIN_EMAIL from env is granted the admin role automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    case when new.email = current_setting('app.admin_email', true)
         then 'admin'::user_role else 'customer'::user_role end
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────
--  CATEGORIES
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────
--  PRODUCTS
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  description  text,
  price        numeric(12,2) not null default 0,
  compare_at   numeric(12,2),
  category_id  uuid references public.categories(id) on delete set null,
  images       text[] not null default '{}',
  size         text,
  stock        int not null default 0,
  is_featured  boolean not null default false,
  is_active    boolean not null default true,
  is_custom    boolean not null default false,  -- the signature String Face Art
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active);

-- ─────────────────────────────────────────────────────────────────────
--  ORDERS  (guest-friendly — user_id is nullable)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_no        text not null unique,              -- e.g. DRK-7F3K9A
  user_id         uuid references auth.users(id) on delete set null,
  -- customer snapshot (guest checkout)
  customer_name   text not null,
  phone           text not null,
  email           text,
  district        text,
  city            text,
  address         text,
  landmark        text,
  notes           text,
  -- money
  subtotal        numeric(12,2) not null default 0,
  delivery_fee    numeric(12,2) not null default 0,
  total           numeric(12,2) not null default 0,
  -- fulfilment
  status          order_status not null default 'pending',
  payment_method  payment_method not null default 'cod',
  payment_status  payment_status not null default 'unpaid',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists orders_phone_idx on public.orders(phone);
create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  product_name text not null,
  image_url    text,
  unit_price   numeric(12,2) not null default 0,
  quantity     int not null default 1,
  line_total   numeric(12,2) not null default 0
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- Status history timeline (used by Track Order + admin + dashboard)
create table if not exists public.order_events (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  status     order_status not null,
  note       text,
  created_at timestamptz not null default now()
);
create index if not exists order_events_order_idx on public.order_events(order_id);

-- ─────────────────────────────────────────────────────────────────────
--  CUSTOM ART REQUESTS  (String Face Art — guest friendly)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.custom_requests (
  id                 uuid primary key default gen_random_uuid(),
  request_no         text not null unique,           -- e.g. DRK-C-8H2M1
  user_id            uuid references auth.users(id) on delete set null,
  -- uploaded photo lives in a PRIVATE storage bucket; we store the path only
  photo_path         text,
  -- required details
  full_name          text not null,
  phone              text not null,
  whatsapp           text,
  email              text,
  district           text,
  municipality       text,
  ward_tole          text,
  full_address       text,
  landmark           text,
  -- optional details
  alt_phone          text,
  preferred_date     date,
  gift_or_self       text,
  background_pref     text,
  special_instructions text,
  -- fixed spec snapshot
  plank_size         text not null default '45cm diameter round plank',
  price              numeric(12,2) not null default 0,
  -- fulfilment
  status             custom_status not null default 'pending',
  payment_status     payment_status not null default 'unpaid',
  admin_notes        text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists custom_requests_phone_idx on public.custom_requests(phone);
create index if not exists custom_requests_user_idx on public.custom_requests(user_id);

create table if not exists public.custom_events (
  id         uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.custom_requests(id) on delete cascade,
  status     custom_status not null,
  note       text,
  created_at timestamptz not null default now()
);
create index if not exists custom_events_req_idx on public.custom_events(request_id);

-- ─────────────────────────────────────────────────────────────────────
--  CONTACT MESSAGES
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  subject    text,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────
--  ADDRESSES  (optional — for signed-up users)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  label      text,
  full_name  text,
  phone      text,
  district   text,
  city       text,
  address    text,
  landmark   text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists addresses_user_idx on public.addresses(user_id);

-- ─────────────────────────────────────────────────────────────────────
--  WISHLIST  (optional — for signed-up users; guests use localStorage)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.wishlist (
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ─────────────────────────────────────────────────────────────────────
--  SETTINGS  (single-row store config, editable in admin)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.settings (
  id               int primary key default 1,
  store_name       text not null default 'Dorika',
  store_email      text not null default 'shopdorika@gmail.com',
  store_phone      text not null default '9708285877',
  whatsapp         text not null default '9779708285877',
  address          text not null default 'Khairenitar, Tanahun, Nepal',
  currency         text not null default 'NPR',
  delivery_fee     numeric(12,2) not null default 150,
  free_delivery_over numeric(12,2) not null default 5000,
  custom_art_price numeric(12,2) not null default 4600,
  custom_art_days  text not null default '7–10 days',
  hero_headline    text not null default 'Your memories, woven in thread.',
  hero_tagline     text not null default 'Crafted string art from the heart of Nepal.',
  cod_enabled      boolean not null default true,
  esewa_enabled    boolean not null default false,
  khalti_enabled   boolean not null default false,
  bank_enabled     boolean not null default true,
  updated_at       timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

-- updated_at trigger ---------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists t_products_touch on public.products;
create trigger t_products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists t_orders_touch on public.orders;
create trigger t_orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

drop trigger if exists t_custom_touch on public.custom_requests;
create trigger t_custom_touch before update on public.custom_requests
  for each row execute function public.touch_updated_at();
