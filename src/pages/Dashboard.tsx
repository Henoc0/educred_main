import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Upload, CheckCircle, AlertCircle, Clock, User, FileText, Shield, Settings, LogOut, ArrowLeft, Download, History, ExternalLink } from 'lucide-react';
import DocumentUpload from '@/components/DocumentUpload';
import DocumentDetails from '@/components/documentDetails';
import { getUserDocumentsFromBackend } from '@/integrations/services/hedera_backend';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  establishment?: string | null;
  kyc_status: 'pending' | 'verified' | 'rejected';
  kyc_documents_uploaded: boolean;
}

interface Document {
  id: string;
  filename: string;
  file_size: number;
  file_type: string;
  file_path: string;
  file_hash: string;
  hedera_file_id: string;
  hedera_transaction_id: string;
  status: string;
  verification_status: string;
  uploaded_at: string;
  downloadUrl?: string;
  explorerUrl?: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [freeDocumentsLeft, setFreeDocumentsLeft] = useState(3);
  const [userDocuments, setUserDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchDocuments();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data as Profile | null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!user) return;
    
    try {
      const documents = await getUserDocumentsFromBackend(user.id);
      
      setUserDocuments(documents || []);
      const uploadedCount = documents?.length || 0;
      setFreeDocumentsLeft(Math.max(0, 3 - uploadedCount));
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const updates = {
      id: profile?.id,
      user_id: user?.id,
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      date_of_birth: formData.get('dateOfBirth') as string,
      address: formData.get('address') as string,
      establishment: formData.get('establishment') as string,
      city: formData.get('city') as string,
      postal_code: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil.",
          variant: "destructive",
        });
      } else {
        // Recharge les données du profil
        await fetchProfile();
        setIsEditing(false);
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été sauvegardées.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openDocument = async (document: Document) => {
    try {
      if (document.downloadUrl) {
        window.open(document.downloadUrl, '_blank');
      } else {
        toast({
          title: "Document non disponible",
          description: "L'URL de téléchargement n'est pas disponible",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document",
        variant: "destructive",
      });
    }
  };

  const openDocumentDetails = (document: Document) => {
    console.log('=== 🎯 DOCUMENT PASSÉ À DOCUMENTDETAILS ===');
    console.log('Document complet:', document);
    console.log('hedera_transaction_id:', document.hedera_transaction_id);
    console.log('hedera_file_id:', document.hedera_file_id);
    console.log('file_hash:', document.file_hash);
    console.log('Toutes les clés:', Object.keys(document));
    
    setSelectedDocument(document);
    
    setTimeout(() => {
      console.log('=== 🔄 APRÈS SETSELECTEDDOCUMENT ===');
      console.log('selectedDocument:', selectedDocument);
    }, 100);
  };

  const viewOnHashScan = (transactionId: string) => {
    const hashScanUrl = `https://hashscan.io/testnet/transaction/${transactionId}`;
    window.open(hashScanUrl, '_blank');
  };

  const getKycStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Vérifié</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
    }
  };

  const getDocumentStatusBadge = (document: Document) => {
    const status = document.status || document.verification_status;
    
    switch (status) {
      case 'verified':
      case 'authentic':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Validé</Badge>;
      case 'rejected':
      case 'modified':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      case 'anchored':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Validé
          </Badge>
        );
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">EduCred</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Bienvenue, {profile?.first_name || user?.email}
              </span>
              <Button variant="ghost" onClick={signOut} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Gérez votre profil et vos documents certifiés sur Hedera
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-secondary p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documents gratuits restants</p>
                  <p className="text-xl font-semibold">
                    {freeDocumentsLeft} documents
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-hero p-3 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profil</p>
                  <p className="text-xl font-semibold">
                    {profile?.first_name && profile?.last_name ? 'Complet' : 'Incomplet'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                  {!isEditing && profile?.first_name && (
                    <Badge variant="secondary" className="ml-2">
                      🔒 Complété
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {!isEditing && profile?.first_name 
                    ? "Vos informations personnelles sont complètes"
                    : "Complétez vos informations personnelles (les champs avec * sont obligatoires)"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        Prénom *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        defaultValue={profile?.first_name || ''}
                        required
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-100" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Nom *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        defaultValue={profile?.last_name || ''}
                        required
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-100" : ""}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Téléphone *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={profile?.phone || ''}
                        required
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-100" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">
                        Date de naissance *
                      </Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        defaultValue={profile?.date_of_birth || ''}
                        required
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-100" : ""}
                      />
                    </div>
                  </div>

                  {/* CHAMP ÉTABLISSEMENT */}
                  <div className="space-y-2">
                    <Label htmlFor="establishment">
                      Établissement *
                    </Label>
                    <Input
                      id="establishment"
                      name="establishment"
                      defaultValue={profile?.establishment || ''}
                      required
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-100" : ""}
                      placeholder="Nom de votre université ou école"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Adresse
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={profile?.address || ''}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-100" : ""}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        Ville *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        defaultValue={profile?.city || ''}
                        required
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-100" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">
                        Code postal
                      </Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        defaultValue={profile?.postal_code || ''}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-100" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">
                        Pays *
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        defaultValue={profile?.country || ''}
                        required
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-100" : ""}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    {isEditing ? (
                      <>
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? "Sauvegarde..." : "Sauvegarder les modifications"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Annuler
                        </Button>
                      </>
                    ) : (
                      <Button 
                        type="button"
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                      >
                        ✏️ Modifier le profil
                      </Button>
                    )}
                  </div>

                  {!isEditing && profile?.first_name && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>✅ Profil complété</strong><br />
                        Vos informations personnelles sont enregistrées. 
                        Cliquez sur "Modifier le profil" pour apporter des corrections si nécessaire.
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <DocumentUpload onDocumentUploaded={fetchDocuments} freeDocumentsLeft={freeDocumentsLeft} />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Historique des documents certifiés
                </CardTitle>
                <CardDescription>
                  Consultez vos documents ancrés sur Hedera Hashgraph
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userDocuments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun document certifié pour le moment</p>
                    <p className="text-sm mt-2">Utilisez l'onglet "Documents" pour ancrer vos premiers fichiers sur Hedera</p>
                  </div>
                ) : ( 
                  <div className="space-y-4">
                    {userDocuments.map((document) => (
                      <div key={document.id} className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors">
                        <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{document.filename}</p>
                          <p className="text-sm text-muted-foreground">
                            Ancré le {new Date(document.uploaded_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(document.file_size)} • Hash: {document.file_hash?.substring(0, 16)}...
                          </p>
                          {document.hedera_transaction_id && (
                            <div className="mt-1">
                              <p className="text-xs text-muted-foreground">
                                Transaction: {document.hedera_transaction_id?.substring(0, 20)}...
                              </p>
                              <button
                                onClick={() => viewOnHashScan(document.hedera_transaction_id)}
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                              >
                                Voir sur HashScan <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getDocumentStatusBadge(document)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDocumentDetails(document)}
                            className="flex items-center gap-2"
                          >
                            <Shield className="h-4 w-4" />
                            Voir preuves
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDocument(document)}
                            className="flex items-center gap-2"
                            disabled={!document.downloadUrl}
                          >
                            <Download className="h-4 w-4" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Document Details Modal */}
        {selectedDocument && (
          <DocumentDetails 
            document={selectedDocument} 
            onClose={() => setSelectedDocument(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;