-- Update the calculate_booking_price function to use 'qty' instead of 'quantity'
CREATE OR REPLACE FUNCTION public.calculate_booking_price(p_booking_id UUID)
RETURNS TABLE(total_price DECIMAL, estimated_minutes INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_service_price DECIMAL := 0;
  v_items_total DECIMAL := 0;
  v_extras_total DECIMAL := 0;
  v_bedrooms INTEGER := 2;
  v_bathrooms INTEGER := 1;
  v_base_minutes INTEGER := 120;
  v_bedroom_minutes INTEGER := 30;
  v_bathroom_minutes INTEGER := 20;
  v_total_minutes INTEGER;
BEGIN
  -- Get service base price
  SELECT COALESCE(s.base_price, 0) INTO v_service_price
  FROM public.bookings b
  LEFT JOIN public.services s ON b.service_id = s.id
  WHERE b.id = p_booking_id;

  -- Get items total and counts using 'qty' instead of 'quantity'
  SELECT 
    COALESCE(SUM(qty * unit_price), 0),
    COALESCE(SUM(CASE WHEN item_type = 'bedroom' THEN qty ELSE 0 END), 2),
    COALESCE(SUM(CASE WHEN item_type = 'bathroom' THEN qty ELSE 0 END), 1)
  INTO v_items_total, v_bedrooms, v_bathrooms
  FROM public.booking_items
  WHERE booking_id = p_booking_id;

  -- Get extras total using 'qty' instead of 'quantity'
  SELECT COALESCE(SUM(qty * unit_price), 0) INTO v_extras_total
  FROM public.booking_extras
  WHERE booking_id = p_booking_id;

  -- Calculate duration
  v_total_minutes := v_base_minutes + (v_bedrooms * v_bedroom_minutes) + (v_bathrooms * v_bathroom_minutes);

  RETURN QUERY SELECT 
    (v_service_price + v_items_total + v_extras_total)::DECIMAL,
    v_total_minutes::INTEGER;
END;
$$;