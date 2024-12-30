import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthForms } from "@/components/auth/AuthForms";
import SearchBar from "@/components/SearchBar";
import Index from "./pages/Index";
import PropertyDetails from "./pages/PropertyDetails";
import PropertiesList from "./pages/PropertiesList";
import Profile from "./pages/Profile";
import ListProperty from "./pages/ListProperty";
import EditProperty from "./pages/EditProperty";
import { useEffect } from "react";

const queryClient = new QueryClient();

// ScrollToTop component to handle scroll behavior
const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed, scrolling to top');
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const Header = () => {
  const location = useLocation();
  const isIndexPage = location.pathname === "/";

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between p-4">
          <a href="/" className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              NOMADRENT
            </span>
          </a>
          {!isIndexPage && <SearchBar />}
          <AuthForms />
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <div>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/property/:id/edit" element={<EditProperty />} />
              <Route path="/properties/:location" element={<PropertiesList />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/list-property" element={<ListProperty />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;