import { useState, useEffect, useRef } from "react";
import { X, Send, MessageCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  onClose: () => void;
}

export const Chatbot = ({ onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your NAVISTRA travel assistant. I can help you with travel tips, destination recommendations, packing lists, and answer any travel-related questions. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // AI-powered chat response using backend API
  const getAIResponse = async (
    message: string,
    conversationHistory: Message[]
  ): Promise<string> => {
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistory.slice(-6), // Send last 6 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Fallback to local responses if API fails
      return getFallbackResponse(message);
    }
  };

  // Local fallback responses when API is unavailable
  const getFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("budget") || lowerMessage.includes("cheap")) {
      return "For budget travel, I recommend: 1) Book flights in advance and be flexible with dates, 2) Stay in hostels or use Airbnb, 3) Eat local street food, 4) Use public transportation, 5) Look for free walking tours and activities. What's your destination?";
    }

    if (lowerMessage.includes("pack") || lowerMessage.includes("luggage")) {
      return "Here's a smart packing checklist: 1) Roll clothes to save space, 2) Pack versatile items you can mix and match, 3) Bring only essential electronics, 4) Don't forget travel documents and copies, 5) Pack weather-appropriate clothing. What type of trip are you packing for?";
    }

    if (lowerMessage.includes("visa") || lowerMessage.includes("passport")) {
      return "For travel documents: 1) Check if you need a visa for your destination, 2) Ensure your passport is valid for at least 6 months, 3) Make copies of important documents, 4) Consider travel insurance, 5) Check vaccination requirements. Which country are you visiting?";
    }

    if (lowerMessage.includes("safety") || lowerMessage.includes("safe")) {
      return "Travel safety tips: 1) Research your destination beforehand, 2) Keep copies of important documents, 3) Stay aware of your surroundings, 4) Don't flash expensive items, 5) Trust your instincts, 6) Keep emergency contacts handy. Is there a specific safety concern?";
    }

    if (lowerMessage.includes("food") || lowerMessage.includes("eat")) {
      return "Food travel tips: 1) Try local specialties - it's part of the experience! 2) Eat where locals eat, 3) Be cautious with street food in some areas, 4) Stay hydrated, 5) Consider food allergies and restrictions. What cuisine are you excited to try?";
    }

    return "That's a great question! I'm here to help with travel planning, destination advice, budgeting tips, packing suggestions, and safety information. Could you tell me more about what specific aspect of travel you'd like help with?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    const messageToSend = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get AI response with conversation history
      const aiResponseText = await getAIResponse(
        messageToSend,
        currentMessages
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Fallback response on error
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or feel free to ask me about travel planning, destinations, budgeting, packing, or safety tips!",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col glass-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="gradient-ocean w-8 h-8 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <CardTitle>NAVISTRA Travel Assistant</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea className="flex-1 p-4 overflow-hidden">
            <div className="space-y-4 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg break-words ${
                      message.isUser
                        ? "bg-primary text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto-scroll reference */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything about travel..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="gradient-ocean text-white hover:opacity-90 transition-opacity flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
