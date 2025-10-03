-- Drop existing user_roles table and create with correct schema
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Recreate user_roles table with correct schema  
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create is_admin_secure function
CREATE OR REPLACE FUNCTION public.is_admin_secure(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Create has_free_access function
CREATE OR REPLACE FUNCTION public.has_free_access(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = _user_id
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Create get_all_profiles_for_admin function
CREATE OR REPLACE FUNCTION public.get_all_profiles_for_admin()
RETURNS SETOF profiles
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM profiles ORDER BY created_at DESC
$$;

-- Create get_all_trades_for_admin function
CREATE OR REPLACE FUNCTION public.get_all_trades_for_admin()
RETURNS SETOF trades
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM trades ORDER BY created_at DESC
$$;

-- Create get_all_playbooks_for_admin function
CREATE OR REPLACE FUNCTION public.get_all_playbooks_for_admin()
RETURNS SETOF playbooks
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM playbooks ORDER BY created_at DESC
$$;

-- Create merge_duplicate_accounts function
CREATE OR REPLACE FUNCTION public.merge_duplicate_accounts(primary_user_id UUID, duplicate_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE trades SET user_id = primary_user_id WHERE user_id = duplicate_user_id;
  UPDATE playbooks SET user_id = primary_user_id WHERE user_id = duplicate_user_id;
  UPDATE user_enrollments SET user_id = primary_user_id WHERE user_id = duplicate_user_id;
  DELETE FROM profiles WHERE id = duplicate_user_id;
END;
$$;

-- Create create_profile_for_user function
CREATE OR REPLACE FUNCTION public.create_profile_for_user(user_email TEXT, user_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  new_user_id := gen_random_uuid();
  INSERT INTO profiles (id, email, full_name)
  VALUES (new_user_id, user_email, user_name);
  RETURN new_user_id;
END;
$$;

-- Create add_role_to_user function
CREATE OR REPLACE FUNCTION public.add_role_to_user(target_user_id UUID, user_role app_role)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, user_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Create remove_role_from_user function
CREATE OR REPLACE FUNCTION public.remove_role_from_user(target_user_id UUID, user_role app_role)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM user_roles WHERE user_id = target_user_id AND role = user_role;
END;
$$;

-- RLS Policies
CREATE POLICY "Users can view their own enrollments" ON user_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own trades" ON trades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own trades" ON trades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trades" ON trades FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trades" ON trades FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own playbooks" ON playbooks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own playbooks" ON playbooks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own playbooks" ON playbooks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own playbooks" ON playbooks FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Courses are viewable by everyone" ON courses FOR SELECT USING (true);
CREATE POLICY "Course modules are viewable by everyone" ON course_modules FOR SELECT USING (true);
CREATE POLICY "Lessons are viewable by everyone" ON lessons FOR SELECT USING (true);
CREATE POLICY "Users can view their own submissions" ON assignment_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own submissions" ON assignment_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view account creation requests" ON account_creation_requests FOR SELECT USING (public.is_admin_secure(auth.uid()));