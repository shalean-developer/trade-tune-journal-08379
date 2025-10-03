import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRegions, getSuburbsByRegion, updateBooking, Region, Suburb } from '@/services/booking-service';
import { toast } from 'sonner';

interface PropertyStepProps {
  bookingId: string | null;
  onNext: () => void;
  onBack: () => void;
}

export function PropertyStep({ bookingId, onNext, onBack }: PropertyStepProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRegions();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      loadSuburbs(selectedRegion);
    } else {
      setSuburbs([]);
      setSelectedSuburb('');
    }
  }, [selectedRegion]);

  const loadRegions = async () => {
    try {
      const data = await getRegions();
      setRegions(data);
    } catch (error) {
      console.error('Error loading regions:', error);
      toast.error('Failed to load regions');
    }
  };

  const loadSuburbs = async (regionId: string) => {
    try {
      const data = await getSuburbsByRegion(regionId);
      setSuburbs(data);
    } catch (error) {
      console.error('Error loading suburbs:', error);
      toast.error('Failed to load suburbs');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRegion || !selectedSuburb || !address.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!bookingId) {
      toast.error('Booking session not found');
      return;
    }

    setLoading(true);
    try {
      await updateBooking(bookingId, {
        region_id: selectedRegion,
        suburb_id: selectedSuburb,
        address: address.trim(),
        notes: notes.trim() || null,
      });

      onNext();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to save property details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="region">Region *</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="suburb">Suburb *</Label>
              <Select 
                value={selectedSuburb} 
                onValueChange={setSelectedSuburb}
                disabled={!selectedRegion}
              >
                <SelectTrigger id="suburb">
                  <SelectValue placeholder="Select suburb" />
                </SelectTrigger>
                <SelectContent>
                  {suburbs.map((suburb) => (
                    <SelectItem key={suburb.id} value={suburb.id}>
                      {suburb.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full street address"
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for our team? (e.g., gate code, parking info)"
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Saving...' : 'Continue to Date & Time'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
