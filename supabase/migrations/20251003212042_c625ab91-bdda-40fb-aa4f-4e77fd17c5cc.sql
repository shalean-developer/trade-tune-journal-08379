-- Add missing lesson_type column to lessons table
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS lesson_type TEXT DEFAULT 'video';

-- Add missing columns to trades table
ALTER TABLE public.trades
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS strategy TEXT,
ADD COLUMN IF NOT EXISTS mood TEXT;

-- Add hierarchy_level to existing roles table
ALTER TABLE public.roles
ADD COLUMN IF NOT EXISTS hierarchy_level INTEGER DEFAULT 0;

-- Update hierarchy levels for existing roles
UPDATE public.roles SET hierarchy_level = 100 WHERE name = 'admin';
UPDATE public.roles SET hierarchy_level = 50 WHERE name = 'instructor';
UPDATE public.roles SET hierarchy_level = 40 WHERE name = 'moderator';
UPDATE public.roles SET hierarchy_level = 10 WHERE name = 'student';
UPDATE public.roles SET hierarchy_level = 5 WHERE name = 'user';

-- Add name column to playbooks if missing
ALTER TABLE public.playbooks
ADD COLUMN IF NOT EXISTS name TEXT;