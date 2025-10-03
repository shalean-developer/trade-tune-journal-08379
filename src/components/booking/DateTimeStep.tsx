import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { updateBooking } from '@/services/booking-service';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DateTimeStepProps {
  bookingId: string | null;
  onNext: () => void;
  onBack: () => void;
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

export function DateTimeStep({ bookingId, onNext, onBack }: DateTimeStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    if (!bookingId) {
      toast.error('Booking session not found');
      return;
    }

    setLoading(true);
    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(':');
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Assume 3 hour duration for now
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 3);

      await updateBooking(bookingId, {
        start_ts: startDateTime.toISOString(),
        end_ts: endDateTime.toISOString(),
      });

      onNext();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to save date and time');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Date & Time</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Preferred Date</Label>
          <div className="mt-2 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="rounded-md border"
            />
          </div>
        </div>

        {selectedDate && (
          <div>
            <Label>Preferred Time</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
              {TIME_SLOTS.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? 'default' : 'outline'}
                  onClick={() => setSelectedTime(time)}
                  className="w-full"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {selectedDate && selectedTime && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Selected booking time:</p>
            <p className="text-lg">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1" 
            disabled={loading || !selectedDate || !selectedTime}
          >
            {loading ? 'Saving...' : 'Continue to Extras'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
