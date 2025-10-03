import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import Footer from '@/components/landing/Footer';
import { Badge } from '@/components/ui/badge';

export default function BlogPage() {
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Cleaning Tips for a Spotless Home",
      excerpt: "Discover professional cleaning techniques that will transform your home into a pristine sanctuary. Learn the secrets used by our expert cleaners.",
      author: "Sarah Johnson",
      date: "2025-09-25",
      readTime: "5 min read",
      category: "Tips & Tricks",
      image: "/lovable-uploads/clean-home-background.png"
    },
    {
      id: 2,
      title: "The Ultimate Guide to Airbnb Cleaning",
      excerpt: "Maximize your Airbnb ratings with our comprehensive cleaning guide. Learn how to prepare your property for 5-star reviews every time.",
      author: "Michael Chen",
      date: "2025-09-20",
      readTime: "8 min read",
      category: "Airbnb",
      image: "/lovable-uploads/airbnb-turnover.png"
    },
    {
      id: 3,
      title: "Deep Cleaning vs. Standard Cleaning: What's the Difference?",
      excerpt: "Understanding the difference between deep cleaning and standard cleaning services can help you choose the right service for your needs.",
      author: "Emma Williams",
      date: "2025-09-15",
      readTime: "6 min read",
      category: "Services",
      image: "/lovable-uploads/deep-cleaning.png"
    },
    {
      id: 4,
      title: "How to Maintain a Clean Office Space",
      excerpt: "A clean office boosts productivity and employee morale. Learn the best practices for maintaining a professional workspace.",
      author: "David Brown",
      date: "2025-09-10",
      readTime: "7 min read",
      category: "Office Cleaning",
      image: "/lovable-uploads/cleaner-working.png"
    },
    {
      id: 5,
      title: "Eco-Friendly Cleaning: Better for You and the Planet",
      excerpt: "Discover how eco-friendly cleaning products can create a healthier home environment while protecting the environment.",
      author: "Lisa Martinez",
      date: "2025-09-05",
      readTime: "5 min read",
      category: "Eco-Friendly",
      image: "/lovable-uploads/standard-cleaning.png"
    },
    {
      id: 6,
      title: "Moving Out? Complete Cleaning Checklist",
      excerpt: "Ensure you get your full deposit back with our comprehensive move-out cleaning checklist. Don't miss a single spot!",
      author: "James Taylor",
      date: "2025-09-01",
      readTime: "10 min read",
      category: "Moving",
      image: "/lovable-uploads/cleaner-profile-1.png"
    }
  ];

  const categories = ["All", "Tips & Tricks", "Airbnb", "Services", "Office Cleaning", "Eco-Friendly", "Moving"];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Cleaning Blog & Tips | Shalean Services</title>
        <meta name="description" content="Expert cleaning tips, guides, and advice from professional cleaners. Learn how to maintain a spotless home and office with our comprehensive blog articles." />
        <meta name="keywords" content="cleaning tips, home cleaning guide, office cleaning tips, Airbnb cleaning, professional cleaning advice" />
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

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">
              <Calendar className="w-3 h-3 mr-1" />
              Latest Articles
            </Badge>
            <h1 className="text-5xl font-bold mb-6">Cleaning Blog & Tips</h1>
            <p className="text-xl text-muted-foreground">
              Expert advice, tips, and guides from professional cleaners to help you maintain a spotless home and office.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{post.author}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="group/btn">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Articles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest cleaning tips, guides, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg border border-border bg-background flex-1 max-w-md"
              />
              <Button size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
