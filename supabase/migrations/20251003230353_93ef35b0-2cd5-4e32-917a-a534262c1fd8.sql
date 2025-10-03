-- Create quote_requests table
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  address TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert quote requests
CREATE POLICY "Anyone can create quote requests"
ON public.quote_requests
FOR INSERT
WITH CHECK (true);

-- Only allow viewing own quotes if authenticated
CREATE POLICY "Users can view their own quotes"
ON public.quote_requests
FOR SELECT
USING (customer_email = auth.email());

-- Create updated_at trigger
CREATE TRIGGER update_quote_requests_updated_at
BEFORE UPDATE ON public.quote_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();