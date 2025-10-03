import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, Building, Package, Hotel, HardHat } from 'lucide-react';
import { getServices, Service } from '@/services/booking-service';
import { toast } from 'sonner';

const serviceIcons: Record<string, any> = {
  'standard-cleaning': Home,
  'deep-cleaning': Sparkles,
  'move-in-out': Package,
  'airbnb-cleaning': Hotel,
  'post-construction': HardHat,
};

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (slug: string) => {
    navigate(`/booking/service/${slug}`);
  };

  return (
    <>
      <Helmet>
        <title>Our Cleaning Services | Shalean Cleaning Services</title>
        <meta name="description" content="Professional cleaning services in South Africa. Standard, Deep, Move-In/Out, Airbnb, and Post-Construction cleaning." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Cleaning Services
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional cleaning solutions tailored to your needs across South Africa
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = serviceIcons[service.slug] || Home;
                return (
                  <Card 
                    key={service.id}
                    className="hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {service.description || 'Professional cleaning service'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold">
                          R{service.base_price.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">from</span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => handleServiceSelect(service.slug)}
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
