import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Cleaner } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useBookingState } from "@/hooks/use-booking-state";
import { ProgressIndicator } from "@/components/booking/ProgressIndicator";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { MobileSummaryDrawer } from "@/components/booking/MobileSummaryDrawer";
import { format } from "date-fns";

export default function ReviewPage() {
  const navigate = useNavigate();
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { service, date, time, cleaner, setCleaner } = useBookingState();

  useEffect(() => {
    if (!service || !date || !time) {
      navigate("/booking/service/select");
      return;
    }
    fetchCleaners();
  }, [service, date, time]);

  const fetchCleaners = async () => {
    try {
      const { data, error } = await supabase
        .from("cleaners")
        .select("*")
        .eq("is_available", true);

      if (error) throw error;
      setCleaners(data || []);
    } catch (error: any) {
      toast.error("Failed to load cleaners");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!cleaner) {
      toast.error("Please select a cleaner");
      return;
    }
    navigate("/booking/payment");
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!service || !date) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24 lg:pb-8">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <ProgressIndicator currentStep={4} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Choose Your Cleaner</h1>
              <p className="text-muted-foreground">
                Select a professional cleaner for {format(date, 'PPP')} at {time}
              </p>
            </div>

            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Available Cleaners</h2>
              
              {loading ? (
                <p className="text-muted-foreground text-center py-8">Loading cleaners...</p>
              ) : cleaners.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No cleaners available for the selected time. Please choose a different time slot.
                </p>
              ) : (
                <div className="space-y-4">
                  {cleaners.map((cleanerOption) => (
                    <div
                      key={cleanerOption.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                        cleaner?.id === cleanerOption.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setCleaner(cleanerOption)}
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={cleanerOption.photo_url || undefined} />
                          <AvatarFallback>
                            {cleanerOption.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{cleanerOption.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{cleanerOption.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-muted-foreground">
                                  {cleanerOption.years_experience} years experience
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {cleanerOption.badges && cleanerOption.badges.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {cleanerOption.badges.map((badge, index) => (
                                <Badge key={index} variant="secondary">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant={cleaner?.id === cleanerOption.id ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCleaner(cleanerOption);
                          }}
                        >
                          {cleaner?.id === cleanerOption.id ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Proceed to Payment
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
