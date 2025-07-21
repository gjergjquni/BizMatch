import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const { businesses, currentInvestor } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const business = businesses.find(b => b.id === businessId);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (business && currentInvestor) {
      // Add initial message from business
      setMessages([
        {
          id: "welcome-msg",
          senderId: business.id,
          text: `Përshëndetje ${currentInvestor.name}! Faleminderit për interesimin tuaj në ${business.name}. Si mund t'ju ndihmoj me më shumë informacion rreth biznesit tonë?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [business, currentInvestor]);

  if (!business || !currentInvestor) {
    navigate("/");
    return null;
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add investor's message
    const investorMessage = {
      id: `inv-${Date.now()}`,
      senderId: currentInvestor.id,
      text: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, investorMessage]);
    setNewMessage("");
    
    // Simulate business reply after a short delay
    setTimeout(() => {
      const businessResponses = [
        `Sigurisht! Biznesi ynë është në një fazë shumë të mirë zhvillimi. Aktualisht po kërkojmë financim prej ${business.fundingNeeded.toLocaleString('sq-AL')} € për zgjerimin e operacioneve tona.`,
        `Ne fokusohemi kryesisht në industrinë e ${business.industry}. A keni përvojë të mëparshme me investime në këtë fushë?`,
        `Faleminderit për mesazhin tuaj! Cfarë ju tërheq më shumë në biznesin tonë?`,
        `Planifikojmë të përdorim financimin për të përmirësuar teknologjinë tonë dhe për të zgjeruar ekipin. A dëshironi të diskutojmë më në detaje?`
      ];
      
      const randomResponse = businessResponses[Math.floor(Math.random() * businessResponses.length)];
      
      const businessMessage = {
        id: `biz-${Date.now()}`,
        senderId: business.id,
        text: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, businessMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <Card className="max-w-2xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        <CardHeader className="border-b bg-slate-50 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate("/swipe")} className="mr-2">
              <ArrowLeft size={20} />
            </Button>
            <Avatar className="h-10 w-10 mr-3 bg-blue-100">
              <AvatarFallback className="text-blue-700">{business.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{business.name}</CardTitle>
              <p className="text-sm text-slate-500">{business.industry}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.senderId === currentInvestor.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg ${
                    message.senderId === currentInvestor.id
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === currentInvestor.id ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        <CardFooter className="border-t p-3">
          <form onSubmit={handleSendMessage} className="w-full flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Shkruani një mesazh..."
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send size={18} />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}