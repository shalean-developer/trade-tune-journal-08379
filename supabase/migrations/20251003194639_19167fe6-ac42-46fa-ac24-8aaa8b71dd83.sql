-- Add email column to profiles table to fix build errors
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Create index on email for faster lookups
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Create function to sync email from auth.users to profiles
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the profile email from auth.users
  UPDATE public.profiles
  SET email = (SELECT email FROM auth.users WHERE id = NEW.id)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to sync email when profile is created or updated
DROP TRIGGER IF EXISTS on_profile_created_sync_email ON public.profiles;
CREATE TRIGGER on_profile_created_sync_email
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_email();

-- Backfill existing profiles with email from auth.users
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id AND p.email IS NULL;