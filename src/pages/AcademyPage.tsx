import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Target, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import Footer from '@/components/landing/Footer';
import { Badge } from '@/components/ui/badge';

export default function AcademyPage() {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      title: "Choose Your Service",
      description: "Browse our range of professional cleaning services and select what best fits your needs.",
      icon: BookOpen
    },
    {
      number: "02",
      title: "Book Online",
      description: "Schedule your cleaning at your convenience with our easy online booking system.",
      icon: Target
    },
    {
      number: "03",
      title: "We Clean",
      description: "Our vetted professionals arrive on time and deliver exceptional cleaning results.",
      icon: Users
    },
    {
      number: "04",
      title: "Enjoy Your Space",
      description: "Relax in your spotless home or office. Book regular cleanings to maintain perfection.",
      icon: Clock
    }
  ];

  const features = [
    "Background-checked and trained professionals",
    "Flexible scheduling including same-day service",
    "Transparent pricing with no hidden fees",
    "100% satisfaction guarantee",
    "Secure online payments with Paystack",
    "Easy rebooking for regular service"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>How It Works | Shalean Cleaning Services</title>
        <meta name="description" content="Learn how Shalean's professional cleaning service works. Simple booking, vetted cleaners, and guaranteed satisfaction in Cape Town." />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <img 
                src="/shalean-logo.png" 
                alt="Shalean Cleaning Services" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Simple Process
            </Badge>
            <h1 className="text-5xl font-bold mb-6">How It Works</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Getting professional cleaning service has never been easier. Follow these simple steps to book your cleaning today.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-24 bg-primary/10 flex items-center justify-center p-6">
                      <span className="text-4xl font-bold text-primary">{step.number}</span>
                    </div>
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-start space-x-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <step.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                            <CardDescription className="text-lg">{step.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Shalean?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Book your first cleaning service today and experience the Shalean difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/booking/services')}>
                Book a Cleaner
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/booking/service/select')}>
                Get a Free Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
