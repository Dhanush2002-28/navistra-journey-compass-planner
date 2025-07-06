import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  MessageCircle,
  Trash2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Chatbot } from "@/components/Chatbot";

interface DaywiseActivity {
  day: number;
  activities: string[];
}

interface ItineraryDetails {
  highlights: string[];
  days: number;
}
interface Itinerary {
  destination: string;
  summary: string;
  details: ItineraryDetails;
  daywise?: DaywiseActivity[];
  estimated_cost_inr?: number;
  over_budget?: boolean;
}

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget_inr: string;
  travel_style: string;
  travelers: string;
  created_at: string;
  user_id: string;
}

const Dashboard = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const { toast } = useToast();
  const [itineraries, setItineraries] = useState<Record<string, Itinerary>>({});
  const [expandedTrip, setExpandedTrip] = useState<Trip | null>(null);
  const [expandedItinerary, setExpandedItinerary] = useState<Itinerary | null>(
    null
  );

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("navistra_user");
    if (userData) {
      setUser(JSON.parse(userData));
      const { token } = JSON.parse(userData);
      if (token) {
        fetch("/api/trips", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) setTrips(data);
            // Fetch personalized itineraries for all destinations in trips
            if (Array.isArray(data)) {
              Promise.all(
                data.map((trip) => {
                  // Calculate number of days from start and end date
                  const startDate = new Date(trip.start_date);
                  const endDate = new Date(trip.end_date);
                  let days = 1;
                  if (
                    !isNaN(startDate.getTime()) &&
                    !isNaN(endDate.getTime())
                  ) {
                    // Reset time to start of day to avoid time zone issues
                    const start = new Date(
                      startDate.getFullYear(),
                      startDate.getMonth(),
                      startDate.getDate()
                    );
                    const end = new Date(
                      endDate.getFullYear(),
                      endDate.getMonth(),
                      endDate.getDate()
                    );
                    const diff = end.getTime() - start.getTime();
                    days = Math.max(
                      1,
                      Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
                    );
                  }
                  return fetch(
                    `/api/itineraries/${encodeURIComponent(
                      trip.destination
                    )}?days=${days}&budget=${trip.budget_inr}`
                  )
                    .then((res) => (res.ok ? res.json() : null))
                    .catch(() => null);
                })
              ).then((results) => {
                const itineraryMap = {};
                results.forEach((itin, idx) => {
                  if (itin && itin.destination)
                    itineraryMap[data[idx].destination] = itin;
                });
                setItineraries(itineraryMap);
              });
            }
          });
      }
    }
  }, []);

  const deleteTrip = async (tripId: string) => {
    const userData = localStorage.getItem("navistra_user");
    const token = userData ? JSON.parse(userData).token : null;
    if (!token) return;
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
        toast({
          title: "Trip deleted",
          description: "Your trip has been removed from your plans.",
        });
      } else {
        toast({
          title: "Delete failed",
          description: "Could not delete trip. Please try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Delete failed",
        description: "Could not delete trip. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTravelStyleColor = (style: string) => {
    switch (style) {
      case "budget":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "normal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "luxury":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  const getTravelStyleLabel = (style: string) => {
    switch (style) {
      case "budget":
        return "Budget Travel";
      case "normal":
        return "Normal Travel";
      case "luxury":
        return "Luxury Travel";
      default:
        return style;
    }
  };

  const handleExpandTrip = async (trip: Trip) => {
    setExpandedTrip(trip);
    // Always fetch the latest itinerary for this trip
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    let days = 1;
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      // Reset time to start of day to avoid time zone issues
      const start = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const end = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );
      const diff = end.getTime() - start.getTime();
      days = Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
    }
    try {
      const res = await fetch(
        `/api/itineraries/${encodeURIComponent(
          trip.destination
        )}?days=${days}&budget=${trip.budget_inr}`
      );
      if (res.ok) {
        const itin = await res.json();
        setExpandedItinerary(itin);
      } else {
        setExpandedItinerary(null);
      }
    } catch {
      setExpandedItinerary(null);
    }
  };
  const handleCloseExpand = () => {
    setExpandedTrip(null);
    setExpandedItinerary(null);
  };

  const getTripDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 1;
    // Reset time to start of day to avoid time zone issues
    const startDay = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const endDay = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );
    const diff = endDay.getTime() - startDay.getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const downloadPDF = async (tripId: string) => {
    try {
      const userData = localStorage.getItem("navistra_user");
      const token = userData ? JSON.parse(userData).token : null;

      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to download PDF",
          variant: "destructive",
        });
        return;
      }

      // Show loading state
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your itinerary PDF",
      });

      const response = await fetch(
        `http://localhost:5000/api/pdf/generate/${tripId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        response.headers
          .get("Content-Disposition")
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || "NAVISTRA_Itinerary.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "PDF Downloaded!",
        description: "Your itinerary has been downloaded successfully",
      });
    } catch (error) {
      console.error("PDF download error:", error);
      toast({
        title: "Download failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-slate-900/50 p-4">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.name || "Traveler"}! ✈️
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
                <p className="text-muted-foreground">
                  Start planning your next adventure
                </p>
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
              <p className="text-muted-foreground">
                Get instant travel advice and tips
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6 text-center">
              <div className="bg-green-500 dark:bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
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
                <h3 className="text-xl font-semibold mb-2">
                  No trips planned yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start planning your first adventure and let NAVISTRA create
                  the perfect itinerary for you.
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
                <Card
                  key={trip.id}
                  className="hover:shadow-lg transition-shadow duration-300 glass-effect cursor-pointer"
                  onClick={() => handleExpandTrip(trip)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {trip.destination}
                      </CardTitle>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPDF(trip.id);
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTrip(trip.id);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                          title="Delete Trip"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Badge className={getTravelStyleColor(trip.travel_style)}>
                      {getTravelStyleLabel(trip.travel_style)}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {trip.start_date &&
                        trip.end_date &&
                        trip.start_date !== "Invalid Date" &&
                        trip.end_date !== "Invalid Date"
                          ? `${formatDate(trip.start_date)} - ${formatDate(
                              trip.end_date
                            )}`
                          : `${trip.start_date || ""}${
                              trip.end_date ? " - " + trip.end_date : ""
                            }`}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {trip.budget_inr
                          ? `₹${trip.budget_inr} INR`
                          : "No budget set"}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {trip.travelers && !isNaN(Number(trip.travelers))
                          ? Number(trip.travelers) === 1
                            ? "Solo travel"
                            : Number(trip.travelers) === 2
                            ? "Couple"
                            : Number(trip.travelers) <= 4
                            ? "Small Group (3-4)"
                            : Number(trip.travelers) >= 5
                            ? "Large Group (5+)"
                            : `${trip.travelers} travelers`
                          : "Travelers not set"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Trip Modal/Drawer */}
      {expandedTrip && expandedItinerary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 text-xl font-bold"
              onClick={handleCloseExpand}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2">
              {expandedTrip.destination}
            </h2>
            <div className="mb-2 text-muted-foreground dark:text-slate-300">
              {expandedItinerary.summary}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Highlights:</span>
              <ul className="list-disc ml-6 text-sm">
                {expandedItinerary.details.highlights.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            </div>
            <div className="mb-2 text-sm text-muted-foreground dark:text-slate-400">
              Recommended days: {expandedItinerary.details.days}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Day-wise Plan:</span>
              <div className="mt-1 rounded bg-slate-50/80 dark:bg-slate-700/50 p-2 border border-slate-200 dark:border-slate-600 max-h-60 overflow-y-auto">
                {expandedItinerary.daywise &&
                  expandedItinerary.daywise.map((day, i) => (
                    <div key={i} className="mb-3">
                      <div className="font-medium text-blue-700 dark:text-blue-300">
                        Day {day.day}
                      </div>
                      <ul className="list-disc ml-5 text-sm">
                        {day.activities.map((act, j) => (
                          <li key={j}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-2 text-base font-semibold text-green-700 dark:text-green-400">
              Estimated Cost: ₹
              {expandedItinerary.estimated_cost_inr.toLocaleString()} INR
            </div>
            {expandedItinerary.over_budget && (
              <div className="mt-2 text-base font-semibold text-red-600 dark:text-red-400">
                Note: This plan exceeds your selected budget.
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
              <Button
                onClick={() => downloadPDF(expandedTrip.id)}
                className="gradient-ocean text-white hover:opacity-90 transition-opacity flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={() => deleteTrip(expandedTrip.id)}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Trip
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot */}
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
    </div>
  );
};

export default Dashboard;
