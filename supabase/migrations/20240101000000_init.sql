-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- UTILITY: auto-update updated_at trigger
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- TABLE: profiles
-- ============================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  full_name     text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_profiles_email on public.profiles(email);
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: workspaces
-- ============================================================
create table public.workspaces (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text unique not null,
  owner_id      uuid not null references public.profiles(id),
  logo_url      text,
  brand_color   text default '#6366f1',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_workspaces_owner on public.workspaces(owner_id);
create trigger trg_workspaces_updated_at
  before update on public.workspaces
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: workspace_members
-- ============================================================
create table public.workspace_members (
  id             uuid primary key default gen_random_uuid(),
  workspace_id   uuid not null references public.workspaces(id) on delete cascade,
  user_id        uuid references public.profiles(id) on delete cascade,
  role           text not null check (role in ('owner', 'admin', 'member')),
  invited_email  text,
  accepted_at    timestamptz,
  created_at     timestamptz not null default now(),
  unique(workspace_id, user_id)
);
create index idx_wm_workspace on public.workspace_members(workspace_id);
create index idx_wm_user     on public.workspace_members(user_id);

-- ============================================================
-- TABLE: subscriptions
-- ============================================================
create table public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  workspace_id            uuid not null unique references public.workspaces(id) on delete cascade,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  stripe_price_id         text,
  status                  text not null default 'trialing'
                            check (status in (
                              'trialing','active','past_due',
                              'canceled','unpaid','incomplete','incomplete_expired'
                            )),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  trial_end               timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: document_requests
-- ============================================================
create table public.document_requests (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  created_by    uuid references public.profiles(id) on delete set null,
  title         text not null,
  description   text,
  client_name   text not null,
  client_email  text not null,
  status        text not null default 'draft'
                  check (status in ('draft','sent','partial','complete','expired')),
  access_token  text unique not null
                  default encode(gen_random_bytes(32), 'hex'),
  due_date      timestamptz,
  sent_at       timestamptz,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_dr_workspace    on public.document_requests(workspace_id);
create index idx_dr_token        on public.document_requests(access_token);
create index idx_dr_client_email on public.document_requests(client_email);
create index idx_dr_status       on public.document_requests(status);
create trigger trg_document_requests_updated_at
  before update on public.document_requests
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: document_items
-- ============================================================
create table public.document_items (
  id              uuid primary key default gen_random_uuid(),
  request_id      uuid not null references public.document_requests(id) on delete cascade,
  name            text not null,
  description     text,
  is_required     boolean not null default true,
  allowed_types   text[] default array['pdf','jpg','jpeg','png','docx'],
  max_size_mb     integer not null default 20,
  status          text not null default 'pending'
                    check (status in ('pending','uploaded','approved','rejected')),
  rejection_note  text,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_di_request on public.document_items(request_id);
create trigger trg_document_items_updated_at
  before update on public.document_items
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: document_uploads
-- ============================================================
create table public.document_uploads (
  id                uuid primary key default gen_random_uuid(),
  item_id           uuid not null references public.document_items(id) on delete cascade,
  request_id        uuid not null references public.document_requests(id) on delete cascade,
  storage_path      text not null,
  original_filename text not null,
  file_size_bytes   bigint,
  mime_type         text,
  reviewed_by       uuid references public.profiles(id) on delete set null,
  reviewed_at       timestamptz,
  created_at        timestamptz not null default now()
);
create index idx_du_item    on public.document_uploads(item_id);
create index idx_du_request on public.document_uploads(request_id);

-- ============================================================
-- TABLE: email_logs
-- ============================================================
create table public.email_logs (
  id              uuid primary key default gen_random_uuid(),
  workspace_id    uuid references public.workspaces(id) on delete cascade,
  request_id      uuid references public.document_requests(id) on delete set null,
  recipient_email text not null,
  email_type      text not null
                    check (email_type in (
                      'request_sent','document_uploaded','document_approved',
                      'document_rejected','request_complete','reminder'
                    )),
  status          text not null default 'sent'
                    check (status in ('queued','sent','failed')),
  error_message   text,
  sent_at         timestamptz default now(),
  created_at      timestamptz not null default now()
);
create index idx_el_workspace on public.email_logs(workspace_id);
create index idx_el_request   on public.email_logs(request_id);

-- ============================================================
-- ENABLE RLS
-- ============================================================
alter table public.profiles           enable row level security;
alter table public.workspaces         enable row level security;
alter table public.workspace_members  enable row level security;
alter table public.subscriptions      enable row level security;
alter table public.document_requests  enable row level security;
alter table public.document_items     enable row level security;
alter table public.document_uploads   enable row level security;
alter table public.email_logs         enable row level security;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================
create or replace function is_workspace_member(ws_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id
      and user_id = auth.uid()
      and accepted_at is not null
  );
$$;

create or replace function is_workspace_admin(ws_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id
      and user_id = auth.uid()
      and role in ('owner', 'admin')
      and accepted_at is not null
  );
$$;

-- ============================================================
-- RLS POLICIES: profiles
-- ============================================================
create policy "Users can view their own profile"
  on public.profiles for select using (id = auth.uid());
create policy "Users can update their own profile"
  on public.profiles for update using (id = auth.uid());
create policy "System inserts profile on signup"
  on public.profiles for insert with check (id = auth.uid());

-- ============================================================
-- RLS POLICIES: workspaces
-- ============================================================
create policy "Members can view their workspaces"
  on public.workspaces for select using (is_workspace_member(id));
create policy "Owners can update their workspace"
  on public.workspaces for update using (owner_id = auth.uid());
create policy "Authenticated users can create a workspace"
  on public.workspaces for insert with check (owner_id = auth.uid());
create policy "Owners can delete their workspace"
  on public.workspaces for delete using (owner_id = auth.uid());

-- ============================================================
-- RLS POLICIES: workspace_members
-- ============================================================
create policy "Members can view other members in same workspace"
  on public.workspace_members for select using (is_workspace_member(workspace_id));
create policy "Admins can invite members"
  on public.workspace_members for insert with check (is_workspace_admin(workspace_id));
create policy "Admins can update membership roles"
  on public.workspace_members for update using (is_workspace_admin(workspace_id));
create policy "Admins can remove members"
  on public.workspace_members for delete using (is_workspace_admin(workspace_id));

-- ============================================================
-- RLS POLICIES: subscriptions (read-only for members)
-- ============================================================
create policy "Members can view workspace subscription"
  on public.subscriptions for select using (is_workspace_member(workspace_id));

-- ============================================================
-- RLS POLICIES: document_requests
-- ============================================================
create policy "Members can view requests in their workspace"
  on public.document_requests for select using (is_workspace_member(workspace_id));
create policy "Members can create requests"
  on public.document_requests for insert with check (is_workspace_member(workspace_id));
create policy "Members can update requests in their workspace"
  on public.document_requests for update using (is_workspace_member(workspace_id));
create policy "Admins can delete requests"
  on public.document_requests for delete using (is_workspace_admin(workspace_id));

-- ============================================================
-- RLS POLICIES: document_items
-- ============================================================
create policy "Members can manage items via request membership"
  on public.document_items for all
  using (
    exists (
      select 1 from public.document_requests dr
      where dr.id = request_id
        and is_workspace_member(dr.workspace_id)
    )
  );

-- ============================================================
-- RLS POLICIES: document_uploads
-- ============================================================
create policy "Members can view uploads in their workspace"
  on public.document_uploads for select
  using (
    exists (
      select 1 from public.document_requests dr
      where dr.id = request_id
        and is_workspace_member(dr.workspace_id)
    )
  );
create policy "Members can update uploads in their workspace"
  on public.document_uploads for update
  using (
    exists (
      select 1 from public.document_requests dr
      where dr.id = request_id
        and is_workspace_member(dr.workspace_id)
    )
  );

-- ============================================================
-- RLS POLICIES: email_logs
-- ============================================================
create policy "Members can view their workspace email logs"
  on public.email_logs for select using (is_workspace_member(workspace_id));

-- ============================================================
-- TRIGGER: Auto-create profile on signup
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
