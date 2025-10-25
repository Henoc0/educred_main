import { Button } from "@/components/ui/button";
import { Shield, FileCheck, QrCode } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-full shadow-soft">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Documents Vérifiés par Blockchain</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Votre Coffre-fort
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Académique Numérique</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              Stockez, sécurisez et partagez vos documents académiques avec vérification blockchain. 
              Créez un profil de confiance que les employeurs peuvent vérifier instantanément.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="text-lg px-8 py-3">
                Commencer Gratuitement
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Voir Comment Ça Marche
              </Button>
            </div>
            
            <div className="flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-secondary" />
                <span>3 docs gratuits</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-secondary" />
                <span>Vérifié blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-secondary" />
                <span>Partage facile</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative bg-gradient-card rounded-3xl p-8 shadow-large">
              <img 
                src={dashboardPreview} 
                alt="Aperçu du Tableau de Bord EduCred"
                className="w-full h-auto rounded-2xl shadow-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};