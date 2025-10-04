import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Calendar, Clock, CheckCircle } from 'lucide-react';
import Footer from '@/components/landing/Footer';
import { Badge } from '@/components/ui/badge';

export default function OfflineProgramPage() {
  const navigate = useNavigate();

  const benefits = [
    "Face-to-face mentorship with experienced cleaners",
    "Hands-on practice with professional equipment",
    "Networking with fellow trainees and professionals",
    "Real-time feedback and personalized guidance",
    "On-site training at actual cleaning locations",
    "Team building and collaboration exercises"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Offline Training Program | Shalean</title>
        <meta name="description" content="Join our in-person cleaning training program in Cape Town. Learn with hands-on experience and face-to-face mentorship from industry experts." />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <img 
                src="/shalean-logo.png" 
                alt="Shalean" 
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
              <MapPin className="w-3 h-3 mr-1" />
              In-Person Training
            </Badge>
            <h1 className="text-5xl font-bold mb-6">Offline Training Program</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Experience hands-on learning with face-to-face mentorship from our expert cleaners in Cape Town.
            </p>
            <Button size="lg" onClick={() => navigate('/haven-ark/signup')}>
              Register for Offline Program
            </Button>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Cape Town, South Africa</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Calendar className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>4-week intensive program</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Monday - Friday, 9 AM - 4 PM</CardDescription>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-center mb-12">Program Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-lg">{benefit}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Join?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Limited spots available for our next cohort. Register now to secure your place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/haven-ark/signup')}>
                Register Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/booking/service/select')}>
                Request Information
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
