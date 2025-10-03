import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRegions, getSuburbsByRegion, updateBooking, upsertBookingItem, Region, Suburb } from '@/services/booking-service';
import { toast } from 'sonner';
import { Minus, Plus, Home, Bath } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRegions();
    loadUserData();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      loadSuburbs(selectedRegion);
    }
  }, [selectedRegion]);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      setContactEmail(user.email);
    }
  };

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
      setSelectedSuburb(''); // Reset suburb when region changes
    } catch (error) {
      console.error('Error loading suburbs:', error);
      toast.error('Failed to load suburbs');
    }
  };

  const handleSubmit = async () => {
    if (!bookingId) {
      toast.error('No booking found');
      return;
    }

    if (!selectedRegion || !selectedSuburb || !address.trim() || !contactPhone.trim() || !contactEmail.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (bedrooms < 1 || bathrooms < 1) {
      toast.error('Please specify at least 1 bedroom and 1 bathroom');
      return;
    }

    setLoading(true);
    try {
      // Update booking details including contact information
      await updateBooking(bookingId, {
        region_id: selectedRegion,
        suburb_id: selectedSuburb,
        address: address.trim(),
        contact_phone: contactPhone.trim(),
        contact_email: contactEmail.trim(),
        notes: notes.trim() || null
      });

      // Upsert booking items (bedrooms & bathrooms)
      await Promise.all([
        upsertBookingItem(bookingId, 'bedroom', bedrooms, 0),
        upsertBookingItem(bookingId, 'bathroom', bathrooms, 0)
      ]);

      toast.success('Property details saved');
      onNext();
    } catch (error) {
      console.error('Error saving property details:', error);
      toast.error('Failed to save property details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Property Details</h2>
        <p className="text-muted-foreground">Tell us about your property</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location & Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb *</Label>
              <Select 
                value={selectedSuburb} 
                onValueChange={setSelectedSuburb}
                disabled={!selectedRegion}
              >
                <SelectTrigger id="suburb">
                  <SelectValue placeholder="Select suburb" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {suburbs.map((suburb) => (
                    <SelectItem key={suburb.id} value={suburb.id}>
                      {suburb.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              placeholder="123 Main Street"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+27 12 345 6789"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Contact Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Special Instructions (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or access details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Home Size</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Bedrooms */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                <Label className="text-base font-semibold">Bedrooms *</Label>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                  disabled={bedrooms <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <Input
                    type="number"
                    min="1"
                    max="8"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Math.min(8, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="text-center text-xl font-bold"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setBedrooms(Math.min(8, bedrooms + 1))}
                  disabled={bedrooms >= 8}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">Min: 1, Max: 8</p>
            </div>

            {/* Bathrooms */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-primary" />
                <Label className="text-base font-semibold">Bathrooms *</Label>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                  disabled={bathrooms <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <Input
                    type="number"
                    min="1"
                    max="6"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Math.min(6, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="text-center text-xl font-bold"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setBathrooms(Math.min(6, bathrooms + 1))}
                  disabled={bathrooms >= 6}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">Min: 1, Max: 6</p>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              The size of your home helps us estimate the cleaning duration and assign the right team size.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
          {loading ? 'Saving...' : 'Continue to Date & Time'}
        </Button>
      </div>
    </div>
  );
}
