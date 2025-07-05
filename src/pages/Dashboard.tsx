
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, DollarSign, Users, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Chatbot } from '@/components/Chatbot';

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelStyle: string;
  travelers: string;
  createdAt: string;
  status: string;
}

const Dashboard = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('navistra_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load trips
    const tripsData = localStorage.getItem('navistra_trips');
    if (tripsData) {
      setTrips(JSON.parse(tripsData));
    }
  }, []);

  const deleteTrip = (tripId: string) => {
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    setTrips(updatedTrips);
    localStorage.setItem('navistra_trips', JSON.stringify(updatedTrips));
    
    toast({
      title: "Trip deleted",
      description: "Your trip has been removed from your plans.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTravelStyleColor = (style: string) => {
    switch (style) {
      case 'budget':
        return 'bg-green-100 text-green-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'luxury':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTravelStyleLabel = (style: string) => {
    switch (style) {
      case 'budget':
        return 'Budget Travel';
      case 'normal':
        return 'Normal Travel';
      case 'luxury':
        return 'Luxury Travel';
      default:
        return style;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.name || 'Traveler'}! ✈️
          </h1>
          <p className="text-xl text-muted-foreground">
            Ready for your next adventure? Let's plan something amazing.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/plan-trip">
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer glass-effect">
              <CardContent className="p-6 text-center">
                <div className="gradient-ocean w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Plan New Trip</h3>
                <p className="text-muted-foreground">Start planning your next adventure</p>
              </CardContent>
            </Card>
          </Link>

          <Card 
            className="hover:shadow-lg transition-shadow duration-300 cursor-pointer glass-effect"
            onClick={() => setShowChatbot(true)}
          >
            <CardContent className="p-6 text-center">
              <div className="gradient-sunset w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Travel Assistant</h3>
              <p className="text-muted-foreground">Get instant travel advice and tips</p>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6 text-center">
              <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trips Planned</h3>
              <p className="text-2xl font-bold text-primary">{trips.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Trip Plans */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Trip Plans</h2>
            {trips.length > 0 && (
              <Link to="/plan-trip">
                <Button className="gradient-ocean text-white hover:opacity-90 transition-opacity">
                  <Plus className="h-4 w-4 mr-2" />
                  Plan Another Trip
                </Button>
              </Link>
            )}
          </div>

          {trips.length === 0 ? (
            <Card className="glass-effect">
              <CardContent className="p-12 text-center">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No trips planned yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start planning your first adventure and let NAVISTRA create the perfect itinerary for you.
                </p>
                <Link to="/plan-trip">
                  <Button className="gradient-ocean text-white hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4 mr-2" />
                    Plan Your First Trip
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <Card key={trip.id} className="hover:shadow-lg transition-shadow duration-300 glass-effect">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{trip.destination}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTrip(trip.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge className={getTravelStyleColor(trip.travelStyle)}>
                      {getTravelStyleLabel(trip.travelStyle)}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ${trip.budget} USD
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {trip.travelers === '1' ? 'Solo travel' : `${trip.travelers} travelers`}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Planned on {formatDate(trip.createdAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chatbot */}
      {showChatbot && (
        <Chatbot onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
};

export default Dashboard;
