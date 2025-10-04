import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ServiceExtra } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useBookingState } from "@/hooks/use-booking-state";
import { ProgressIndicator } from "@/components/booking/ProgressIndicator";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { MobileSummaryDrawer } from "@/components/booking/MobileSummaryDrawer";
import * as LucideIcons from "lucide-react";

export default function PropertyDetailsPage() {
  const { serviceSlug } = useParams();
  const navigate = useNavigate();
  const [extras, setExtras] = useState<ServiceExtra[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    service,
    bedrooms,
    bathrooms,
    extras: selectedExtras,
    specialInstructions,
    setBedrooms,
    setBathrooms,
    toggleExtra,
    setSpecialInstructions,
  } = useBookingState();

  useEffect(() => {
    if (!service || service.slug !== serviceSlug) {
      navigate("/booking/service/select");
      return;
    }
    fetchExtras();
  }, [service, serviceSlug]);

  const fetchExtras = async () => {
    try {
      const { data, error } = await supabase
        .from("service_extras")
        .select("*")
        .eq("is_active", true)
        .order("price");

      if (error) throw error;
      setExtras(data || []);
    } catch (error: any) {
      toast.error("Failed to load extras");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isExtraSelected = (extraId: string) => {
    return selectedExtras.some(e => e.extra.id === extraId);
  };

  const handleNext = () => {
    navigate("/booking/schedule");
  };

  const handleBack = () => {
    navigate("/booking/service/select");
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  if (!service) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24 lg:pb-8">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <ProgressIndicator currentStep={2} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Property Details</h1>
              <p className="text-muted-foreground">
                Tell us about your property and select any additional services
              </p>
            </div>

            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Property Size</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="mb-2 block">Bedrooms</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setBedrooms(bedrooms - 1)}
                      disabled={bedrooms <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-2xl font-semibold w-12 text-center">{bedrooms}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setBedrooms(bedrooms + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Bathrooms</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setBathrooms(bathrooms - 1)}
                      disabled={bathrooms <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-2xl font-semibold w-12 text-center">{bathrooms}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setBathrooms(bathrooms + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Additional Services</h2>
              
              {loading ? (
                <p className="text-muted-foreground">Loading extras...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {extras.map((extra) => (
                    <div
                      key={extra.id}
                      className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/5 transition-colors cursor-pointer"
                      onClick={() => toggleExtra(extra)}
                    >
                      <Checkbox
                        id={extra.id}
                        checked={isExtraSelected(extra.id)}
                        onCheckedChange={() => toggleExtra(extra)}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={extra.id}
                          className="flex items-center gap-2 font-medium cursor-pointer"
                        >
                          {getIcon(extra.icon)}
                          {extra.name}
                        </Label>
                        {extra.description && (
                          <p className="text-sm text-muted-foreground mt-1">{extra.description}</p>
                        )}
                        <p className="text-sm font-semibold text-primary mt-1">
                          +R{extra.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Special Instructions</h2>
              <Textarea
                placeholder="Any special requests or areas that need extra attention? (optional)"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Next: Schedule
              </Button>
            </div>
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
