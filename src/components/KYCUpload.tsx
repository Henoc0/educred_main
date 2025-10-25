import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Check, X, Camera, CreditCard } from 'lucide-react';

interface UploadedFile {
  name: string;
  type: 'passport' | 'national_id' | 'driving_license';
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

const KYCUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedDocType, setSelectedDocType] = useState<'passport' | 'national_id' | 'driving_license'>('passport');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (selectedFiles.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const invalidFiles = selectedFiles.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Type de fichier non supporté",
        description: "Seuls les fichiers JPG, PNG et PDF sont acceptés.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    const oversizedFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 10MB par fichier.",
        variant: "destructive",
      });
      return;
    }

    // Add files to upload queue
    const newFiles: UploadedFile[] = selectedFiles.map(file => ({
      name: file.name,
      type: selectedDocType,
      status: 'uploading',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Upload each file
    selectedFiles.forEach((file, index) => {
      uploadFile(file, index + files.length);
    });
  };

  const uploadFile = async (file: File, fileIndex: number) => {
    try {
      const fileName = `${user?.id}/${selectedDocType}/${Date.now()}_${file.name}`;
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map((f, i) => {
          if (i === fileIndex && f.progress < 90) {
            return { ...f, progress: f.progress + 10 };
          }
          return f;
        }));
      }, 200);
      
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file);

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      // Update file status to success
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, status: 'success', progress: 100 } : f
      ));

      // Update profile to mark documents as uploaded
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ kyc_documents_uploaded: true })
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Document envoyé avec succès",
        description: "Votre document a été téléchargé et sera examiné sous peu.",
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, status: 'error', progress: 0 } : f
      ));

      toast({
        title: "Erreur d'upload",
        description: "Impossible de télécharger le document. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'passport':
        return <FileText className="h-4 w-4" />;
      case 'national_id':
        return <CreditCard className="h-4 w-4" />;
      case 'driving_license':
        return <Camera className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentLabel = (type: string) => {
    switch (type) {
      case 'passport':
        return 'Passeport';
      case 'national_id':
        return 'Carte d\'identité nationale';
      case 'driving_license':
        return 'Permis de conduire';
      default:
        return 'Document';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de documents KYC
        </CardTitle>
        <CardDescription>
          Téléchargez vos documents d'identité pour la vérification KYC
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Type Selection */}
        <div className="space-y-3">
          <Label>Type de document</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              type="button"
              variant={selectedDocType === 'passport' ? 'default' : 'outline'}
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setSelectedDocType('passport')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Passeport</span>
            </Button>
            <Button
              type="button"
              variant={selectedDocType === 'national_id' ? 'default' : 'outline'}
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setSelectedDocType('national_id')}
            >
              <CreditCard className="h-6 w-6" />
              <span className="text-sm">Carte d'identité</span>
            </Button>
            <Button
              type="button"
              variant={selectedDocType === 'driving_license' ? 'default' : 'outline'}
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setSelectedDocType('driving_license')}
            >
              <Camera className="h-6 w-6" />
              <span className="text-sm">Permis de conduire</span>
            </Button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Télécharger un {getDocumentLabel(selectedDocType).toLowerCase()}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Glissez-déposez vos photos ici ou cliquez pour parcourir
            </p>
            <Button type="button">
              <Upload className="h-4 w-4 mr-2" />
              Choisir des fichiers
            </Button>
          </div>

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="text-xs text-muted-foreground">
            <p>• Formats acceptés: JPG, PNG, PDF</p>
            <p>• Taille maximale: 10MB par fichier</p>
            <p>• Pour une meilleure qualité, prenez des photos nettes et bien éclairées</p>
            <p>• Assurez-vous que toutes les informations du document sont lisibles</p>
          </div>
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <Label>Fichiers téléchargés</Label>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    {getDocumentIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getDocumentLabel(file.type)}
                      </p>
                    </div>
                  </div>

                  {file.status === 'uploading' && (
                    <div className="flex items-center gap-2">
                      <Progress value={file.progress} className="w-16" />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(file.progress)}%
                      </span>
                    </div>
                  )}

                  {file.status === 'success' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-xs">Envoyé</span>
                    </div>
                  )}

                  {file.status === 'error' && (
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-destructive" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Instructions importantes:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Prenez des photos des deux côtés de votre document d'identité</li>
            <li>• Assurez-vous que le document est entièrement visible dans le cadre</li>
            <li>• Évitez les reflets et les ombres</li>
            <li>• Le texte doit être parfaitement lisible</li>
            <li>• Les documents doivent être valides et non expirés</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default KYCUpload;