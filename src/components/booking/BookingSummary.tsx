import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';
import { getBookingById, getBookingItems, getBookingExtras } from '@/services/booking-service';
import { format } from 'date-fns';

interface BookingSummaryProps {
  bookingId: string | null;
  service: { name: string; base_price: number } | null;
  currentStep: number;
}

export function BookingSummary({ bookingId, service, currentStep }: BookingSummaryProps) {
  const [booking, setBooking] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [extras, setExtras] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingId) {
      loadBookingData();
    }
  }, [bookingId, currentStep]);

  const loadBookingData = async () => {
    if (!bookingId) return;
    
    setLoading(true);
    try {
      const [bookingData, itemsData, extrasData] = await Promise.all([
        getBookingById(bookingId),
        getBookingItems(bookingId),
        getBookingExtras(bookingId)
      ]);
      
      setBooking(bookingData);
      setItems(itemsData);
      setExtras(extrasData);
    } catch (error) {
      console.error('Error loading booking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const bedrooms = items.find(i => i.item_type === 'bedroom');
  const bathrooms = items.find(i => i.item_type === 'bathroom');

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Service */}
        {service && (
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium">{service.name}</span>
              <span className="font-semibold">R {service.base_price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Base service</p>
          </div>
        )}

        {/* Items (Bedrooms & Bathrooms) */}
        {currentStep >= 2 && (bedrooms || bathrooms) && (
          <>
            <Separator />
            <div className="space-y-2">
              {bedrooms && bedrooms.qty > 0 && (
                <div className="flex justify-between text-sm">
                  <span>{bedrooms.qty} Bedroom{bedrooms.qty > 1 ? 's' : ''}</span>
                  <span className="text-muted-foreground">Included</span>
                </div>
              )}
              {bathrooms && bathrooms.qty > 0 && (
                <div className="flex justify-between text-sm">
                  <span>{bathrooms.qty} Bathroom{bathrooms.qty > 1 ? 's' : ''}</span>
                  <span className="text-muted-foreground">Included</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Property Details */}
        {currentStep >= 2 && booking?.region_id && (
          <>
            <Separator />
            <div className="space-y-1">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Property Location</p>
                  {booking.address && (
                    <p className="text-muted-foreground text-xs">{booking.address}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Schedule */}
        {currentStep >= 3 && booking?.start_ts && (
          <>
            <Separator />
            <div className="space-y-1 text-sm">
              <p className="font-medium">Scheduled</p>
              <p className="text-muted-foreground">
                {format(new Date(booking.start_ts), 'PPP')}
              </p>
              <p className="text-muted-foreground">
                {format(new Date(booking.start_ts), 'p')}
              </p>
            </div>
          </>
        )}

        {/* Extras */}
        {currentStep >= 4 && extras.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="font-medium text-sm">Extras</p>
              {extras.map((extra) => (
                <div key={extra.id} className="flex justify-between text-sm">
                  <span>{extra.service_extras?.name}</span>
                  <span>R {Number(extra.line_total).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Duration */}
        {currentStep >= 2 && booking?.estimated_minutes > 0 && (
          <>
            <Separator />
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Estimated Duration:</span>
              <Badge variant="secondary">{formatDuration(booking.estimated_minutes)}</Badge>
            </div>
          </>
        )}

        {/* Total */}
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>R {(booking?.total_price || service?.base_price || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">R {(booking?.total_price || service?.base_price || 0).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
