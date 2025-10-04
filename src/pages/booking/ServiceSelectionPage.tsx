import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/booking";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useBookingState } from "@/hooks/use-booking-state";
import { ProgressIndicator } from "@/components/booking/ProgressIndicator";
import { MobileSummaryDrawer } from "@/components/booking/MobileSummaryDrawer";

export default function ServiceSelectionPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setService } = useBookingState();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("base_price");

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast.error("Failed to load services");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (service: Service) => {
    setService(service);
    navigate(`/booking/service/${service.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <ProgressIndicator currentStep={1} />
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24 lg:pb-8">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <ProgressIndicator currentStep={1} />
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Choose Your Service</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the cleaning service that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                {service.image_url && (
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {service.name}
                </CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price:</span>
                    <span className="font-semibold">₦{service.base_price.toLocaleString()}</span>
                  </div>
                  {service.bedroom_price > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Per Bedroom:</span>
                      <span>+₦{service.bedroom_price.toLocaleString()}</span>
                    </div>
                  )}
                  {service.bathroom_price > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Per Bathroom:</span>
                      <span>+₦{service.bathroom_price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSelectService(service)}
                  className="w-full"
                >
                  Select Service
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <MobileSummaryDrawer />
    </div>
  );
}
