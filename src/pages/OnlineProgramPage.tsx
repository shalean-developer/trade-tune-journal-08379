import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Video, Users, Calendar, CheckCircle } from 'lucide-react';
import Footer from '@/components/landing/Footer';
import { Badge } from '@/components/ui/badge';

export default function OnlineProgramPage() {
  const navigate = useNavigate();

  const benefits = [
    "Live online sessions with expert instructors",
    "Learn from anywhere at your own pace",
    "Recorded sessions for review anytime",
    "Interactive Q&A and discussion forums",
    "Digital resources and training materials",
    "Virtual hands-on demonstrations"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Online Training Program | Shalean</title>
        <meta name="description" content="Join our online cleaning training program. Learn professional cleaning techniques from anywhere with live sessions and expert instructors." />
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
              <Monitor className="w-3 h-3 mr-1" />
              Remote Learning
            </Badge>
            <h1 className="text-5xl font-bold mb-6">Online Training Program</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Learn professional cleaning techniques from the comfort of your home with live online sessions and expert guidance.
            </p>
            <Button size="lg" onClick={() => navigate('/haven-ark/signup')}>
              Register for Online Program
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
                  <Video className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Live Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Weekly live training sessions with Q&A</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Calendar className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>6-week self-paced program</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Access to online community and forums</CardDescription>
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
            <h2 className="text-4xl font-bold mb-6">Start Learning Today</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of students already enrolled in our online program. Start your journey now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/haven-ark/signup')}>
                Enroll Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/booking/quote')}>
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
