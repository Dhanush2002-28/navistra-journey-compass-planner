
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, DollarSign, Users, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Smart Destination Planning',
      description: 'Get personalized recommendations based on your preferences, budget, and travel style.'
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Create detailed itineraries with flexible dates and activities that adapt to your needs.'
    },
    {
      icon: DollarSign,
      title: 'Budget Optimization',
      description: 'Plan trips within your budget with cost breakdowns and money-saving suggestions.'
    },
    {
      icon: MessageCircle,
      title: 'AI Travel Assistant',
      description: 'Get instant answers to travel questions with our intelligent chatbot companion.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      comment: 'NAVISTRA made planning my European vacation effortless. The AI suggestions were spot-on!'
    },
    {
      name: 'Miguel Rodriguez',
      location: 'Barcelona, Spain',
      rating: 5,
      comment: 'Perfect for budget travelers like me. Saved both time and money on my Southeast Asia trip.'
    },
    {
      name: 'Emily Chen',
      location: 'Toronto, Canada',
      rating: 5,
      comment: 'The personalized itineraries are amazing. Every recommendation was exactly what I was looking for.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Your Journey Begins with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                NAVISTRA
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Plan unforgettable trips with our AI-powered itinerary planner. From budget backpacking to luxury getaways, 
              we'll help you create the perfect adventure tailored to your dreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="gradient-ocean text-white hover:opacity-90 transition-opacity">
                  Start Planning Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Already have an account?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Perfect Trips
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform takes care of every detail, so you can focus on making memories.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="gradient-ocean w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Plan Your Perfect Trip in 3 Simple Steps
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 gradient-sunset rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Tell Us Your Dreams</h3>
              <p className="text-muted-foreground">
                Share your destination, dates, budget, and travel style through our simple questionnaire.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 gradient-sunset rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get AI-Powered Plans</h3>
              <p className="text-muted-foreground">
                Our intelligent system creates personalized itineraries with activities, accommodations, and tips.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 gradient-sunset rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Adventure</h3>
              <p className="text-muted-foreground">
                Access your plans anywhere, get real-time assistance, and make unforgettable memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Travelers Worldwide
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Explore the World?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of travelers who trust NAVISTRA to plan their perfect adventures.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gradient-ocean text-white hover:opacity-90 transition-opacity">
              Start Your Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
