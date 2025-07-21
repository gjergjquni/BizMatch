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
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

// Kosovo Business ID validation
const validateKosovoBusinessID = (businessId: string): { isValid: boolean; message: string } => {
  const cleanId = businessId.replace(/\s/g, '').toUpperCase();
  
  // Kosovo business ID format: 6XXXXXXX (7 digits starting with 6)
  const kosovoBusinessIdPattern = /^6\d{6}$/;
  
  if (!cleanId) {
    return { isValid: false, message: 'Numri i biznesit është i detyrueshëm' };
  }
  
  if (!kosovoBusinessIdPattern.test(cleanId)) {
    return { isValid: false, message: 'Numri i biznesit duhet të jetë 7 shifra duke filluar me 6' };
  }
  
  const idNumber = parseInt(cleanId);
  if (idNumber < 6000000 || idNumber > 6999999) {
    return { isValid: false, message: 'Numri i biznesit nuk është i vlefshëm për Kosovën' };
  }
  
  return { isValid: true, message: 'Numri i biznesit është i vlefshëm' };
};

// Mock API call to verify business ID with government database
const verifyBusinessIDWithGovernment = async (businessId: string): Promise<{ verified: boolean; businessName?: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const cleanId = businessId.replace(/\s/g, '').toUpperCase();
  
  // Mock verified businesses in Kosovo
  const mockVerifiedBusinesses = [
    { id: '6123456', name: 'TechKosovo LLC' },
    { id: '6234567', name: 'Agro Turizëm Prizren' },
    { id: '6345678', name: 'Artizanat Shqiptar' },
    { id: '6456789', name: 'Ferma Organike Malësia' },
    { id: '6567890', name: 'Kosovo Digital Solutions' },
    { id: '6678901', name: 'Pristina Innovation Hub' },
    { id: '6789012', name: 'Kosovo Green Energy' },
    { id: '6890123', name: 'Prizren Cultural Center' },
    { id: '6111111', name: 'Kosovo Tech Startup' },
    { id: '6222222', name: 'Pristina Software Solutions' },
    { id: '6333333', name: 'Kosovo Innovation Lab' },
    { id: '6444444', name: 'Digital Kosovo Hub' },
    { id: '6555555', name: 'Kosovo AI Solutions' },
    { id: '6666666', name: 'Pristina Digital Agency' },
    { id: '6777777', name: 'Kosovo Web Development' },
    { id: '6888888', name: 'Tech Solutions Kosovo' },
    { id: '6999999', name: 'Kosovo IT Services' },
    { id: '6101010', name: 'Digital Kosovo' },
    { id: '6202020', name: 'Kosovo Tech Company' },
    { id: '6303030', name: 'Pristina Tech Solutions' },
    { id: '6404040', name: 'Kosovo Digital Innovation' },
    { id: '6505050', name: 'Tech Kosovo Hub' },
    { id: '6606060', name: 'Kosovo Software Company' },
    { id: '6707070', name: 'Pristina Digital Solutions' },
    { id: '6808080', name: 'Kosovo Tech Lab' },
    { id: '6909090', name: 'Digital Solutions Kosovo' },
    { id: '6110101', name: 'Kosovo Innovation Tech' },
    { id: '6212121', name: 'Pristina Tech Hub' },
    { id: '6313131', name: 'Kosovo Digital Agency' },
    { id: '6414141', name: 'Tech Kosovo Solutions' },
    { id: '6515151', name: 'Kosovo Web Solutions' },
    { id: '6616161', name: 'Pristina Digital Tech' },
    { id: '6717171', name: 'Kosovo IT Solutions' },
    { id: '6818181', name: 'Digital Kosovo Tech' },
    { id: '6919191', name: 'Kosovo Tech Innovation' },
    { id: '6120202', name: 'Pristina Software Hub' },
    { id: '6221212', name: 'Kosovo Digital Lab' },
    { id: '6322222', name: 'Tech Solutions Kosovo' },
    { id: '6423232', name: 'Kosovo Innovation Hub' },
    { id: '6524242', name: 'Pristina Tech Company' },
    { id: '6625252', name: 'Kosovo Digital Solutions' },
    { id: '6726262', name: 'Tech Kosovo Agency' },
    { id: '6827272', name: 'Kosovo Web Development' },
    { id: '6928282', name: 'Pristina Digital Innovation' },
    { id: '6130303', name: 'Kosovo Tech Lab' },
    { id: '6231313', name: 'Digital Kosovo Solutions' },
    { id: '6332323', name: 'Kosovo Innovation Tech' },
    { id: '6433333', name: 'Pristina Tech Solutions' },
    { id: '6534343', name: 'Kosovo Digital Hub' },
    { id: '6635353', name: 'Tech Kosovo Company' },
    { id: '6736363', name: 'Kosovo Software Solutions' },
    { id: '6837373', name: 'Pristina Digital Tech' },
    { id: '6938383', name: 'Kosovo Innovation Lab' },
    { id: '6140404', name: 'Digital Kosovo Tech' },
    { id: '6241414', name: 'Kosovo Tech Solutions' },
    { id: '6342424', name: 'Pristina Innovation Hub' },
    { id: '6443434', name: 'Kosovo Digital Company' },
    { id: '6544444', name: 'Tech Kosovo Lab' },
    { id: '6645454', name: 'Kosovo Web Tech' },
    { id: '6746464', name: 'Pristina Digital Solutions' },
    { id: '6847474', name: 'Kosovo Innovation Company' },
    { id: '6948484', name: 'Digital Kosovo Hub' },
    { id: '6150505', name: 'Kosovo Tech Innovation' },
    { id: '6251515', name: 'Pristina Digital Lab' },
    { id: '6352525', name: 'Kosovo Software Hub' },
    { id: '6453535', name: 'Tech Kosovo Solutions' },
    { id: '6554545', name: 'Kosovo Digital Innovation' },
    { id: '6655555', name: 'Pristina Tech Company' },
    { id: '6756565', name: 'Kosovo Innovation Tech' },
    { id: '6857575', name: 'Digital Kosovo Solutions' },
    { id: '6958585', name: 'Kosovo Tech Hub' },
    { id: '6160606', name: 'Pristina Digital Innovation' },
    { id: '6261616', name: 'Kosovo Software Solutions' },
    { id: '6332626', name: 'Tech Kosovo Lab' },
    { id: '6463636', name: 'Kosovo Digital Company' },
    { id: '6564646', name: 'Pristina Innovation Hub' },
    { id: '6665656', name: 'Kosovo Tech Solutions' },
    { id: '6766666', name: 'Digital Kosovo Tech' },
    { id: '6867676', name: 'Kosovo Innovation Lab' },
    { id: '6968686', name: 'Pristina Digital Solutions' },
    { id: '6170707', name: 'Kosovo Tech Company' },
    { id: '6271717', name: 'Digital Kosovo Hub' },
    { id: '6372727', name: 'Kosovo Innovation Tech' },
    { id: '6473737', name: 'Pristina Tech Solutions' },
    { id: '6574747', name: 'Kosovo Digital Lab' },
    { id: '6675757', name: 'Tech Kosovo Innovation' },
    { id: '6776767', name: 'Kosovo Software Company' },
    { id: '6877777', name: 'Pristina Digital Tech' },
    { id: '6978787', name: 'Kosovo Innovation Hub' },
    { id: '6180808', name: 'Digital Kosovo Solutions' },
    { id: '6281818', name: 'Kosovo Tech Lab' },
    { id: '6382828', name: 'Pristina Innovation Company' },
    { id: '6483838', name: 'Kosovo Digital Tech' },
    { id: '6584848', name: 'Tech Kosovo Hub' },
    { id: '6685858', name: 'Kosovo Innovation Solutions' },
    { id: '6786868', name: 'Pristina Digital Lab' },
    { id: '6887878', name: 'Kosovo Tech Company' },
    { id: '6988888', name: 'Digital Kosovo Innovation' },
    { id: '6190909', name: 'Kosovo Software Hub' },
    { id: '6291919', name: 'Pristina Tech Innovation' },
    { id: '6392929', name: 'Kosovo Digital Solutions' },
    { id: '6493939', name: 'Tech Kosovo Lab' },
    { id: '6594949', name: 'Kosovo Innovation Tech' },
    { id: '6695959', name: 'Pristina Digital Company' },
    { id: '6796969', name: 'Kosovo Tech Solutions' },
    { id: '6897979', name: 'Digital Kosovo Hub' },
    { id: '6998989', name: 'Kosovo Innovation Lab' },
  ];
  
  const foundBusiness = mockVerifiedBusinesses.find(b => b.id === cleanId);
  
  if (foundBusiness) {
    return { verified: true, businessName: foundBusiness.name };
  }
  
  return { verified: false };
};

// Mock AI rating function
const generateAIRating = (): number => {
  return Math.floor(Math.random() * 51) + 50;
};

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

type FormStep = 'verification' | 'business-details' | 'rating';

export default function BusinessForm() {
  const navigate = useNavigate();
  const { setCurrentBusiness, setBusinesses } = useUser();
  
  const [currentStep, setCurrentStep] = useState<FormStep>('verification');
  const [businessId, setBusinessId] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verifiedBusinessName, setVerifiedBusinessName] = useState('');
  
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    description: "",
    fundingNeeded: "",
    industry: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const handleBusinessIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBusinessId(value);
    
    if (value.length > 0) {
      const validation = validateKosovoBusinessID(value);
      if (validation.isValid) {
        setVerificationStatus('validating');
        setVerificationMessage('Duke verifikuar me bazën e të dhënave të qeverisë...');
        
        verifyBusinessIDWithGovernment(value).then(result => {
          if (result.verified) {
            setVerificationStatus('valid');
            setVerificationMessage(`Biznesi u verifikua me sukses: ${result.businessName}`);
            setVerifiedBusinessName(result.businessName || '');
          } else {
            setVerificationStatus('invalid');
            setVerificationMessage('Biznesi nuk u gjet në bazën e të dhënave të qeverisë së Kosovës');
          }
        });
      } else {
        setVerificationStatus('invalid');
        setVerificationMessage(validation.message);
      }
    } else {
      setVerificationStatus('idle');
      setVerificationMessage('');
    }
  };

  const handleVerificationContinue = () => {
    if (verificationStatus === 'valid') {
      setFormData(prev => ({ ...prev, name: verifiedBusinessName }));
      setCurrentStep('business-details');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIndustryChange = (value: string) => {
    setFormData(prev => ({ ...prev, industry: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const aiRating = generateAIRating();
      setRating(aiRating);
      
      const newBusiness = {
        id: uuidv4(),
        name: formData.name,
        owner: formData.owner,
        description: formData.description,
        fundingNeeded: Number(formData.fundingNeeded),
        industry: formData.industry,
        aiRating
      };
      
      setCurrentBusiness(newBusiness);
      setBusinesses(prev => [...prev, newBusiness]);
      setIsSubmitting(false);
      setCurrentStep('rating');
    }, 1500);
  };

  const handleContinue = () => {
    navigate("/");
  };

  const renderVerificationStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Verifikimi i numrit të biznesit</h3>
        <p className="text-slate-600">
          Ju lutemi shkruani numrin e biznesit tuaj të regjistruar në Kosovë për të vazhduar
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="businessId">Numri i biznesit në Kosovë</Label>
          <Input
            id="businessId"
            placeholder="P.sh. 6123456"
            value={businessId}
            onChange={handleBusinessIdChange}
            className="text-center text-lg font-mono"
          />
          <p className="text-sm text-slate-500 mt-1">
            Numri i biznesit duhet të jetë 7 shifra duke filluar me 6
          </p>
        </div>

        {verificationStatus !== 'idle' && (
          <Alert className={verificationStatus === 'valid' ? 'border-green-200 bg-green-50' : 
                          verificationStatus === 'invalid' ? 'border-red-200 bg-red-50' : 
                          'border-blue-200 bg-blue-50'}>
            <div className="flex items-center space-x-2">
              {verificationStatus === 'validating' && <Loader2 className="h-4 w-4 animate-spin" />}
              {verificationStatus === 'valid' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {verificationStatus === 'invalid' && <XCircle className="h-4 w-4 text-red-600" />}
              <AlertDescription className={verificationStatus === 'valid' ? 'text-green-800' : 
                                        verificationStatus === 'invalid' ? 'text-red-800' : 
                                        'text-blue-800'}>
                {verificationMessage}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </div>

      <Button 
        onClick={handleVerificationContinue}
        disabled={verificationStatus !== 'valid'}
        className="w-full"
      >
        Vazhdoni me regjistrimin
      </Button>
    </motion.div>
  );

  const renderBusinessDetailsStep = () => (
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
              placeholder="Jepni një përshkrim të detajuar të biznesit tuaj"
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Duke analizuar..." : "Dërgo për vlerësim"}
        </Button>
      </form>
    </motion.div>
  );

  const renderRatingStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 text-center"
    >
      <h3 className="text-xl font-semibold">Vlerësimi i biznesit tuaj</h3>
      <div className="flex justify-center">
        <div className={`text-6xl font-bold w-32 h-32 rounded-full flex items-center justify-center ${
          rating >= 80 ? "bg-green-100 text-green-600" :
          rating >= 60 ? "bg-yellow-100 text-yellow-600" :
          "bg-orange-100 text-orange-600"
        }`}>
          {rating}
        </div>
      </div>
      <p className="text-slate-700">
        {rating >= 80
          ? "Shkëlqyeshëm! Biznesi juaj ka potencial të lartë për të tërhequr investitorë."
          : rating >= 60
          ? "Mirë! Biznesi juaj ka potencial të mirë. Konsideroni përmirësimin e planit tuaj për rezultate më të mira."
          : "Biznesi juaj ka potencial, por rekomandojmë të rishikoni planin tuaj të biznesit."}
      </p>
      <p className="text-sm text-slate-500">
        Vlerësimi bazohet në analizën e të dhënave që keni dhënë.
      </p>
    </motion.div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'verification':
        return 'Verifikimi i numrit të biznesit';
      case 'business-details':
        return 'Detajet e biznesit';
      case 'rating':
        return 'Vlerësimi i biznesit';
      default:
        return 'Regjistrimi i biznesit';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'verification':
        return 'Verifikoni numrin e biznesit tuaj me bazën e të dhënave të qeverisë së Kosovës';
      case 'business-details':
        return 'Plotësoni detajet e biznesit tuaj për të gjetur investitorë potencialë';
      case 'rating':
        return 'Rezultatet e vlerësimit të biznesit tuaj';
      default:
        return 'Ju lutemi plotësoni detajet e biznesit tuaj për të gjetur investitorë potencialë';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">{getStepTitle()}</CardTitle>
            <CardDescription className="text-center">
              {getStepDescription()}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {currentStep === 'verification' && renderVerificationStep()}
            {currentStep === 'business-details' && renderBusinessDetailsStep()}
            {currentStep === 'rating' && renderRatingStep()}
          </CardContent>

          {currentStep === 'rating' && (
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