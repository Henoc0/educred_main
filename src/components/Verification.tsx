import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Shield, CheckCircle, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import verificationIcon from "@/assets/verification-icon.jpg";

export const Verification = () => {
  const { user } = useAuth();
  
  return (
    <section id="verification" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Portail de <span className="text-secondary">Vérification</span> Documents
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Les employeurs et recruteurs peuvent instantanément vérifier les certificats académiques grâce à notre système de vérification alimenté par blockchain.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Verification Tool */}
          <Card className="p-8 bg-gradient-card shadow-medium">
            <div className="text-center mb-8">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Vérifier Documents</h3>
              <p className="text-muted-foreground">Téléversez un document pour vérifier son authenticité contre les enregistrements blockchain</p>
            </div>
            
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors duration-300 cursor-pointer group">
              {user ? (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4 group-hover:text-primary transition-colors duration-300" />
                  <p className="text-lg font-medium mb-2">Télécharger un document</p>
                  <p className="text-muted-foreground text-sm mb-4">Accédez aux outils de stockage local et en ligne</p>
                  <Button variant="outline" className="mt-2" onClick={() => window.location.href = '/dashboard'}>
                    Importer Documents
                  </Button>
                </>
              ) : (
                <>
                  <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Connexion requise</p>
                  <p className="text-muted-foreground text-sm mb-4">Vous devez être connecté pour télécharger des documents</p>
                  <Button variant="outline" className="mt-2" onClick={() => window.location.href = '/auth'}>
                    Se connecter
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <div className="flex items-center gap-3 text-secondary">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Formats supportés : PDF, JPG, PNG, DOCX</span>
              </div>
            </div>
          </Card>
          
          {/* Info Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-center lg:justify-start">
              <img 
                src={verificationIcon} 
                alt="Bouclier de Vérification"
                className="w-24 h-24 rounded-2xl shadow-soft"
              />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Comment Fonctionne la Vérification</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Téléverser Document</h4>
                    <p className="text-muted-foreground">Téléversez le document que vous souhaitez vérifier</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Génération Hash</h4>
                    <p className="text-muted-foreground">Le système génère un hash unique du document</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Vérification Blockchain</h4>
                    <p className="text-muted-foreground">Le hash est vérifié contre les enregistrements Hedera testnet</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Résultats Instantanés</h4>
                    <p className="text-muted-foreground">Obtenez immédiatement le statut de vérification et les détails</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};