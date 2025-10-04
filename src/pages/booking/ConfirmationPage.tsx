import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Download, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBookingState } from "@/hooks/use-booking-state";
import { format } from "date-fns";

export default function ConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { reset } = useBookingState();

  const reference = searchParams.get('ref');

  useEffect(() => {
    if (!reference) {
      navigate("/");
      return;
    }
    fetchBooking();
  }, [reference]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          service:services(*),
          cleaner:cleaners(*),
          booking_extras(
            *,
            extra:service_extras(*)
          )
        `)
        .eq("paystack_reference", reference)
        .single();

      if (error) throw error;
      setBooking(data);
      
      // Reset booking state after successful booking
      reset();
    } catch (error: any) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    // Placeholder for invoice download
    alert("Invoice download feature coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <p className="text-muted-foreground">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Booking not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for choosing Shalean Cleaning Services
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
              <p className="text-2xl font-bold text-primary">{booking.reference}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Service</p>
                <p className="font-semibold">{booking.service.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                <p className="font-semibold">
                  {format(new Date(booking.booking_date), 'PPP')} at {booking.booking_time}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Property</p>
                <p className="font-semibold">
                  {booking.bedrooms} Bedroom{booking.bedrooms !== 1 ? 's' : ''}, {booking.bathrooms} Bathroom{booking.bathrooms !== 1 ? 's' : ''}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Frequency</p>
                <p className="font-semibold capitalize">{booking.frequency.replace('-', ' ')}</p>
              </div>
            </div>

            {booking.cleaner && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Cleaner</p>
                <p className="font-semibold">{booking.cleaner.name}</p>
              </div>
            )}

            {booking.booking_extras && booking.booking_extras.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Additional Services</p>
                <div className="space-y-1">
                  {booking.booking_extras.map((be: any) => (
                    <p key={be.id} className="text-sm">• {be.extra.name}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-primary">₦{booking.total_amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm">
                A confirmation email has been sent to <strong>{booking.customer_email}</strong> with all the booking details.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handleDownloadInvoice}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
