import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">EduCred</span>
          </div>
          
          {/* Desktop Navigation - Simplified */}
          <div className="hidden md:flex items-center gap-8">
            {/* Navigation items removed as requested */}
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  <User className="h-4 w-4 mr-2" />
                  Mon Compte
                </Button>
                <Button variant="outline" onClick={signOut}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>Connexion</Button>
                <Button variant="default" onClick={() => navigate('/auth')}>S'inscrire Gratuitement</Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-large">
            <div className="px-4 py-6 space-y-4">
              <div className="flex flex-col gap-3 pt-4">
                {user ? (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/dashboard')}>
                      <User className="h-4 w-4 mr-2" />
                      Mon Compte
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={signOut}>
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/auth')}>Connexion</Button>
                    <Button variant="default" className="justify-start" onClick={() => navigate('/auth')}>S'inscrire Gratuitement</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};