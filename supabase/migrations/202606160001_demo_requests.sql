create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  full_name text not null check (char_length(full_name) between 1 and 120),
  business_name text not null check (char_length(business_name) between 1 and 160),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (char_length(phone) between 7 and 32),
  business_type text not null check (char_length(business_type) between 1 and 160),
  team_size integer not null check (team_size between 0 and 10000),
  message text not null default '' check (char_length(message) <= 3000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.demo_requests enable row level security;
revoke all on table public.demo_requests from public, anon, authenticated;
grant all on table public.demo_requests to service_role;

create table if not exists private.demo_request_rate_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0),
  expires_at timestamptz not null
);

create index if not exists demo_request_rate_limits_expires_at_idx
  on private.demo_request_rate_limits (expires_at);

create or replace function public.consume_demo_request_rate_limit(
  p_ip_hash text,
  p_limit integer default 5,
  p_window_seconds integer default 900
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, private
as $$
declare
  current_entry private.demo_request_rate_limits%rowtype;
  current_time timestamptz := now();
begin
  if p_ip_hash is null or p_ip_hash !~ '^[a-f0-9]{64}$'
     or p_limit < 1 or p_window_seconds < 1 then
    return false;
  end if;

  delete from private.demo_request_rate_limits
  where expires_at < current_time;

  insert into private.demo_request_rate_limits (
    ip_hash, window_started_at, request_count, expires_at
  )
  values (
    p_ip_hash,
    current_time,
    1,
    current_time + make_interval(secs => p_window_seconds)
  )
  on conflict (ip_hash) do nothing;

  select * into current_entry
  from private.demo_request_rate_limits
  where ip_hash = p_ip_hash
  for update;

  if current_entry.window_started_at + make_interval(secs => p_window_seconds) <= current_time then
    update private.demo_request_rate_limits
    set window_started_at = current_time,
        request_count = 1,
        expires_at = current_time + make_interval(secs => p_window_seconds)
    where ip_hash = p_ip_hash;
    return true;
  end if;

  if current_entry.request_count >= p_limit then
    return false;
  end if;

  update private.demo_request_rate_limits
  set request_count = request_count + 1
  where ip_hash = p_ip_hash;

  return true;
end;
$$;

revoke all on function public.consume_demo_request_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_demo_request_rate_limit(text, integer, integer)
  to service_role;
