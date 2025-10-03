import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service } from '@/services/booking-service';

interface ServiceStepProps {
  service: Service;
  bookingId: string | null;
  onNext: () => void;
}

export function ServiceStep({ service, bookingId, onNext }: ServiceStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Service Package</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 border rounded-lg bg-muted/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {service.description || 'Professional cleaning service'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">R{service.base_price.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Starting price</p>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm">Professional cleaning team</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm">All cleaning supplies included</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm">Satisfaction guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm">Flexible scheduling</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> Final pricing will be calculated based on your property size and selected extras.
          </p>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={onNext}
        >
          Continue to Property Details
        </Button>
      </CardContent>
    </Card>
  );
}
