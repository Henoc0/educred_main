import { GraduationCap, Twitter, Linkedin, Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">EduCred</span>
            </div>
            <p className="text-muted-foreground">
              L'avenir de la vérification des certificats académiques, alimenté par la technologie Hashgraph.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Produit</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tarifs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sécurité</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Centre d'Aide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Communauté</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">À Propos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Carrières</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Conditions</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 EduCred. Tous droits réservés. Conçu pour les étudiants et professionels du monde entier.</p>
        </div>
      </div>
    </footer>
  );
};