-- Fix lessons table - add missing description column
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Fix trades table - add missing rating columns
ALTER TABLE public.trades
ADD COLUMN IF NOT EXISTS setup_rating INTEGER CHECK (setup_rating >= 1 AND setup_rating <= 5),
ADD COLUMN IF NOT EXISTS execution_rating INTEGER CHECK (execution_rating >= 1 AND execution_rating <= 5),
ADD COLUMN IF NOT EXISTS management_rating INTEGER CHECK (management_rating >= 1 AND management_rating <= 5);

-- Update function parameter names to match TypeScript expectations
CREATE OR REPLACE FUNCTION public.has_admin_access(_user_id UUID)
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

-- Fix merge_duplicate_accounts function parameters
CREATE OR REPLACE FUNCTION public.merge_duplicate_accounts(
  primary_user_id UUID,
  duplicate_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Merge trades
  UPDATE trades SET user_id = primary_user_id WHERE user_id = duplicate_user_id;
  
  -- Merge playbooks
  UPDATE playbooks SET user_id = primary_user_id WHERE user_id = duplicate_user_id;
  
  -- Merge enrollments
  UPDATE user_enrollments SET user_id = primary_user_id WHERE user_id = duplicate_user_id;
  
  -- Delete duplicate profile
  DELETE FROM profiles WHERE id = duplicate_user_id;
END;
$$;