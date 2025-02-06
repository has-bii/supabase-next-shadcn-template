insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO NOTHING;

create policy "user uploads avatars"
on storage.objects for all to authenticated using (
    bucket_id = 'avatars' AND ((select auth.uid()) = owner_id::uuid)
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT auth.uid() NOT NULL PRIMARY KEY,  -- Use auth.uid() for default
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable row-level security for the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for accessing profiles
CREATE POLICY "all accesses based on user_id"
ON profiles
FOR ALL
USING ((SELECT auth.uid()) = id);

-- Function to handle user update in profiles
CREATE OR REPLACE FUNCTION public.handle_user_update() 
RETURNS "trigger"
LANGUAGE "plpgsql" 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  UPDATE public.profiles
  SET full_name = new.raw_user_meta_data ->> 'full_name',
      email = new.email,
      avatar = new.raw_user_meta_data ->> 'avatar'
  WHERE id = new.id;
  RETURN new;
END;
$$;

-- Function to handle new user insertion in profiles
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS "trigger"
LANGUAGE "plpgsql" 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar',
    new.email
  );
  RETURN new;
END;
$$;

-- Trigger to handle new user insert
CREATE OR REPLACE TRIGGER new_user
AFTER INSERT ON auth.users
FOR EACH ROW 
EXECUTE FUNCTION handle_new_user();

-- Trigger to handle user update
CREATE OR REPLACE TRIGGER update_user
AFTER UPDATE ON auth.users
FOR EACH ROW 
EXECUTE FUNCTION handle_user_update();