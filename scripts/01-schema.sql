-- 1. Profiles Table
-- Public table for user profiles, linked to auth.users
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  role text check (role in ('Admin', 'Editor', 'Writer')),
  avatar_url text,
  department text,
  location text,
  status text check (status in ('active', 'inactive'))
);
-- RLS policies for profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 2. Posts Table
create table posts (
  id bigserial primary key,
  created_at timestamptz default now() not null,
  last_modified timestamptz default now() not null,
  author_id uuid references public.profiles on delete set null,
  title text not null,
  excerpt text,
  image text,
  status text check (status in ('published', 'draft')) default 'draft',
  views integer default 0,
  comments_count integer default 0,
  likes integer default 0,
  shares integer default 0,
  read_time integer,
  category text,
  tags text[],
  featured boolean default false,
  seo_score integer
);
alter table posts enable row level security;
create policy "Posts are viewable by everyone." on posts for select using (true);
create policy "Authenticated users can create posts." on posts for insert with check (auth.role() = 'authenticated');
create policy "Authors can update their own posts." on posts for update using (auth.uid() = author_id);
create policy "Authors can delete their own posts." on posts for delete using (auth.uid() = author_id);
create policy "Admins can manage all posts." on posts for all using ( (select role from profiles where id = auth.uid()) = 'Admin' );

-- 3. Comments Table
create table comments (
  id bigserial primary key,
  created_at timestamptz default now() not null,
  author_id uuid references public.profiles on delete set null,
  post_id bigint references public.posts on delete cascade,
  content text not null,
  status text check (status in ('approved', 'pending', 'spam')) default 'pending',
  ip_address inet,
  user_agent text
);
alter table comments enable row level security;
create policy "Comments are viewable by everyone." on comments for select using (true);
create policy "Authenticated users can create comments." on comments for insert with check (auth.role() = 'authenticated');
create policy "Admins and post authors can manage comments." on comments for all using (
  (select role from profiles where id = auth.uid()) = 'Admin' or
  auth.uid() = (select author_id from posts where id = comments.post_id)
);

-- 4. Reviews Table
create table reviews (
  id bigserial primary key,
  created_at timestamptz default now() not null,
  author_id uuid references public.profiles on delete set null,
  rating smallint check (rating >= 1 and rating <= 5),
  title text,
  content text not null,
  product_name text,
  product_id text,
  status text check (status in ('approved', 'pending', 'rejected')) default 'pending'
);
alter table reviews enable row level security;
create policy "Reviews are viewable by everyone." on reviews for select using (true);
create policy "Authenticated users can create reviews." on reviews for insert with check (auth.role() = 'authenticated');
create policy "Admins can manage all reviews." on reviews for all using ( (select role from profiles where id = auth.uid()) = 'Admin' );

-- Function to update last_modified timestamp on post update
create or replace function public.handle_post_update()
returns trigger as $$
begin
  new.last_modified = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to call the function
create trigger on_post_update
  before update on public.posts
  for each row execute procedure public.handle_post_update();
