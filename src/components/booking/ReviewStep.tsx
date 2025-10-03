import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, FileText } from 'lucide-react';

interface ReviewStepProps {
  bookingId: string | null;
  onBack: () => void;
}

export function ReviewStep({ bookingId, onBack }: ReviewStepProps) {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const [suburb, setSuburb] = useState<any>(null);
  const [extras, setExtras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (bookingId) {
      loadBookingDetails();
    }
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      // Fetch booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;
      setBooking(bookingData);

      // Fetch service
      if (bookingData.service_id) {
        const { data: serviceData } = await supabase
          .from('services')
          .select('*')
          .eq('id', bookingData.service_id)
          .single();
        setService(serviceData);
      }

      // Fetch region
      if (bookingData.region_id) {
        const { data: regionData } = await supabase
          .from('regions')
          .select('*')
          .eq('id', bookingData.region_id)
          .single();
        setRegion(regionData);
      }

      // Fetch suburb
      if (bookingData.suburb_id) {
        const { data: suburbData } = await supabase
          .from('suburbs')
          .select('*')
          .eq('id', bookingData.suburb_id)
          .single();
        setSuburb(suburbData);
      }

      // Fetch extras
      const { data: extrasData } = await supabase
        .from('booking_extras')
        .select(`
          *,
          service_extras (*)
        `)
        .eq('booking_id', bookingId);
      setExtras(extrasData || []);

    } catch (error) {
      console.error('Error loading booking details:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const basePrice = service?.base_price || 0;
    const extrasTotal = extras.reduce((sum, extra) => sum + Number(extra.line_total || 0), 0);
    return Number(basePrice) + extrasTotal;
  };

  const handleProceedToPayment = async () => {
    if (!bookingId) return;

    setSubmitting(true);
    try {
      const total = calculateTotal();

      // Update booking status and total
      await supabase
        .from('bookings')
        .update({
          status: 'READY_FOR_PAYMENT',
          total_price: total
        })
        .eq('id', bookingId);

      toast.success('Booking confirmed! Proceeding to payment...');
      navigate(`/booking/checkout/${bookingId}`);
    } catch (error) {
      console.error('Error preparing payment:', error);
      toast.error('Failed to proceed to payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading booking details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Confirm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Details */}
        <div>
          <h3 className="font-semibold mb-3">Service</h3>
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">{service?.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {service?.description}
            </p>
            <p className="text-lg font-bold mt-2">R{service?.base_price?.toFixed(2)}</p>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </h3>
          <div className="p-4 bg-muted rounded-lg space-y-1">
            <p>{booking?.address}</p>
            <p className="text-sm text-muted-foreground">
              {suburb?.name}, {region?.name}
            </p>
          </div>
        </div>

        {/* Date & Time */}
        {booking?.start_ts && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date & Time
            </h3>
            <div className="p-4 bg-muted rounded-lg">
              <p>{format(new Date(booking.start_ts), 'EEEE, MMMM d, yyyy')}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(booking.start_ts), 'h:mm a')} - {format(new Date(booking.end_ts), 'h:mm a')}
              </p>
            </div>
          </div>
        )}

        {/* Special Instructions */}
        {booking?.notes && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Special Instructions
            </h3>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{booking.notes}</p>
            </div>
          </div>
        )}

        {/* Extras */}
        {extras.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Extras</h3>
            <div className="space-y-2">
              {extras.map((extra: any) => (
                <div key={extra.id} className="flex justify-between p-3 bg-muted rounded-lg">
                  <span>{extra.service_extras?.name}</span>
                  <span className="font-medium">+R{Number(extra.line_total).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="p-4 bg-primary/5 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">
              R{calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Terms */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            By proceeding, you agree to our terms of service and cancellation policy. 
            Payment is required to confirm your booking.
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleProceedToPayment} 
            className="flex-1" 
            size="lg"
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
