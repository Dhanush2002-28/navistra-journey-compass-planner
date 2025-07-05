
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Users, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const PlanTrip = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelStyle: '',
    travelers: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    { number: 1, title: 'Destination', icon: MapPin },
    { number: 2, title: 'Dates', icon: Calendar },
    { number: 3, title: 'Budget & Style', icon: DollarSign },
    { number: 4, title: 'Travelers', icon: Users }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Save trip plan (in a real app, this would go to database)
    const existingTrips = JSON.parse(localStorage.getItem('navistra_trips') || '[]');
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      createdAt: new Date().toISOString(),
      status: 'planned'
    };
    
    existingTrips.push(newTrip);
    localStorage.setItem('navistra_trips', JSON.stringify(existingTrips));
    
    toast({
      title: "Trip planned successfully!",
      description: `Your ${tripData.destination} adventure is ready. Check your dashboard for details.`,
    });
    
    navigate('/dashboard');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return tripData.destination.trim() !== '';
      case 2:
        return tripData.startDate !== '' && tripData.endDate !== '';
      case 3:
        return tripData.budget !== '' && tripData.travelStyle !== '';
      case 4:
        return tripData.travelers !== '';
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Where would you like to go?</h2>
              <p className="text-muted-foreground">Tell us your dream destination</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Tokyo, Japan or Paris, France"
                value={tripData.destination}
                onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">When are you traveling?</h2>
              <p className="text-muted-foreground">Choose your travel dates</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={tripData.startDate}
                  onChange={(e) => setTripData({ ...tripData, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={tripData.endDate}
                  onChange={(e) => setTripData({ ...tripData, endDate: e.target.value })}
                  min={tripData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Budget & Travel Style</h2>
              <p className="text-muted-foreground">Help us tailor your experience</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 2000"
                value={tripData.budget}
                onChange={(e) => setTripData({ ...tripData, budget: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Travel Style</Label>
              <Select value={tripData.travelStyle} onValueChange={(value) => setTripData({ ...tripData, travelStyle: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your travel style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget Travel - Hostels, local transport, street food</SelectItem>
                  <SelectItem value="normal">Normal Travel - Mid-range hotels, mix of activities</SelectItem>
                  <SelectItem value="luxury">Luxury Travel - Premium hotels, exclusive experiences</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Who's traveling?</h2>
              <p className="text-muted-foreground">Tell us about your travel group</p>
            </div>
            
            <div className="space-y-2">
              <Label>Number of Travelers</Label>
              <Select value={tripData.travelers} onValueChange={(value) => setTripData({ ...tripData, travelers: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of travelers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Solo Travel (1 person)</SelectItem>
                  <SelectItem value="2">Couple (2 people)</SelectItem>
                  <SelectItem value="3-4">Small Group (3-4 people)</SelectItem>
                  <SelectItem value="5+">Large Group (5+ people)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.number 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step.number ? 'text-primary' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-4 ${
                  currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-center">Plan Your Perfect Trip</CardTitle>
            <CardDescription className="text-center">
              Step {currentStep} of {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="gradient-ocean text-white hover:opacity-90 transition-opacity"
              >
                {currentStep === 4 ? 'Create Trip Plan' : 'Next'}
                {currentStep < 4 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanTrip;
