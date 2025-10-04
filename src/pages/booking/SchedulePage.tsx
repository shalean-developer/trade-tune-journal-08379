import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useBookingState } from "@/hooks/use-booking-state";
import { ProgressIndicator } from "@/components/booking/ProgressIndicator";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { MobileSummaryDrawer } from "@/components/booking/MobileSummaryDrawer";
import { Clock } from "lucide-react";
import { addDays, isAfter, isSameDay, setHours, setMinutes } from "date-fns";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00"
];

const FREQUENCIES = [
  { value: 'once-off', label: 'Once-off', discount: 0 },
  { value: 'weekly', label: 'Weekly', discount: 15 },
  { value: 'bi-weekly', label: 'Bi-weekly', discount: 10 },
  { value: 'monthly', label: 'Monthly', discount: 5 },
] as const;

export default function SchedulePage() {
  const navigate = useNavigate();
  const { service, date, time, frequency, setDate, setTime, setFrequency } = useBookingState();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date || undefined);
  const [selectedTime, setSelectedTime] = useState(time);

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate) {
      setDate(newDate);
    }
  };

  const handleTimeSelect = (newTime: string) => {
    setSelectedTime(newTime);
    setTime(newTime);
  };

  const isTimeSlotAvailable = (timeSlot: string) => {
    if (!selectedDate) return true;
    
    const now = new Date();
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotDateTime = setMinutes(setHours(selectedDate, hours), minutes);
    
    // Disable past times if today is selected
    if (isSameDay(selectedDate, now)) {
      return isAfter(slotDateTime, now);
    }
    
    return true;
  };

  const handleNext = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (!selectedTime) {
      toast.error("Please select a time");
      return;
    }
    navigate("/booking/review");
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!service) {
    navigate("/booking/service/select");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24 lg:pb-8">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <ProgressIndicator currentStep={3} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Schedule Your Cleaning</h1>
              <p className="text-muted-foreground">
                Choose your preferred date and time
              </p>
            </div>

            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Select Date</h2>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < addDays(new Date(), 0)}
                  className="rounded-md border"
                />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">Select Time</h2>
              </div>
              
              {!selectedDate ? (
                <p className="text-muted-foreground text-center py-8">
                  Please select a date first
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const available = isTimeSlotAvailable(slot);
                    return (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? "default" : "outline"}
                        disabled={!available}
                        onClick={() => handleTimeSelect(slot)}
                        className="h-12"
                      >
                        {slot}
                      </Button>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Frequency</h2>
              <RadioGroup value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                <div className="space-y-3">
                  {FREQUENCIES.map((freq) => (
                    <div
                      key={freq.value}
                      className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/5 transition-colors cursor-pointer"
                      onClick={() => setFrequency(freq.value)}
                    >
                      <RadioGroupItem value={freq.value} id={freq.value} />
                      <Label
                        htmlFor={freq.value}
                        className="flex-1 cursor-pointer flex justify-between items-center"
                      >
                        <span className="font-medium">{freq.label}</span>
                        {freq.discount > 0 && (
                          <span className="text-sm text-green-600 font-semibold">
                            Save {freq.discount}%
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Next: Review
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
