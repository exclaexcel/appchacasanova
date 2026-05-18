-- ============================================================
-- ReformaApp — Schema inicial
-- ============================================================

-- Projects: cada reforma de um usuário
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  total_budget  numeric(12,2) not null default 0,
  created_at    timestamptz not null default now()
);

-- Categories: frentes da obra por projeto
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  name        text not null,
  color_hex   text not null default '#C84B31'
);

-- Expenses: cada despesa registrada
create table if not exists public.expenses (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references public.projects(id) on delete cascade,
  category_id     uuid references public.categories(id) on delete set null,
  description     text not null,
  amount          numeric(12,2) not null,
  expense_date    date not null default current_date,
  payment_method  text not null default 'pix',
  is_paid         boolean not null default false,
  receipt_url     text,
  created_at      timestamptz not null default now()
);

-- Indexes
create index if not exists idx_projects_user_id   on public.projects(user_id);
create index if not exists idx_categories_project on public.categories(project_id);
create index if not exists idx_expenses_project   on public.expenses(project_id);
create index if not exists idx_expenses_category  on public.expenses(category_id);
create index if not exists idx_expenses_date      on public.expenses(expense_date);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.projects  enable row level security;
alter table public.categories enable row level security;
alter table public.expenses  enable row level security;

-- Projects: somente o dono acessa
create policy "projects_owner" on public.projects
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Categories: acesso via ownership do projeto
create policy "categories_owner" on public.categories
  for all
  using (
    exists (
      select 1 from public.projects
      where id = categories.project_id
        and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects
      where id = categories.project_id
        and user_id = auth.uid()
    )
  );

-- Expenses: acesso via ownership do projeto
create policy "expenses_owner" on public.expenses
  for all
  using (
    exists (
      select 1 from public.projects
      where id = expenses.project_id
        and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects
      where id = expenses.project_id
        and user_id = auth.uid()
    )
  );
