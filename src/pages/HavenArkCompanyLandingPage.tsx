import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/landing/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { 
  MapPin, 
  Monitor, 
  Menu, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  Award,
  BookOpen,
  Sparkles,
  Target,
  Shield,
  ChevronRight,
  BarChart3,
  Zap,
  Brain,
  Linkedin,
  Star,
  Quote
} from 'lucide-react';
import { motion } from 'framer-motion';

const HavenArkCompanyLandingPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { label: "Happy Customers", value: "2,000+", icon: Users },
    { label: "Satisfaction Rate", value: "98%", icon: Award },
    { label: "Professional Cleaners", value: "50+", icon: Target },
    { label: "Hours Cleaned", value: "10,000+", icon: BookOpen }
  ];

  const features = [
    {
      icon: Users,
      title: "Expert Cleaners",
      description: "Background-checked, trained professionals committed to excellence",
      color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: Sparkles,
      title: "Flexible Scheduling",
      description: "Book same-day or in advance with easy online scheduling",
      color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30"
    },
    {
      icon: Shield,
      title: "Transparent Pricing",
      description: "Clear quotes with no hidden fees, ever",
      color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
    },
    {
      icon: Zap,
      title: "Secure Payments",
      description: "Paystack checkout with email receipts for your peace of mind",
      color: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30"
    }
  ];

  const offerings = [
    {
      title: "Standard Cleaning",
      description: "Regular home cleaning to maintain your space fresh and tidy",
      image: "/lovable-uploads/standard-cleaning.png",
      link: "/booking/services",
      badge: "Popular"
    },
    {
      title: "Deep Cleaning",
      description: "Thorough deep clean for every corner of your home or office",
      image: "/lovable-uploads/deep-cleaning.png",
      link: "/booking/services",
      badge: "Recommended"
    },
    {
      title: "Airbnb Turnover",
      description: "Fast, professional cleaning between guests for hosts",
      image: "/lovable-uploads/airbnb-turnover.png",
      link: "/booking/services",
      badge: "Same-Day"
    }
  ];

  const mentors = [
    {
      name: "Cleaner Profile 1",
      role: "Deep Cleaning Specialist",
      experience: "5+ Years",
      specialization: "Deep Cleaning & Airbnb Turnovers",
      image: "/lovable-uploads/cleaner-profile-1.png",
      linkedin: "#",
      achievements: ["Certified Professional", "500+ Happy Clients", "Airbnb Superhost Approved"]
    },
    {
      name: "Cleaner Profile 2",
      role: "Office Cleaning Expert",
      experience: "7+ Years",
      specialization: "Office Cleaning & Move-In/Out Services",
      image: "/lovable-uploads/cleaner-profile-2.png",
      linkedin: "#",
      achievements: ["Background Checked", "Corporate Trained", "Eco-Friendly Certified"]
    },
    {
      name: "Cleaner Profile 3",
      role: "Residential Care Specialist",
      experience: "6+ Years",
      specialization: "Trusted by families for reliable home care",
      image: "/lovable-uploads/cleaner-profile-3.png",
      linkedin: "#",
      achievements: ["Trusted by Families", "Detail-Oriented", "Flexible Scheduling"]
    }
  ];

  const newsOutlets = [
    {
      name: "Customer Review 1",
      logo: "/lovable-uploads/review-icon.png",
      feature: "Excellent service, very thorough"
    },
    {
      name: "Customer Review 2",
      logo: "/lovable-uploads/review-icon.png",
      feature: "Professional and reliable cleaners"
    },
    {
      name: "Customer Review 3",
      logo: "/lovable-uploads/review-icon.png",
      feature: "Best cleaning service in Cape Town"
    },
    {
      name: "Customer Review 4",
      logo: "/lovable-uploads/review-icon.png",
      feature: "Amazing attention to detail"
    },
    {
      name: "Customer Review 5",
      logo: "/lovable-uploads/review-icon.png",
      feature: "Spotless results every time"
    },
    {
      name: "Customer Review 6",
      logo: "/lovable-uploads/review-icon.png",
      feature: "Highly recommend their services"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Shalean Cleaning Services — Book Trusted Cleaners in Cape Town</title>
        <meta name="description" content="Cape Town home & office cleaning. Standard, Deep, Move-In/Out, Airbnb & Post-Construction services. Easy booking, vetted cleaners, secure payments." />
        <meta name="keywords" content="Cape Town cleaning, professional cleaners, Airbnb cleaning, deep cleaning, office cleaning, home cleaning services" />
        <link rel="canonical" href="https://shalean.com/" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shalean.com/" />
        <meta property="og:title" content="Shalean Cleaning Services — Book Trusted Cleaners in Cape Town" />
        <meta property="og:description" content="Professional cleaning services in Cape Town with vetted cleaners and secure online booking" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Shalean Cleaning Services",
            "description": "Professional cleaning services in Cape Town",
            "url": "https://shalean.com"
          })}
        </script>
      </Helmet>

      {/* Navigation Header */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
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
                      onClick={() => navigate('/masterclass')}
                    >
                      Home
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-foreground hover:text-primary">
                      Services
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[400px] lg:w-[500px]">
                        <NavigationMenuLink asChild>
                          <div 
                            className="group grid h-auto w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                            onClick={() => navigate('/offline-program')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-md bg-primary/10 text-primary">
                                <MapPin className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-medium leading-none">Offline Program</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Face-to-face learning with expert mentors
                                </p>
                              </div>
                            </div>
                          </div>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <div 
                            className="group grid h-auto w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                            onClick={() => navigate('/online-program')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <Monitor className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-medium leading-none">Online Program</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Learn from anywhere with live sessions
                                </p>
                              </div>
                            </div>
                          </div>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      onClick={() => navigate('/academy')}
                    >
                      How It Works
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      onClick={() => navigate('/wiggly')}
                    >
                      <span>Contact</span>
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
                          navigate('/masterclass');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                            <Award className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Home</div>
                            <div className="text-xs text-muted-foreground">Back to home</div>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Services</h3>
                      
                      <button 
                        className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                        onClick={() => {
                          navigate('/offline-program');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-primary/10 text-primary">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Offline Program</div>
                            <div className="text-xs text-muted-foreground">Face-to-face learning</div>
                          </div>
                        </div>
                      </button>
                      
                      <button 
                        className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                        onClick={() => {
                          navigate('/online-program');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Monitor className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Online Program</div>
                            <div className="text-xs text-muted-foreground">Learn from anywhere</div>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="space-y-3">
                      <button 
                        className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                        onClick={() => {
                          navigate('/academy');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <GraduationCap className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">How It Works</div>
                            <div className="text-xs text-muted-foreground">Learn about our process</div>
                          </div>
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
                variant="ghost" 
                onClick={() => window.open('https://havenark.exlyapp.com/eud/login/email', '_blank')}
                className="hover:text-primary"
                size={isMobile ? "sm" : "default"}
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/haven-ark/signup')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                size={isMobile ? "sm" : "default"}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              Cape Town's Trusted Cleaning Service
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent px-4">
              Transform Your Home & Office Cleaning Experience
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Book trusted cleaners in Cape Town. Standard, Deep, Move-In/Out, Airbnb & more — vetted professionals, transparent pricing, and secure online booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/booking/services')}
                className="w-full sm:w-auto group"
              >
                Book a Cleaner
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/booking/quote')}
                className="w-full sm:w-auto"
              >
                Get a Free Quote
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 lg:mt-16 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-primary" />
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Masterclass Preview Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <Badge className="mb-4">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Our Services
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Experience Our Cleaning Services
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Choose from a wide range of professional cleaning services tailored to your needs.
                </p>
                
                <div className="space-y-4 mb-8">
                  {[
                    { title: "Standard Cleaning", desc: "Regular maintenance for homes and offices" },
                    { title: "Deep Cleaning", desc: "Thorough cleaning for every corner" },
                    { title: "Move-In / Move-Out", desc: "Complete cleaning for property transitions" },
                    { title: "Airbnb Turnover", desc: "Fast turnaround between guests" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button 
                  size="lg" 
                  onClick={() => navigate('/booking/services')}
                  className="group"
                >
                  View All Services
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="overflow-hidden shadow-2xl">
                  <img 
                    src="/lovable-uploads/cleaner-working.png"
                    alt="Professional Cleaning Service"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">2,000+ Customers</p>
                        <p className="text-xs text-muted-foreground">Join our happy community</p>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Card className="p-4 bg-background/80 backdrop-blur">
                    <div className="text-2xl font-bold text-primary mb-1">98%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                  </Card>
                  <Card className="p-4 bg-background/80 backdrop-blur">
                    <div className="text-2xl font-bold text-primary mb-1">Same Day</div>
                    <div className="text-sm text-muted-foreground">Booking Available</div>
                  </Card>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <Badge className="mb-4">Why Choose Shalean</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Everything You Need for a Sparkling Clean</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              From homes to offices, we provide reliable cleaning solutions for every space
            </p>
          </motion.div>

          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 flex md:flex-none overflow-x-auto pb-4 -mx-4 px-4 gap-4 snap-x snap-mandatory scrollbar-hide">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="snap-center shrink-0 w-72 md:w-auto"
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <Badge className="mb-4">Our Blog</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Cleaning Tips & Insights</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Expert advice and helpful resources for maintaining a spotless space
            </p>
          </motion.div>

          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:grid md:grid-cols-3 md:gap-8 md:max-w-6xl md:mx-auto flex md:flex-none overflow-x-auto pb-4 -mx-4 px-4 gap-6 snap-x snap-mandatory scrollbar-hide">
            {offerings.map((offering, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="snap-center shrink-0 w-80 md:w-auto"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group h-full"
                  onClick={() => navigate(offering.link)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={offering.image} 
                      alt={offering.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 right-4">{offering.badge}</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {offering.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{offering.description}</p>
                    <Button variant="ghost" className="group/btn">
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <Badge className="mb-4">Our Team</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Meet Our Trusted Cleaners</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Our professional team is vetted, trained, and committed to your satisfaction
            </p>
          </motion.div>

          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:grid md:grid-cols-3 md:gap-8 md:max-w-6xl md:mx-auto flex md:flex-none overflow-x-auto pb-4 -mx-4 px-4 gap-6 snap-x snap-mandatory scrollbar-hide">
            {mentors.map((mentor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="snap-center shrink-0 w-80 md:w-auto"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 h-full">
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                    <img 
                      src={mentor.image} 
                      alt={mentor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-background/90 backdrop-blur">
                        <Star className="w-3 h-3 mr-1 fill-primary text-primary" />
                        {mentor.experience}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{mentor.name}</h3>
                        <p className="text-sm text-primary font-medium">{mentor.role}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 font-medium">
                      {mentor.specialization}
                    </p>
                    <div className="space-y-2">
                      {mentor.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                          <span className="text-muted-foreground">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured In Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <Badge className="mb-4">Customer Reviews</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Loved by Customers Across Cape Town</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              See what our satisfied customers are saying about our cleaning services
            </p>
          </motion.div>

          {/* Mobile: Horizontal scroll with 2 columns visible, Desktop: Grid */}
          <div className="md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-6 md:max-w-6xl md:mx-auto flex md:flex-none overflow-x-auto pb-4 -mx-4 px-4 gap-4 snap-x snap-mandatory scrollbar-hide">
            {newsOutlets.map((outlet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="snap-center shrink-0 w-40 md:w-auto"
              >
                <Card className="p-4 sm:p-6 hover:shadow-lg transition-all hover:-translate-y-1 group cursor-pointer h-full flex flex-col items-center justify-center">
                  <div className="relative w-full h-16 sm:h-20 mb-2 sm:mb-4 flex items-center justify-center">
                    <img 
                      src={outlet.logo} 
                      alt={outlet.name}
                      className="max-w-full max-h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                    {outlet.feature}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <div className="flex items-start space-x-4">
                <Quote className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <p className="text-lg italic mb-4">
                    "Shalean made booking a cleaner so simple. My home has never looked this spotless!"
                  </p>
                  <p className="font-semibold">- Customer Review</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Book Your Cleaner?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of happy customers across Cape Town who trust Shalean for spotless cleaning
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/booking/services')}
                className="w-full sm:w-auto"
              >
                Book Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/booking/quote')}
                className="w-full sm:w-auto"
              >
                Get a Free Quote
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HavenArkCompanyLandingPage;
