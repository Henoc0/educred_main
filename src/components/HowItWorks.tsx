import { UserPlus, Upload, Shield, Share } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Créez Votre Profil",
    description: "Inscrivez-vous avec email ou téléphone et créez votre profil académique avec les détails universitaires."
  },
  {
    icon: Upload,
    title: "Téléversez Documents",
    description: "Téléversez en toute sécurité vos diplômes, certificats, CV et reçus académiques."
  },
  {
    icon: Shield,
    title: "Vérification Blockchain",
    description: "Chaque document est haché et ancré sur Hedera testnet pour une vérification inviolable."
  },
  {
    icon: Share,
    title: "Partagez & Vérifiez",
    description: "Générez des liens partageables ou QR codes pour que les employeurs vérifient vos certificats instantanément."
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Comment <span className="text-secondary">EduCred</span> Fonctionne
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Commencez en quelques minutes et créez votre profil académique vérifié en qui les employeurs ont confiance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 z-0"></div>
              )}
              
              <div className="relative z-10">
                {/* Step Number */}
                <div className="bg-gradient-secondary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="bg-card border w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group hover:shadow-medium transition-all duration-300">
                  <step.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};