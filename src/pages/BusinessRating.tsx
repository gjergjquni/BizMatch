import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle, XCircle, Loader2, Star, TrendingUp, Users, DollarSign } from "lucide-react";

// DeepSeek API configuration
const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL;
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

// Business rating interface
interface BusinessRating {
  score: number;
  analysis: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  investmentPotential: 'excellent' | 'good' | 'fair' | 'poor';
}

const industries = [
  "Teknologji",
  "Bujqësi", 
  "Shëndetësi",
  "Arsim",
  "Turizëm",
  "Financa",
  "Manifakturë",
  "Shërbime Profesionale",
  "Artizanat",
  "Ndërtim",
  "Tjetër"
];

// DeepSeek API call function
const callDeepSeekAPI = async (businessData: any): Promise<BusinessRating> => {
  console.log('Calling DeepSeek API with key:', DEEPSEEK_API_KEY ? 'Key present' : 'No key');
  
  if (!DEEPSEEK_API_KEY) {
    throw new Error('API key not found. Please check your .env file.');
  }

  const prompt = `
Analizoni këtë biznes dhe jepni një vlerësim të detajuar:

Emri i biznesit: ${businessData.name}
Pronari: ${businessData.owner}
Përshkrimi: ${businessData.description}
Financimi i kërkuar: ${businessData.fundingNeeded}€
Industria: ${businessData.industry}

Ju lutemi jepni një analizë të detajuar që përfshin:
1. Vlerësimi nga 1-100
2. Analiza e detajuar e biznesit
3. Rekomandimet për përmirësim
4. Niveli i rrezikut (low/medium/high)
5. Potenciali i investimit (excellent/good/fair/poor)

Përgjigjuni në formatin JSON:
{
  "score": number,
  "analysis": "string",
  "recommendations": ["string"],
  "riskLevel": "low|medium|high",
  "investmentPotential": "excellent|good|fair|poor"
}
`;

  try {
    console.log('Making API request to:', DEEPSEEK_API_URL);
    
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    const content = data.choices[0].message.content;
    console.log('API Response content:', content);
    
    // Parse JSON response
    const ratingData = JSON.parse(content);
    return ratingData;
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    throw new Error(`Gabim në lidhjen me API-n e vlerësimit: ${error instanceof Error ? error.message : 'Gabim i panjohur'}`);
  }
};

export default function BusinessRating() {
  console.log('BusinessRating component rendering...');
  
  const navigate = useNavigate();
  const { setCurrentBusiness, setBusinesses } = useUser();
  
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    description: "",
    fundingNeeded: "",
    industry: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState<BusinessRating | null>(null);
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIndustryChange = (value: string) => {
    setFormData(prev => ({ ...prev, industry: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const businessData = {
        ...formData,
        fundingNeeded: Number(formData.fundingNeeded)
      };
      
      console.log('Submitting business data:', businessData);
      
      const ratingResult = await callDeepSeekAPI(businessData);
      console.log('Rating result:', ratingResult);
      
      setRating(ratingResult);
      
      const newBusiness = {
        id: uuidv4(),
        name: formData.name,
        owner: formData.owner,
        description: formData.description,
        fundingNeeded: Number(formData.fundingNeeded),
        industry: formData.industry,
        aiRating: ratingResult.score
      };
      
      setCurrentBusiness(newBusiness);
      setBusinesses(prev => [...prev, newBusiness]);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Gabim i panjohur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    navigate("/");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return "text-green-600";
      case 'medium': return "text-yellow-600";
      case 'high': return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'excellent': return "text-green-600";
      case 'good': return "text-blue-600";
      case 'fair': return "text-yellow-600";
   
      case 'poor': return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const renderForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Emri i biznesit</Label>
            <Input
              id="name"
              name="name"
              placeholder="Shëno emrin e biznesit tuaj"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="owner">Pronari</Label>
            <Input
              id="owner"
              name="owner"
              placeholder="Emri i pronarit të biznesit"
              required
              value={formData.owner}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="description">Përshkrimi i biznesit</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Jepni një përshkrim të detajuar të biznesit tuaj, duke përfshirë modelin e biznesit, objektivat, dhe planin e zhvillimit"
              required
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[150px]"
            />
          </div>

          <div>
            <Label htmlFor="fundingNeeded">Financimi i kërkuar (€)</Label>
            <Input
              id="fundingNeeded"
              name="fundingNeeded"
              type="number"
              placeholder="Shuma e financimit që kërkoni"
              required
              value={formData.fundingNeeded}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="industry">Industria</Label>
            <Select
              value={formData.industry}
              onValueChange={handleIndustryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Zgjidhni industrinë" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Duke analizuar me AI...
            </>
          ) : (
            "Analizo biznesin me AI"
          )}
        </Button>
      </form>
    </motion.div>
  );

  const renderRating = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Vlerësimi i biznesit tuaj</h3>
        
        {/* Score Display */}
        <div className="flex justify-center">
          <div className={`text-6xl font-bold w-32 h-32 rounded-full flex items-center justify-center ${getScoreColor(rating!.score)}`}>
            {rating!.score}
          </div>
        </div>
        
        <p className="text-lg font-semibold">
          {rating!.score >= 80
            ? "Shkëlqyeshëm! Biznesi juaj ka potencial të lartë."
            : rating!.score >= 60
            ? "Mirë! Biznesi juaj ka potencial të mirë."
            : "Biznesi juaj ka potencial, por nevojitet përmirësim."}
        </p>
      </div>

      {/* Analysis */}
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Analiza e detajuar</h4>
          <p className="text-blue-700">{rating!.analysis}</p>
        </div>

        {/* Risk and Potential */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Niveli i rrezikut</h4>
            <p className={`font-bold ${getRiskColor(rating!.riskLevel)}`}>
              {rating!.riskLevel === 'low' ? 'I ulët' : 
               rating!.riskLevel === 'medium' ? 'Mesatar' : 'I lartë'}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Potenciali i investimit</h4>
            <p className={`font-bold ${getPotentialColor(rating!.investmentPotential)}`}>
              {rating!.investmentPotential === 'excellent' ? 'Shkëlqyeshëm' :
               rating!.investmentPotential === 'good' ? 'I mirë' :
               rating!.investmentPotential === 'fair' ? 'I pranueshëm' : 'I dobët'}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Rekomandimet për përmirësim</h4>
          <ul className="space-y-2">
            {rating!.recommendations.map((rec, index) => (
              <li key={index} className="text-green-700 flex items-start">
                <Star className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-sm text-slate-500 text-center">
        Vlerësimi bazohet në analizën e AI-së së DeepSeek dhe të dhënat që keni dhënë.
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {rating ? "Vlerësimi i biznesit" : "Vlerësimi i biznesit me AI"}
            </CardTitle>
            <CardDescription className="text-center">
              {rating 
                ? "Rezultatet e analizës së AI-së për biznesin tuaj"
                : "Plotësoni detajet e biznesit për të marrë një vlerësim të detajuar nga AI-ja e DeepSeek"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!rating ? renderForm() : renderRating()}
          </CardContent>

          {rating && (
            <CardFooter>
              <Button className="w-full" onClick={handleContinue}>
                Vazhdoni
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
} 