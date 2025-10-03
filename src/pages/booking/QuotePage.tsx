import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/landing/Footer';

const serviceTypes = [
  { value: 'standard-cleaning', label: 'Standard Cleaning' },
  { value: 'deep-cleaning', label: 'Deep Cleaning' },
  { value: 'move-in-out', label: 'Move In/Out Cleaning' },
  { value: 'airbnb-cleaning', label: 'Airbnb Cleaning' },
  { value: 'post-construction', label: 'Post-Construction Cleaning' },
  { value: 'other', label: 'Other / Not Sure' },
];

const availableExtras = [
  { id: 'oven-cleaning', name: 'Oven Cleaning', price: 150, description: 'Deep cleaning of oven interior and exterior' },
  { id: 'fridge-cleaning', name: 'Fridge Cleaning', price: 100, description: 'Interior and exterior fridge cleaning' },
  { id: 'window-cleaning', name: 'Window Cleaning', price: 200, description: 'Interior and exterior window cleaning' },
  { id: 'carpet-cleaning', name: 'Carpet Cleaning', price: 300, description: 'Deep carpet cleaning per room' },
  { id: 'laundry-service', name: 'Laundry Service', price: 150, description: 'Washing, drying, and folding service' },
  { id: 'ironing-service', name: 'Ironing Service', price: 100, description: 'Professional ironing service' },
];

export default function QuotePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    message: '',
  });

  const toggleExtra = (extraId: string) => {
    const newSelected = new Set(selectedExtras);
    if (newSelected.has(extraId)) {
      newSelected.delete(extraId);
    } else {
      newSelected.add(extraId);
    }
    setSelectedExtras(newSelected);
  };

  const calculateExtrasTotal = () => {
    return availableExtras
      .filter(extra => selectedExtras.has(extra.id))
      .reduce((sum, extra) => sum + extra.price, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.serviceType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Prepare extras data
      const extrasData = availableExtras
        .filter(extra => selectedExtras.has(extra.id))
        .map(extra => ({
          id: extra.id,
          name: extra.name,
          price: extra.price,
        }));

      // Insert quote request into database
      const { error } = await supabase
        .from('quote_requests')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          service_type: formData.serviceType,
          address: formData.address || null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          message: formData.message || null,
          extras: extrasData,
          status: 'pending',
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success('Quote request submitted successfully!');
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Helmet>
          <title>Quote Submitted | Shalean Cleaning Services</title>
        </Helmet>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Quote Request Submitted!</CardTitle>
              <CardDescription>
                Thank you for your interest. We'll review your request and get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>A confirmation email has been sent to:</p>
                <p className="font-medium text-foreground mt-1">{formData.email}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
                <Button
                  onClick={() => navigate('/booking/services')}
                  className="flex-1"
                >
                  Browse Services
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Get a Free Quote | Shalean Cleaning Services</title>
        <meta name="description" content="Request a free quote for professional cleaning services in South Africa. Quick response within 24 hours." />
      </Helmet>

      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/shalean-logo.png" alt="Shalean Logo" className="h-10 w-auto object-contain" />
            </div>
            <Button variant="ghost" onClick={() => navigate('/booking/services')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </div>
        </div>
      </nav>

      {/* Quote Form */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Get a Free Quote</h1>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours with a customized quote
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Tell us about your cleaning needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+27 123 456 789"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                      />
                    </div>

                    {/* Service Type */}
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Select value={formData.serviceType} onValueChange={(value) => handleChange('serviceType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              {service.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Property Details */}
                    <div className="space-y-2">
                      <Label htmlFor="address">Property Address (Optional)</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street, Cape Town"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          min="0"
                          placeholder="2"
                          value={formData.bedrooms}
                          onChange={(e) => handleChange('bedrooms', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          min="0"
                          placeholder="1"
                          value={formData.bathrooms}
                          onChange={(e) => handleChange('bathrooms', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Extras Section */}
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Add Extras (Optional)</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select additional services to enhance your cleaning
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {availableExtras.map((extra) => (
                          <div
                            key={extra.id}
                            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => toggleExtra(extra.id)}
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
                              <p className="text-sm text-muted-foreground">
                                {extra.description}
                              </p>
                            </div>
                            <span className="font-semibold text-primary">
                              +R{extra.price}
                            </span>
                          </div>
                        ))}
                      </div>

                      {selectedExtras.size > 0 && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Extras Total:</span>
                            <span className="text-lg font-bold text-primary">
                              R{calculateExtrasTotal()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Information (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your cleaning needs, special requirements, or preferred schedule..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Quote Request
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By submitting this form, you agree to be contacted by Shalean Cleaning Services regarding your quote request.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
