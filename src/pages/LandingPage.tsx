import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();
  const { setUserType } = useUser();

  const handleUserTypeSelection = (type: 'business' | 'investor') => {
    setUserType(type);
    navigate(type === 'business' ? '/business-form' : '/investor-form');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-10 max-w-md"
      >
        <div className="space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            BizMatch
          </h1>
          <p className="text-xl text-slate-700">
            Platforma që lidh investitorët me bizneset e vogla në Shqipëri
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-medium text-slate-800">Kush jeni ju?</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Button 
              size="lg"
              className="text-lg p-8 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all"
              onClick={() => handleUserTypeSelection('business')}
            >
              Biznes
            </Button>
            
            <Button 
              size="lg"
              className="text-lg p-8 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 transition-all"
              onClick={() => handleUserTypeSelection('investor')}
            >
              Investitor
            </Button>
          </div>
        </div>

        <p className="text-sm text-slate-500 pt-8">
          Gjej bashkëpunimin tënd të ardhshëm me një swipe të thjeshtë
        </p>
      </motion.div>
    </div>
  );
}