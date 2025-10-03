import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getBookingById } from '@/services/booking-service';
import { toast } from 'sonner';
import { AlertCircle, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      if (!bookingId) return;
      const data = await getBookingById(bookingId);
      setBooking(data);
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.error('Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    toast.info('Payment integration coming soon!');
    // This is where Paystack integration will go
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Booking not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Shalean Cleaning Services</title>
        <meta name="description" content="Complete your booking payment" />
      </Helmet>

      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking ID:</span>
                    <span className="font-mono text-sm">{booking.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{booking.status}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">
                      R{Number(booking.total_price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This is a demo checkout page. In production, this will integrate with Paystack for secure payments.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  Payment processing will be handled securely through Paystack. You'll be able to pay using:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm">Credit/Debit Cards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm">EFT/Bank Transfer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm">Mobile Money</span>
                  </li>
                </ul>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePayment}
                >
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
