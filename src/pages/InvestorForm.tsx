import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';

const industries = [
  { id: "teknologji", label: "Teknologji" },
  { id: "bujqesi", label: "Bujqësi" },
  { id: "shendetesi", label: "Shëndetësi" },
  { id: "arsim", label: "Arsim" },
  { id: "turizem", label: "Turizëm" },
  { id: "financa", label: "Financa" },
  { id: "manifakture", label: "Manifakturë" },
  { id: "sherbimeProfesionale", label: "Shërbime Profesionale" },
  { id: "artizanat", label: "Artizanat" },
  { id: "ndertim", label: "Ndërtim" },
  { id: "tjeter", label: "Tjetër" },
];

export default function InvestorForm() {
  const navigate = useNavigate();
  const { setCurrentInvestor } = useUser();
  
  const [formData, setFormData] = useState({
    name: "",
    investmentAmount: "",
    interests: [] as string[]
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
        
      return { ...prev, interests: newInterests };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const investor = {
      id: uuidv4(),
      name: formData.name,
      investmentAmount: Number(formData.investmentAmount),
      interests: formData.interests
    };
    
    setCurrentInvestor(investor);
    navigate("/swipe");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Profili i Investitorit</CardTitle>
            <CardDescription className="text-center">
              Krijoni profilin tuaj për të gjetur bizneset që përshtaten me interesat tuaja
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Emri</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Emri juaj"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="investmentAmount">Shuma për Investim (€)</Label>
                  <Input
                    id="investmentAmount"
                    name="investmentAmount"
                    type="number"
                    placeholder="Shuma që dëshironi të investoni"
                    required
                    value={formData.investmentAmount}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label className="block mb-3">Industritë e Interesit</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {industries.map((industry) => (
                      <div key={industry.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={industry.id}
                          checked={formData.interests.includes(industry.label)}
                          onCheckedChange={() => handleInterestToggle(industry.label)}
                        />
                        <Label htmlFor={industry.id} className="cursor-pointer">
                          {industry.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Përfundo dhe Vazhdo
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-slate-500">
              Do të shihni vetëm bizneset që përputhen me interesat tuaja
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}