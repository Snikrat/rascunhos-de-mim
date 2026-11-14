-- Textos do site que você edita pela área de escrever (por enquanto, o "sobre mim").
-- Rode uma vez no SQL Editor do Supabase.

create table if not exists public.site_settings (
  key         text primary key,
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "todo mundo lê" on public.site_settings;
create policy "todo mundo lê" on public.site_settings
  for select using (true);

drop policy if exists "dono cria" on public.site_settings;
create policy "dono cria" on public.site_settings
  for insert to authenticated with check (public.is_owner());

drop policy if exists "dono edita" on public.site_settings;
create policy "dono edita" on public.site_settings
  for update to authenticated using (public.is_owner()) with check (public.is_owner());
