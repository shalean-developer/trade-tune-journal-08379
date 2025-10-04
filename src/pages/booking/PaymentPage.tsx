import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useBookingState } from "@/hooks/use-booking-state";
import { ProgressIndicator } from "@/components/booking/ProgressIndicator";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { MobileSummaryDrawer } from "@/components/booking/MobileSummaryDrawer";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const {
    service,
    bedrooms,
    bathrooms,
    extras,
    specialInstructions,
    date,
    time,
    frequency,
    cleaner,
    customerName,
    customerEmail,
    customerPhone,
    setCustomerInfo,
    getSummary,
  } = useBookingState();

  const summary = getSummary();

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error("Please fill in all contact details");
      return;
    }

    if (!service || !date || !time || !cleaner) {
      toast.error("Please complete all booking steps");
      return;
    }

    if (!paystackLoaded || !window.PaystackPop) {
      toast.error("Payment system is loading, please wait...");
      return;
    }

    setLoading(true);

    try {
      // Generate booking reference
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const reference = `SLC-${timestamp}-${random.toString().padStart(4, '0')}`;

      // Create booking in database
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          reference,
          service_id: service.id,
          cleaner_id: cleaner.id,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_name: customerName,
          bedrooms,
          bathrooms,
          special_instructions: specialInstructions || null,
          booking_date: format(date, 'yyyy-MM-dd'),
          booking_time: time,
          frequency,
          subtotal: summary.subtotal,
          discount: summary.discount,
          service_fee: summary.serviceFee,
          total_amount: summary.total,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Insert booking extras
      if (extras.length > 0) {
        const { error: extrasError } = await supabase
          .from("booking_extras")
          .insert(
            extras.map(({ extra, quantity }) => ({
              booking_id: booking.id,
              extra_id: extra.id,
              quantity,
              price: extra.price,
            }))
          );

        if (extrasError) throw extrasError;
      }

      // Initialize Paystack
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxx', // Replace with actual key
        email: customerEmail,
        amount: Math.round(summary.total * 100), // Convert to kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          booking_reference: reference,
          customer_name: customerName,
          service_name: service.name,
        },
        callback: (response: any) => {
          // Verify payment asynchronously
          setLoading(true);
          supabase.functions.invoke('verify-paystack-payment', {
            body: { reference: response.reference },
          })
          .then(({ data, error }) => {
            if (error) throw error;

            if (data.verified) {
              // Send confirmation emails
              return supabase.functions.invoke('send-booking-confirmation', {
                body: {
                  booking: data.booking,
                  service,
                  cleaner,
                  extras: extras.map(e => e.extra),
                },
              }).then(() => {
                toast.success("Payment successful! Confirmation emails sent.");
                navigate(`/booking/confirmation?ref=${response.reference}`);
              });
            } else {
              toast.error("Payment verification failed");
              setLoading(false);
            }
          })
          .catch((error: any) => {
            console.error("Verification error:", error);
            toast.error("Failed to verify payment");
            setLoading(false);
          });
        },
        onClose: () => {
          toast.info("Payment cancelled");
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error("Failed to initialize payment: " + error.message);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!service || !date || !cleaner) {
    navigate("/booking/service/select");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24 lg:pb-8">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <ProgressIndicator currentStep={5} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Details</h1>
              <p className="text-muted-foreground">
                Enter your contact information to complete the booking
              </p>
            </div>

            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerInfo(e.target.value, customerEmail, customerPhone)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerInfo(customerName, e.target.value, customerPhone)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerInfo(customerName, customerEmail, e.target.value)}
                    placeholder="+234 800 000 0000"
                    required
                  />
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handlePayment}
                disabled={loading || !paystackLoaded}
                className="flex-1"
              >
                {loading ? "Processing..." : !paystackLoaded ? "Loading payment..." : `Pay ₦${summary.total.toLocaleString()}`}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By proceeding, you agree to our Terms & Conditions and Privacy Policy.
              Your payment is secured by Paystack.
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-8">
              <BookingSummary />
            </div>
          </div>
        </div>
      </div>
      <MobileSummaryDrawer />
    </div>
  );
}
