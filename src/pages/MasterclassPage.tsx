import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Award, Target, CheckCircle } from 'lucide-react';
import Footer from '@/components/landing/Footer';
import { Badge } from '@/components/ui/badge';

export default function MasterclassPage() {
  const navigate = useNavigate();

  const masterclassFeatures = [
    {
      icon: BookOpen,
      title: "Comprehensive Training",
      description: "Learn industry-standard cleaning techniques from experienced professionals"
    },
    {
      icon: Users,
      title: "Hands-On Learning",
      description: "Practice with real-world scenarios and professional equipment"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Receive professional certification upon completion"
    },
    {
      icon: Target,
      title: "Career Support",
      description: "Job placement assistance and ongoing career guidance"
    }
  ];

  const curriculum = [
    "Professional cleaning standards and safety protocols",
    "Advanced techniques for different surfaces and materials",
    "Time management and efficiency optimization",
    "Customer service and communication skills",
    "Equipment handling and maintenance",
    "Quality control and inspection procedures"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Professional Cleaning Masterclass | Shalean</title>
        <meta name="description" content="Join our professional cleaning masterclass and learn industry-standard techniques from experienced cleaners. Get certified and start your career in professional cleaning." />
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

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">
              <Award className="w-3 h-3 mr-1" />
              Professional Training Program
            </Badge>
            <h1 className="text-5xl font-bold mb-6">Professional Cleaning Masterclass</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your cleaning skills into a professional career. Learn from the best and join our team of certified cleaners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/haven-ark/signup')}>
                Enroll Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/booking/quote')}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {masterclassFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Course Curriculum</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {curriculum.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-lg">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our next masterclass and take the first step towards a rewarding career in professional cleaning.
            </p>
            <Button size="lg" onClick={() => navigate('/haven-ark/signup')}>
              Enroll in Masterclass
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
