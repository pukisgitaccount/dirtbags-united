-- Profile settings: add climbing/profile fields to profiles
-- (display_name already exists in initial schema)

alter table public.profiles
  -- grade display preferences
  add column if not exists grade_system_routes text not null default 'french'
    check (grade_system_routes in ('french','uiaa','yds')),
  add column if not exists grade_system_boulder text not null default 'v_scale'
    check (grade_system_boulder in ('v_scale','font')),
  -- climbing identity
  add column if not exists disciplines text[],
  add column if not exists location text,
  -- social / privacy
  add column if not exists instagram text,
  add column if not exists is_private boolean not null default false;
