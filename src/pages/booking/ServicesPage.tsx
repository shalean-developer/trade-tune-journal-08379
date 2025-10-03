import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sparkles, Home, Building, Package, Hotel, HardHat, MapPin, Monitor, Menu, GraduationCap, ArrowRight, Star, Check } from 'lucide-react';
import { getServices, Service } from '@/services/booking-service';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import Footer from '@/components/landing/Footer';

const serviceIcons: Record<string, any> = {
  'standard-cleaning': Home,
  'deep-cleaning': Sparkles,
  'move-in-out': Package,
  'airbnb-cleaning': Hotel,
  'post-construction': HardHat,
};

export default function ServicesPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Animation variants
  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 60 : 80,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: isMobile ? 0.2 : 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 40 : 50,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Professional Cleaning Services | Shalean Cleaning Services</title>
        <meta name="description" content="Professional cleaning services in South Africa. Standard, Deep, Move-In/Out, Airbnb, and Post-Construction cleaning." />
        <meta name="keywords" content="cleaning services, professional cleaning, South Africa, home cleaning, office cleaning, deep cleaning" />
        <link rel="canonical" href="https://shalean.lovable.dev/booking/services" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shalean.lovable.dev/booking/services" />
        <meta property="og:title" content="Professional Cleaning Services | Shalean Cleaning Services" />
        <meta property="og:description" content="Professional cleaning solutions tailored to your needs across South Africa" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://shalean.lovable.dev/booking/services" />
        <meta property="twitter:title" content="Professional Cleaning Services | Shalean Cleaning Services" />
        <meta property="twitter:description" content="Professional cleaning solutions tailored to your needs across South Africa" />
      </Helmet>

      {/* Navigation Header */}
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <img 
                src="/shalean-logo.png" 
                alt="Shalean Logo" 
                className={`${isMobile ? 'h-8' : 'h-10'} w-auto object-contain`}
              />
            </div>
            
            {!isMobile ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      onClick={() => navigate('/booking/services')}
                    >
                      Services
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      onClick={() => navigate('/wiggly')}
                    >
                      Contact
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="flex flex-col space-y-4 pt-4">
                    <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                    
                    <div className="space-y-3">
                      <button 
                        className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                        onClick={() => {
                          navigate('/booking/services');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div>
                          <div className="font-medium text-sm">Services</div>
                          <div className="text-xs text-muted-foreground">View our cleaning services</div>
                        </div>
                      </button>
                      
                      <button 
                        className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                        onClick={() => {
                          navigate('/wiggly');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div>
                          <div className="font-medium text-sm">Contact</div>
                          <div className="text-xs text-muted-foreground">Get in touch</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
              <Button 
                onClick={() => navigate('/booking/flow')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                size={isMobile ? "sm" : "default"}
              >
                {isMobile ? "Book" : "Book Now"}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
        variants={sectionVariants}
        className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10"
      >
        <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Professional Cleaning Services</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
            >
              Our Cleaning Services
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Professional cleaning solutions tailored to your needs across South Africa
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button 
                size="lg"
                onClick={() => navigate('/booking/flow')}
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Book a Service
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => {
                  const servicesSection = document.getElementById('services-grid');
                  servicesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Services
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm"
            >
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="text-muted-foreground">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Certified Professionals</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Eco-Friendly Products</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section
        id="services-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
        variants={sectionVariants}
        className="py-16 sm:py-24"
      >
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div key={i} variants={cardVariants}>
                  <Card className="animate-pulse h-full">
                    <CardHeader>
                      <div className="h-12 w-12 bg-muted rounded-lg mb-4" />
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-10 bg-muted rounded" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const Icon = serviceIcons[service.slug] || Home;
                return (
                  <motion.div
                    key={service.id}
                    variants={cardVariants}
                    custom={index}
                  >
                    <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-border/50 hover:border-primary/50 flex flex-col h-full bg-card/50 backdrop-blur">
                      <CardHeader>
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {service.description || 'Professional cleaning service'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <span className="text-3xl font-bold">
                              R{service.base_price.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">from</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                          onClick={() => handleServiceSelect(service.slug)}
                        >
                          Book Now
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
        variants={sectionVariants}
        className="py-16 sm:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.h2
              variants={cardVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              Why Choose Shalean?
            </motion.h2>
            <motion.p
              variants={cardVariants}
              className="text-lg text-muted-foreground"
            >
              We deliver excellence in every clean
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Certified Professionals",
                description: "Our team is trained and certified to provide the highest quality service"
              },
              {
                icon: Check,
                title: "Eco-Friendly",
                description: "We use environmentally safe products that are safe for your family and pets"
              },
              {
                icon: Sparkles,
                title: "Satisfaction Guaranteed",
                description: "We're not happy until you're happy. 100% satisfaction guaranteed"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                custom={index}
              >
                <Card className="text-center p-6 hover:shadow-xl transition-shadow border-border/50">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
