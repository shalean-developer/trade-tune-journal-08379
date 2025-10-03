-- Add extras column to quote_requests table
ALTER TABLE public.quote_requests
ADD COLUMN IF NOT EXISTS extras JSONB DEFAULT '[]'::jsonb;