import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, Business } from "@/contexts/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { Heart, X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

export default function SwipeInterface() {
  const navigate = useNavigate();
  const { businesses, currentInvestor, addMatch } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const controls = useAnimation();
  const constraintsRef = useRef(null);

  // Filter businesses based on investor interests if they have any
  const filteredBusinesses = useMemo(() => {
    if (!currentInvestor || currentInvestor.interests.length === 0) {
      return businesses;
    }
    return businesses.filter(business => 
      currentInvestor.interests.includes(business.industry)
    );
  }, [businesses, currentInvestor]);

  const currentBusiness = filteredBusinesses[currentIndex];

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  const handleSwipe = (dir: string) => {
    setDirection(dir);

    controls.start({
      x: dir === 'left' ? -500 : 500,
      opacity: 0,
      transition: { duration: 0.3 }
    });

    if (dir === 'right' && currentInvestor) {
      // It's a match
      addMatch({
        investorId: currentInvestor.id,
        businessId: currentBusiness.id
      });
      
      // Wait for animation to finish before navigating
      setTimeout(() => {
        navigate(`/chat/${currentBusiness.id}`);
      }, 500);
      return;
    }

    // Wait for animation to finish before showing next card
    setTimeout(() => {
      setCurrentIndex(prevIndex => {
        // If we're at the last business, wrap around to the first
        if (prevIndex >= filteredBusinesses.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
      setDirection(null);
      controls.set({ x: 0, opacity: 1 });
    }, 300);
  };

  // Reset if we run out of businesses
  useEffect(() => {
    if (filteredBusinesses.length === 0) {
      navigate("/");
    }
  }, [filteredBusinesses, navigate]);

  if (!currentInvestor) {
    navigate("/");
    return null;
  }

  if (filteredBusinesses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 flex justify-center items-center">
        <Card className="max-w-md w-full text-center p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Nuk ka biznese disponibël</h2>
          <p className="mb-6">Aktualisht nuk ka biznese që përputhen me interesat tuaja.</p>
          <Button onClick={() => navigate("/")}>Kthehu në Faqen Kryesore</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/")}>
          Kthehu
        </Button>
        <h1 className="text-xl font-bold">Gjej Biznesin Tënd</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Main swiping area */}
      <div className="flex-1 flex flex-col items-center justify-center relative" ref={constraintsRef}>
        {currentBusiness && (
          <motion.div
            className="absolute w-full max-w-md"
            drag="x"
            dragConstraints={constraintsRef}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ x: 0, opacity: 1 }}
          >
            <Card className="w-full shadow-xl overflow-hidden">
              <div className={`h-2 ${
                currentBusiness.aiRating && currentBusiness.aiRating >= 80 ? "bg-green-500" :
                currentBusiness.aiRating && currentBusiness.aiRating >= 60 ? "bg-yellow-500" :
                "bg-orange-500"
              }`}></div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{currentBusiness.name}</h2>
                    <p className="text-slate-500">{currentBusiness.owner}</p>
                  </div>
                  
                  <div className={`text-lg font-bold h-12 w-12 rounded-full flex items-center justify-center ${
                    currentBusiness.aiRating && currentBusiness.aiRating >= 80 ? "bg-green-100 text-green-600" :
                    currentBusiness.aiRating && currentBusiness.aiRating >= 60 ? "bg-yellow-100 text-yellow-600" :
                    "bg-orange-100 text-orange-600"
                  }`}>
                    {currentBusiness.aiRating}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {currentBusiness.industry}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-medium text-slate-900">Përshkrimi</h3>
                    <p className="text-slate-700 mt-1">
                      {currentBusiness.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-900">Financimi i Kërkuar</h3>
                    <p className="text-slate-700 mt-1">
                      {currentBusiness.fundingNeeded.toLocaleString('sq-AL')} €
                    </p>
                  </div>
                </div>

                <div className="text-center text-slate-500 text-sm">
                  Rrëshqit majtas për të refuzuar, djathtas për të pranuar
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="flex justify-center space-x-6 my-8">
        <Button 
          size="icon"
          variant="outline"
          className="h-14 w-14 rounded-full bg-white shadow-md border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => handleSwipe('left')}
        >
          <X size={24} />
        </Button>
        
        <Button 
          size="icon"
          variant="outline"
          className="h-14 w-14 rounded-full bg-white shadow-md border-green-100 text-green-500 hover:bg-green-50 hover:text-green-600"
          onClick={() => handleSwipe('right')}
        >
          <Heart size={24} />
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center space-x-1 mb-4">
        {filteredBusinesses.map((_, index) => (
          <div 
            key={index}
            className={`h-1 rounded-full ${index === currentIndex ? 'w-6 bg-blue-500' : 'w-2 bg-slate-300'}`}
          ></div>
        ))}
      </div>
    </div>
  );
}