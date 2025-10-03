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
    { label: "Active Students", value: "5,000+", icon: Users },
    { label: "Success Rate", value: "87%", icon: Award },
    { label: "Expert Mentors", value: "50+", icon: Target },
    { label: "Course Hours", value: "1000+", icon: BookOpen }
  ];

  const features = [
    {
      icon: GraduationCap,
      title: "Expert-Led Programs",
      description: "Learn from industry professionals with decades of trading experience",
      color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Leverage cutting-edge AI technology to enhance your trading decisions",
      color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Master the art of protecting capital and managing trading risks",
      color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
    },
    {
      icon: BarChart3,
      title: "Real Market Insights",
      description: "Get educational market analysis and pattern recognition training",
      color: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30"
    }
  ];

  const offerings = [
    {
      title: "Masterclass Programs",
      description: "Comprehensive trading education programs available both online and offline",
      image: "/lovable-uploads/10c2135b-18ac-464b-a5e3-fd5430a26063.png",
      link: "/masterclass",
      badge: "Popular"
    },
    {
      title: "Trading Academy",
      description: "Self-paced courses and learning materials for all skill levels",
      image: "/lovable-uploads/23b54970-8e48-42a5-95c9-78c42fe65e6d.png",
      link: "/academy",
      badge: "New"
    },
    {
      title: "Wiggly AI Platform",
      description: "Advanced AI-powered trading analytics and journaling tools",
      image: "/lovable-uploads/2780255e-6d53-44a4-8fcf-7fa8a4a25bc1.png",
      link: "/wiggly",
      badge: "AI-Powered"
    }
  ];

  const mentors = [
    {
      name: "Ritvik Vipin",
      role: "Chief Trading Strategist",
      experience: "15+ Years",
      specialization: "Options & Derivatives",
      image: "/lovable-uploads/604a9013-c183-4e62-b97f-aadea9e3b4a9.png",
      linkedin: "#",
      achievements: ["Former Investment Banker", "Trained 10,000+ Traders", "Published Author"]
    },
    {
      name: "Akash Jayan",
      role: "Technical Analysis Expert",
      experience: "12+ Years",
      specialization: "Chart Patterns & Market Psychology",
      image: "/lovable-uploads/5ff49b53-f922-45bb-8a00-6ae902ecf012.png",
      linkedin: "#",
      achievements: ["CMT Certified", "Ex-Hedge Fund Analyst", "Market Research Pioneer"]
    },
    {
      name: "Christophal Rafael",
      role: "Risk Management Specialist",
      experience: "18+ Years",
      specialization: "Portfolio Management & Risk Analytics",
      image: "/lovable-uploads/86f360ff-2b03-4cb9-9bff-e07a55844eed.png",
      linkedin: "#",
      achievements: ["CFA Charter Holder", "Risk Management Expert", "Financial Educator"]
    }
  ];

  const newsOutlets = [
    {
      name: "Economic Times",
      logo: "/lovable-uploads/990e60b1-9a6f-45a0-b5e6-9bb5109d373a.png",
      feature: "Best Trading Education Platform 2024"
    },
    {
      name: "Business Standard",
      logo: "/lovable-uploads/7af97329-5f82-41a6-af28-113f7711536c.png",
      feature: "Innovation in Financial Education"
    },
    {
      name: "Forbes India",
      logo: "/lovable-uploads/9ea240e5-b9e3-4cda-a9f3-829b0695c636.png",
      feature: "Top EdTech Startup to Watch"
    },
    {
      name: "The Hindu Business Line",
      logo: "/lovable-uploads/cd0c7104-628a-41b5-86e5-f28f244ceaf2.png",
      feature: "Transforming Trading Education"
    },
    {
      name: "Mint",
      logo: "/lovable-uploads/dacda39a-48ba-4f33-813b-c570e9686ae3.png",
      feature: "Leading Financial Learning Platform"
    },
    {
      name: "YourStory",
      logo: "/lovable-uploads/cee9ac58-3a60-4703-840f-425403c6488c.png",
      feature: "Empowering Retail Traders"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Haven Ark - Transform Your Trading Journey</title>
        <meta name="description" content="Haven Ark is India's premier trading education platform. Master trading with expert-led programs, AI-powered tools, and comprehensive learning resources." />
        <meta name="keywords" content="trading education, stock market courses, trading academy, AI trading tools, market analysis, trading mentorship" />
        <link rel="canonical" href="https://havenark.com/" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://havenark.com/" />
        <meta property="og:title" content="Haven Ark - Transform Your Trading Journey" />
        <meta property="og:description" content="India's premier trading education platform with expert-led programs and AI-powered tools" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Haven Ark",
            "description": "Premier trading education platform",
            "url": "https://havenark.com"
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
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-primary`}>Haven Ark</h1>
              <Badge variant="secondary" className="hidden sm:flex">Trading Education</Badge>
            </div>
            
            {!isMobile ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-foreground hover:text-primary">
                      Programs
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
                      onClick={() => navigate('/masterclass')}
                    >
                      Masterclass
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      onClick={() => navigate('/academy')}
                    >
                      Academy
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      onClick={() => navigate('/wiggly')}
                    >
                      <div className="flex items-center space-x-2">
                        <img 
                          src={resolvedTheme === 'dark' ? 
                            "/lovable-uploads/6120e2e2-296a-403d-a2a3-7cae3e7241fa.png" : 
                            "/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png"
                          } 
                          alt="Wiggly Logo" 
                          className="w-5 h-5 object-contain"
                        />
                        <span>Wiggly</span>
                      </div>
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
                      <h3 className="text-sm font-medium text-muted-foreground">Programs</h3>
                      
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
                          navigate('/masterclass');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                            <Award className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Masterclass</div>
                            <div className="text-xs text-muted-foreground">Premium programs</div>
                          </div>
                        </div>
                      </button>

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
                            <div className="font-medium text-sm">Academy</div>
                            <div className="text-xs text-muted-foreground">Trading courses</div>
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
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <img 
                              src={resolvedTheme === 'dark' ? 
                                "/lovable-uploads/6120e2e2-296a-403d-a2a3-7cae3e7241fa.png" : 
                                "/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png"
                              } 
                              alt="Wiggly Logo" 
                              className="w-4 h-4 object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Wiggly AI</div>
                            <div className="text-xs text-muted-foreground">AI trading tools</div>
                          </div>
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
                {isMobile ? "Start" : "Get Started"}
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
              India's Premier Trading Education Platform
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent px-4">
              Transform Your Trading Journey
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Master the art of trading with expert-led programs, AI-powered analytics, and comprehensive learning resources designed for success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/masterclass')}
                className="w-full sm:w-auto group"
              >
                Explore Masterclass
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/academy')}
                className="w-full sm:w-auto"
              >
                Browse Academy
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
                  <Award className="w-3 h-3 mr-1" />
                  Flagship Program
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Experience Our Masterclass Programs
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Immersive learning experiences designed to transform beginners into confident traders through comprehensive curriculum and hands-on practice.
                </p>
                
                <div className="space-y-4 mb-8">
                  {[
                    { title: "Live Trading Sessions", desc: "Watch experts analyze real-time markets" },
                    { title: "Personalized Mentorship", desc: "One-on-one guidance from seasoned traders" },
                    { title: "Practical Strategies", desc: "Battle-tested techniques that actually work" },
                    { title: "Lifetime Access", desc: "Continuous learning and community support" }
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
                  onClick={() => navigate('/masterclass')}
                  className="group"
                >
                  Explore Masterclass Programs
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
                    src="/lovable-uploads/10c2135b-18ac-464b-a5e3-fd5430a26063.png"
                    alt="Masterclass Learning Experience"
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
                        <p className="text-sm font-semibold">5,000+ Students</p>
                        <p className="text-xs text-muted-foreground">Join our growing community</p>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Card className="p-4 bg-background/80 backdrop-blur">
                    <div className="text-2xl font-bold text-primary mb-1">100+</div>
                    <div className="text-sm text-muted-foreground">Hours of Content</div>
                  </Card>
                  <Card className="p-4 bg-background/80 backdrop-blur">
                    <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                    <div className="text-sm text-muted-foreground">Community Support</div>
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
            <Badge className="mb-4">Why Choose Haven Ark</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              From beginner to advanced, we provide comprehensive education and tools for every stage of your trading journey
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
            <Badge className="mb-4">Our Offerings</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Choose Your Learning Path</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Explore our comprehensive range of trading education programs and tools
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
            <Badge className="mb-4">Meet Our Experts</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Learn From Industry Leaders</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Our mentors bring decades of real-world trading experience and have successfully trained thousands of traders
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
            <Badge className="mb-4">Media Coverage</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Featured In Leading Publications</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Our innovative approach to trading education has been recognized by top business and financial media
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
                    "Haven Ark is revolutionizing trading education in India by combining expert mentorship with cutting-edge technology. Their holistic approach addresses both the technical and psychological aspects of trading."
                  </p>
                  <p className="font-semibold">- Financial Express</p>
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
            <Zap className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Start Your Trading Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of successful traders who have transformed their trading with Haven Ark
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/haven-ark/signup')}
                className="w-full sm:w-auto"
              >
                Create Free Account
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/masterclass')}
                className="w-full sm:w-auto"
              >
                View All Programs
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
