-- 1. Create Customers Table
create table public.customers (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  email text not null,
  name text null,
  phone text null,
  constraint customers_pkey primary key (id),
  constraint customers_email_key unique (email)
);

-- 2. Create Bookings Table
create table public.bookings (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  customer_id uuid not null,
  service_id text not null, -- e.g 'womens-cut' from our code
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  price numeric not null,
  status text not null default 'confirmed', -- confirmed, cancelled, completed
  constraint bookings_pkey primary key (id),
  constraint bookings_customer_id_fkey foreign key (customer_id) references customers (id)
);

-- 3. Enable RLS (Security)
alter table public.customers enable row level security;
alter table public.bookings enable row level security;

-- 4. Create Policies (Allow full access for now, refine later for specific roles)
create policy "Enable read access for all users" on public.customers for select using (true);
create policy "Enable insert for all users" on public.customers for insert with check (true);

create policy "Enable read access for all users" on public.bookings for select using (true);
create policy "Enable insert for all users" on public.bookings for insert with check (true);
