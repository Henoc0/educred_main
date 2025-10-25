import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Eye, EyeOff, ArrowLeft, RefreshCw, Copy } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const { signIn, signUp, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const generateSecurePassword = () => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*(),.?":{}|<>';
    
    let password = '';
    
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest randomly
    const allChars = uppercase + lowercase + numbers + special;
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('forgot-email') as string;

    const { error } = await resetPassword(email);
    
    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre email pour réinitialiser votre mot de passe.",
      });
      setShowForgotPassword(false);
    }
    
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Erreur de connexion",
        description: error.message === 'Invalid login credentials' 
          ? "Email ou mot de passe incorrect" 
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Mot de passe faible",
        description: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password, firstName, lastName);
    
    if (error) {
      toast({
        title: "Erreur d'inscription",
        description: error.message === 'User already registered' 
          ? "Un compte existe déjà avec cet email" 
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-primary p-3 rounded-lg mr-3">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">EduCred</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Authentification</CardTitle>
            <CardDescription>
              Connectez-vous ou créez un compte pour accéder à la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                     </div>
                   </div>
                   <div className="flex justify-between items-center">
                     <Button 
                       type="button" 
                       variant="link" 
                       className="px-0 text-sm"
                       onClick={() => setShowForgotPassword(!showForgotPassword)}
                     >
                       Mot de passe oublié ?
                     </Button>
                   </div>
                   {showForgotPassword && (
                     <form onSubmit={handleForgotPassword} className="space-y-4 p-4 border rounded-lg bg-muted/50">
                       <div className="space-y-2">
                         <Label htmlFor="forgot-email">Email de récupération</Label>
                         <Input
                           id="forgot-email"
                           name="forgot-email"
                           type="email"
                           placeholder="votre@email.com"
                           required
                         />
                       </div>
                       <div className="flex gap-2">
                         <Button type="submit" size="sm" disabled={isLoading}>
                           {isLoading ? "Envoi..." : "Envoyer le lien"}
                         </Button>
                         <Button 
                           type="button" 
                           variant="outline" 
                           size="sm"
                           onClick={() => setShowForgotPassword(false)}
                         >
                           Annuler
                         </Button>
                       </div>
                     </form>
                   )}
                   <Button type="submit" className="w-full" disabled={isLoading}>
                     {isLoading ? "Connexion..." : "Se connecter"}
                   </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <Label htmlFor="signup-password">Mot de passe</Label>
                       <Button
                         type="button"
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           const newPassword = generateSecurePassword();
                           setGeneratedPassword(newPassword);
                           const passwordInput = document.getElementById('signup-password') as HTMLInputElement;
                           const confirmInput = document.getElementById('confirmPassword') as HTMLInputElement;
                           if (passwordInput && confirmInput) {
                             passwordInput.value = newPassword;
                             confirmInput.value = newPassword;
                           }
                         }}
                         className="h-7 text-xs"
                       >
                         <RefreshCw className="h-3 w-3 mr-1" />
                         Générer
                       </Button>
                     </div>
                     <div className="relative">
                       <Input
                         id="signup-password"
                         name="password"
                         type={showPassword ? "text" : "password"}
                         placeholder="••••••••"
                         required
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                         onClick={() => setShowPassword(!showPassword)}
                       >
                         {showPassword ? (
                           <EyeOff className="h-4 w-4" />
                         ) : (
                           <Eye className="h-4 w-4" />
                         )}
                       </Button>
                     </div>
                     {generatedPassword && (
                       <div className="p-3 bg-muted rounded-lg">
                         <p className="text-xs text-muted-foreground mb-2">Mot de passe généré :</p>
                         <div className="flex items-center gap-2">
                           <code className="text-sm font-mono bg-background px-2 py-1 rounded flex-1">
                             {generatedPassword}
                           </code>
                           <Button
                             type="button"
                             variant="ghost"
                             size="sm"
                             onClick={() => {
                               navigator.clipboard.writeText(generatedPassword);
                               toast({
                                 title: "Copié",
                                 description: "Mot de passe copié dans le presse-papier",
                               });
                             }}
                           >
                             <Copy className="h-4 w-4" />
                           </Button>
                         </div>
                       </div>
                     )}
                     <p className="text-xs text-muted-foreground">
                       Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
                     </p>
                   </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Inscription..." : "S'inscrire"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;