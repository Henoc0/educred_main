import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    price: "0 FCFA",
    period: "2 premiers documents",
    description: "Parfait pour les étudiants qui commencent",
    features: [
      "Téléversement de 2 documents gratuits",
      "Création de profil de base",
      "Lien public partageable",
      "Vérification blockchain",
      "Accès mobile"
    ],
    popular: false
  },
  {
    name: "Pay-per-use",
    price: "1000 FCFA",
    period: "par document",
    description: "Payez uniquement pour ce que vous utilisez",
    features: [
      "Documents supplémentaires à la demande",
      "URL de profil personnalisée",
      "Analyses avancées",
      "Vérification prioritaire",
      "Génération de QR code",
      "Support 24/7"
    ],
    popular: true
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Tarification Simple et <span className="text-primary">Transparente</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Commencez gratuitement et payez uniquement pour les documents supplémentaires. Aucun frais caché, aucun niveau compliqué.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-card rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border relative ${
                plan.popular ? 'border-primary/20 scale-105' : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-secondary text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-medium">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">Le Plus Populaire</span>
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="bg-secondary/20 text-secondary p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.popular ? "default" : "outline"} 
                className="w-full"
                size="lg"
              >
                {plan.name === "Gratuit" ? "Commencer Gratuitement" : "Acheter Documents"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};