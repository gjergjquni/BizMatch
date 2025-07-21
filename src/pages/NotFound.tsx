import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-medium text-slate-800">Faqja nuk u gjet</h2>
        <p className="text-slate-600">Faqja që po kërkoni nuk ekziston ose mund të jetë zhvendosur.</p>
        <Button onClick={() => navigate("/")} size="lg">
          Kthehu në faqen kryesore
        </Button>
      </div>
    </div>
  );
}