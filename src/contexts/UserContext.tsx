import { createContext, useContext, useState, ReactNode } from 'react';

// User types
export type UserType = 'business' | 'investor' | null;

// Business interface
export interface Business {
  id: string;
  name: string;
  owner: string;
  description: string;
  fundingNeeded: number;
  industry: string;
  aiRating?: number;
}

// Investor interface
export interface Investor {
  id: string;
  name: string;
  investmentAmount: number;
  interests: string[];
}

// Match interface
export interface Match {
  investorId: string;
  businessId: string;
}

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  currentBusiness: Business | null;
  setCurrentBusiness: (business: Business | null) => void;
  currentInvestor: Investor | null;
  setCurrentInvestor: (investor: Investor | null) => void;
  businesses: Business[];
  setBusinesses: (businesses: Business[] | ((prev: Business[]) => Business[])) => void;
  matches: Match[];
  addMatch: (match: Match) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  console.log('UserProvider component rendering...');
  
  const [userType, setUserType] = useState<UserType>(null);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [currentInvestor, setCurrentInvestor] = useState<Investor | null>(null);
  const [businesses, setBusinessesState] = useState<Business[]>([
    {
      id: '1',
      name: 'Artizanat Shqiptar',
      owner: 'Arta Krasniqi',
      description: 'Prodhimi i produkteve artizanale tradicionale shqiptare, duke përdorur teknika të trashëguara për breza me materiale lokale për të krijuar punime dore unike.',
      fundingNeeded: 25000,
      industry: 'Artizanat',
      aiRating: 78
    },
    {
      id: '2',
      name: 'Ferma Organike Malësia',
      owner: 'Besnik Gjoni',
      description: 'Fermë organike që prodhon fruta dhe perime pa përdorur pesticide kimike. Fokusohemi në ruajtjen e varieteteve tradicionale dhe praktikat e qëndrueshme të bujqësisë.',
      fundingNeeded: 40000,
      industry: 'Bujqësi',
      aiRating: 85
    },
    {
      id: '3',
      name: 'TechKosovo',
      owner: 'Elona Hoxha',
      description: 'Startup teknologjik që zhvillon aplikacione për të përmirësuar arsimin në zonat rurale të Kosovës, duke i bërë materialet mësimore të disponueshme në gjuhën shqipe.',
      fundingNeeded: 60000,
      industry: 'Teknologji',
      aiRating: 92
    },
    {
      id: '4',
      name: 'Agro Turizëm Prizren',
      owner: 'Dritan Basha',
      description: 'Projekt agro-turizmi që kombinon eksperiencën e një ferme tradicionale me akomodim turistik, duke promovuar kulturën dhe ushqimin autentik të zonës së Prizrenit.',
      fundingNeeded: 50000,
      industry: 'Turizëm',
      aiRating: 80
    }
  ]);
  const [matches, setMatches] = useState<Match[]>([]);

  const addMatch = (match: Match) => {
    setMatches(prev => [...prev, match]);
  };

  const setBusinesses = (businesses: Business[] | ((prev: Business[]) => Business[])) => {
    if (typeof businesses === 'function') {
      setBusinessesState(businesses);
    } else {
      setBusinessesState(businesses);
    }
  };

  const value = {
    userType,
    setUserType,
    currentBusiness,
    setCurrentBusiness,
    currentInvestor,
    setCurrentInvestor,
    businesses,
    setBusinesses,
    matches,
    addMatch
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};