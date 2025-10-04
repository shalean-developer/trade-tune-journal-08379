import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookingState } from "@/hooks/use-booking-state";
import { Calendar, Clock, Home, User, Sparkles } from "lucide-react";
import { format } from "date-fns";

export const BookingSummary = () => {
  const { service, bedrooms, bathrooms, extras, date, time, frequency, cleaner, getSummary } = useBookingState();
  const summary = getSummary();

  if (!service) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">Select a service to see booking details</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Booking Summary</h3>
        <Separator />
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{service.name}</p>
            <p className="text-xs text-muted-foreground">₦{service.base_price.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-primary flex-shrink-0" />
          <p className="text-sm">
            {bedrooms} Bedroom{bedrooms !== 1 ? 's' : ''}, {bathrooms} Bathroom{bathrooms !== 1 ? 's' : ''}
          </p>
        </div>

        {extras.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Extras:</p>
            {extras.map(({ extra }) => (
              <div key={extra.id} className="flex justify-between text-sm pl-6">
                <span>{extra.name}</span>
                <span>₦{extra.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {date && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm">{format(date, 'PPP')}</p>
          </div>
        )}

        {time && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm">{time}</p>
          </div>
        )}

        {frequency !== 'once-off' && (
          <div className="bg-primary/10 rounded-lg p-2">
            <p className="text-xs font-medium capitalize">{frequency.replace('-', ' ')} Service</p>
          </div>
        )}

        {cleaner && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm">{cleaner.name}</p>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₦{summary.subtotal.toLocaleString()}</span>
        </div>

        {summary.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({frequency})</span>
            <span>-₦{summary.discount.toLocaleString()}</span>
          </div>
        )}

        {summary.serviceFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Fee</span>
            <span>₦{summary.serviceFee.toLocaleString()}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">₦{summary.total.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
};
