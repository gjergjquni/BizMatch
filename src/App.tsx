import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BusinessForm from './pages/BusinessForm';
import BusinessRating from './pages/BusinessRating';
import InvestorForm from './pages/InvestorForm';
import SwipeInterface from './pages/SwipeInterface';
import ChatPage from './pages/ChatPage';
import NotFound from './pages/NotFound';
import { UserProvider } from './contexts/UserContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/business-form" element={<BusinessForm />} />
            <Route path="/business-rating" element={<BusinessRating />} />
            <Route path="/investor-form" element={<InvestorForm />} />
            <Route path="/swipe" element={<SwipeInterface />} />
            <Route path="/chat/:businessId" element={<ChatPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;