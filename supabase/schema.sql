-- Rascunhos de Mim: banco de dados.
-- Rode tudo isso uma vez no Supabase: SQL Editor > New query > colar > Run.
-- Depois rode a última linha (o insert em site_owners) com o SEU e-mail Google.

-- Quem pode escrever ------------------------------------------------------
create table if not exists public.site_owners (
  email text primary key
);
alter table public.site_owners enable row level security;
-- Sem políticas: ninguém lê nem altera essa tabela pela API, só pelo painel do Supabase.

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.site_owners
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Posts --------------------------------------------------------------------
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  type          text not null check (type in ('text', 'photo', 'quote')),
  status        text not null default 'draft' check (status in ('draft', 'published')),
  title         text,
  body          text,
  caption       text,
  photo_path    text,
  photo_width   int,
  photo_height  int,
  tags          text[] not null default '{}',
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint published_has_date check (status = 'draft' or published_at is not null)
);

create index if not exists posts_feed_idx on public.posts (status, published_at desc);
create index if not exists posts_tags_idx on public.posts using gin (tags);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

alter table public.posts enable row level security;

drop policy if exists "todo mundo lê o que foi publicado" on public.posts;
create policy "todo mundo lê o que foi publicado" on public.posts
  for select using (status = 'published');

drop policy if exists "dono lê tudo" on public.posts;
create policy "dono lê tudo" on public.posts
  for select to authenticated using (public.is_owner());

drop policy if exists "dono escreve" on public.posts;
create policy "dono escreve" on public.posts
  for insert to authenticated with check (public.is_owner());

drop policy if exists "dono edita" on public.posts;
create policy "dono edita" on public.posts
  for update to authenticated using (public.is_owner()) with check (public.is_owner());

drop policy if exists "dono apaga" on public.posts;
create policy "dono apaga" on public.posts
  for delete to authenticated using (public.is_owner());

-- Fotos --------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "dono sobe fotos" on storage.objects;
create policy "dono sobe fotos" on storage.objects
  for insert to authenticated with check (bucket_id = 'photos' and public.is_owner());

drop policy if exists "dono troca fotos" on storage.objects;
create policy "dono troca fotos" on storage.objects
  for update to authenticated using (bucket_id = 'photos' and public.is_owner());

drop policy if exists "dono apaga fotos" on storage.objects;
create policy "dono apaga fotos" on storage.objects
  for delete to authenticated using (bucket_id = 'photos' and public.is_owner());

-- Textos do site (sobre mim) ------------------------------------------
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

-- O SEU e-mail (troque antes de rodar) -------------------------------------
-- insert into public.site_owners (email) values ('seu-email@gmail.com');
