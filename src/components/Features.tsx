import { Shield, Upload, Link, Smartphone, FileCheck, Users } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Stockage Sécurisé",
    description: "Téléversez diplômes, certificats, CV et reçus dans votre coffre-fort numérique chiffré."
  },
  {
    icon: Shield,
    title: "Vérification sur Hedera Hashgraph",
    description: "Chaque document est enregistré sur Hedera. Une entité de confiance qui vous assure sécurité et transparence"
  },
  {
    icon: Link,
    title: "Partage Facile",
    description: "Générez des liens partageables ou QR codes pour présenter vos certificats aux employeurs."
  },
  {
    icon: FileCheck,
    title: "Vérification Instantanée",
    description: "Les employeurs peuvent vérifier l'authenticité des documents en consultant les enregistrements blockchain."
  },
  {
    icon: Smartphone,
    title: "Optimisé Mobile",
    description: "Accédez à votre coffre-fort académique partout avec notre interface mobile responsive."
  },
  {
    icon: Users,
    title: "Plateforme de Confiance",
    description: "Rejoignez des milliers d'étudiants et des centaines d'employeurs qui font confiance à EduCred."
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Pourquoi Choisir <span className="text-primary">EduCred</span> ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conçu pour l'avenir de la vérification académique, combinant la technologie blockchain de pointe 
            avec un design intuitif.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border group hover:border-primary/20"
            >
              <div className="bg-gradient-primary w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};