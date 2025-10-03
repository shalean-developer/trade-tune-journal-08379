import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getServiceExtras, ServiceExtra } from '@/services/booking-service';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/services/booking-service';
import { toast } from 'sonner';

interface ExtrasStepProps {
  service: Service;
  bookingId: string | null;
  onNext: () => void;
  onBack: () => void;
}

export function ExtrasStep({ service, bookingId, onNext, onBack }: ExtrasStepProps) {
  const [extras, setExtras] = useState<ServiceExtra[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExtras();
  }, [service.id]);

  const loadExtras = async () => {
    try {
      const data = await getServiceExtras(service.id);
      setExtras(data);
    } catch (error) {
      console.error('Error loading extras:', error);
      toast.error('Failed to load extras');
    }
  };

  const toggleExtra = (extraId: string) => {
    const newSelected = new Set(selectedExtras);
    if (newSelected.has(extraId)) {
      newSelected.delete(extraId);
    } else {
      newSelected.add(extraId);
    }
    setSelectedExtras(newSelected);
  };

  const calculateTotal = () => {
    return extras
      .filter(extra => selectedExtras.has(extra.id))
      .reduce((sum, extra) => sum + Number(extra.price), 0);
  };

  const handleSubmit = async () => {
    if (!bookingId) {
      toast.error('Booking session not found');
      return;
    }

    setLoading(true);
    try {
      // Delete existing extras
      await supabase
        .from('booking_extras')
        .delete()
        .eq('booking_id', bookingId);

      // Insert selected extras
      if (selectedExtras.size > 0) {
        const extrasToInsert = Array.from(selectedExtras).map(extraId => {
          const extra = extras.find(e => e.id === extraId);
          return {
            booking_id: bookingId,
            service_extra_id: extraId,
            line_total: extra?.price || 0
          };
        });

        await supabase
          .from('booking_extras')
          .insert(extrasToInsert);
      }

      onNext();
    } catch (error) {
      console.error('Error saving extras:', error);
      toast.error('Failed to save extras');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Extras (Optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {extras.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No extras available for this service
          </p>
        ) : (
          <div className="space-y-4">
            {extras.map((extra) => (
              <div
                key={extra.id}
                className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={extra.id}
                  checked={selectedExtras.has(extra.id)}
                  onCheckedChange={() => toggleExtra(extra.id)}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={extra.id}
                    className="font-medium cursor-pointer"
                  >
                    {extra.name}
                  </Label>
                  {extra.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {extra.description}
                    </p>
                  )}
                </div>
                <span className="font-semibold">
                  +R{Number(extra.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {selectedExtras.size > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Extras Total:</span>
              <span className="text-lg font-bold">
                R{calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
            {loading ? 'Saving...' : 'Continue to Review'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
