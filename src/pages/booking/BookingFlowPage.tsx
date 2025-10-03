import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { getServiceBySlug, getOrCreateDraftBooking, Service } from '@/services/booking-service';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ServiceStep } from '@/components/booking/ServiceStep';
import { PropertyStep } from '@/components/booking/PropertyStep';
import { DateTimeStep } from '@/components/booking/DateTimeStep';
import { ExtrasStep } from '@/components/booking/ExtrasStep';
import { ReviewStep } from '@/components/booking/ReviewStep';

const STEPS = [
  { number: 1, title: 'Service & Package' },
  { number: 2, title: 'Property Details' },
  { number: 3, title: 'Date & Time' },
  { number: 4, title: 'Extras' },
  { number: 5, title: 'Review & Pay' },
];

export default function BookingFlowPage() {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [service, setService] = useState<Service | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadServiceAndBooking();
  }, [serviceSlug]);

  const loadServiceAndBooking = async () => {
    try {
      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!serviceSlug) {
        navigate('/booking/services');
        return;
      }

      // Load service
      const serviceData = await getServiceBySlug(serviceSlug);
      if (!serviceData) {
        toast.error('Service not found');
        navigate('/booking/services');
        return;
      }
      setService(serviceData);

      // Create or get draft booking if user is logged in
      if (user) {
        const booking = await getOrCreateDraftBooking(user.id);
        setBookingId(booking.id);
        
        // Update booking with selected service
        await supabase
          .from('bookings')
          .update({ service_id: serviceData.id })
          .eq('id', booking.id);
      }
    } catch (error) {
      console.error('Error loading booking flow:', error);
      toast.error('Failed to initialize booking');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / 5) * 100;

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

  if (!service) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Book {service.name} | Shalean Cleaning Services</title>
        <meta name="description" content={`Book ${service.name} cleaning service. Fast, professional, and reliable.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => currentStep === 1 ? navigate('/booking/services') : handleBack()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{service.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of 5: {STEPS[currentStep - 1].title}
                </p>
              </div>
            </div>

            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {currentStep === 1 && (
              <ServiceStep 
                service={service}
                bookingId={bookingId}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <PropertyStep
                bookingId={bookingId}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <DateTimeStep
                bookingId={bookingId}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <ExtrasStep
                service={service}
                bookingId={bookingId}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 5 && (
              <ReviewStep
                bookingId={bookingId}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
