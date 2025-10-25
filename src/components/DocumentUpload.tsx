import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle, Clock, X, Cloud, HardDrive, Blocks, ExternalLink } from 'lucide-react';
import { 
  uploadToHederaBackend, 
  getUserDocumentsFromBackend 
} from '@/integrations/services/hedera_backend';

interface UploadedDocument {
  id?: string;
  filename: string;
  file_type: string;
  file_size: number;
  file_path?: string;
  status: 'uploading' | 'pending' | 'verified' | 'rejected' | 'blockchain-validating' | 'anchored';
  progress: number;
  file?: File;
  hedera_file_id?: string;
  hedera_transaction_id?: string;
  transaction_url?: string;
  file_hash?: string;
  anchored_at?: string;
}

interface DocumentUploadProps {
  onDocumentUploaded?: () => void;
  freeDocumentsLeft: number;
}

const DocumentUpload = ({ onDocumentUploaded, freeDocumentsLeft }: DocumentUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    fetchUserDocuments();
  }, [user]);

  const fetchUserDocuments = async () => {
    if (!user) return;
    
    try {
      const documents = await getUserDocumentsFromBackend(user.id);
      
      // Transformer les données du backend pour l'interface
      const formattedDocs: UploadedDocument[] = documents.map((doc: any) => ({
        id: doc.id,
        filename: doc.filename,
        file_type: doc.file_type,
        file_size: doc.file_size,
        status: doc.status === 'anchored' ? 'anchored' : 'pending',
        progress: 100,
        hedera_file_id: doc.hedera_file_id,
        hedera_transaction_id: doc.hedera_transaction_id,
        transaction_url: doc.explorerUrl,
        file_hash: doc.file_hash,
        anchored_at: doc.uploaded_at
      }));

      setDocuments(formattedDocs);
      
      if (onDocumentUploaded) {
        onDocumentUploaded();
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (files: File[]) => {
    const maxSize = 25 * 1024 * 1024; // 25MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Type de fichier non supporté",
          description: `Le fichier ${file.name} n'est pas supporté. Formats acceptés: PDF, JPG, PNG, DOCX`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > maxSize) {
        toast({
          title: "Fichier trop volumineux",
          description: `Le fichier ${file.name} dépasse la taille limite de 25MB`,
          variant: "destructive",
        });
        continue;
      }

      const newDocument: UploadedDocument = {
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        status: 'uploading',
        progress: 0,
        file
      };

      setDocuments(prev => [...prev, newDocument]);
      uploadDocument(file, newDocument);
    }
  };

 const uploadDocument = async (file: File, document: UploadedDocument) => {
  if (!user) return;

  try {
    // Simulation de progression
    const progressInterval = setInterval(() => {
      setDocuments(prev => prev.map(doc => 
        doc.filename === document.filename && doc.status === 'uploading'
          ? { ...doc, progress: Math.min(doc.progress + 10, 50) }
          : doc
      ));
    }, 200);

    // Upload vers votre backend Hedera
    const result = await uploadToHederaBackend(file, user.id);

    clearInterval(progressInterval);

    if (!result.success) {
      throw new Error(result.error || 'Erreur lors de l\'upload');
    }

    // DEBUG: Vérifier que transactionId est bien présent
    console.log('=== ✅ TRANSACTION ID DANS RÉPONSE ===');
    console.log('transactionId:', result.hederaProof?.transactionId);
    console.log('File ID:', result.hederaProof?.fileId);

    // Mettre à jour avec les données Hedera
    setDocuments(prev => prev.map(doc => 
      doc.filename === document.filename && doc.status === 'uploading'
        ? { 
            ...doc, 
            id: result.document?.id,
            status: 'anchored',
            progress: 100,
            hedera_file_id: result.hederaProof?.fileId,
            hedera_transaction_id: result.hederaProof?.transactionId, //  BIEN PRÉSENT
            transaction_url: result.hederaProof?.transactionUrl,
            file_hash: result.document?.fileHash
          }
        : doc
    ));

    // DEBUG: Vérifier la mise à jour locale
    console.log('=== 🔄 APRÈS MISE À JOUR LOCALE ===');
    setDocuments(prev => {
      const updatedDoc = prev.find(d => d.filename === document.filename);
      console.log('Document mis à jour:', updatedDoc);
      return prev;
    });

    toast({
      title: "✅ Document ancré sur Hedera!",
      description: (
        <div>
          <p>Votre document a été ancré sur Hedera Hashgraph</p>
          {result.hederaProof?.transactionUrl && (
            <a 
              href={result.hederaProof.transactionUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 mt-1"
            >
              Voir la transaction <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      ),
    });

    // ⚠️ PROBLÈME : Le refresh recharge les anciennes données sans transactionId
    // SOLUTION : Attendre un peu avant de refresh pour que la BDD soit à jour
    setTimeout(() => {
      if (onDocumentUploaded) {
        onDocumentUploaded();
      }
    }, 2000);

  } catch (error: any) {
    console.error('Upload error:', error);
    setDocuments(prev => prev.filter(doc => doc.filename !== document.filename));
    
    toast({
      title: "Erreur de téléchargement",
      description: `Impossible de télécharger ${file.name}: ${error.message}`,
      variant: "destructive",
    });
  }
};

  const removeDocument = async (document: UploadedDocument) => {
    setDocuments(prev => prev.filter(doc => doc.filename !== document.filename));
    
    toast({
      title: "Document supprimé",
      description: "Le document a été retiré de la liste (suppression locale)",
    });
  };

  const getStatusBadge = (document: UploadedDocument) => {
    switch (document.status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Validé</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      case 'uploading':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Téléchargement...</Badge>;
      case 'blockchain-validating':
        return (
          <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30 animate-pulse">
            <Blocks className="w-3 h-3 mr-1 animate-spin" />
            Validation blockchain...
          </Badge>
        );
      case 'anchored':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Validé
          </Badge>
        );
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Authentification de Documents avec Hedera
        </CardTitle>
        <CardDescription>
          Téléchargez et ancrez vos documents sur Hedera Hashgraph • {freeDocumentsLeft} documents gratuits restants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <HardDrive className="h-6 w-6 text-primary" />
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Blocks className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Ancrage sur Hedera Hashgraph</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Glissez-déposez vos documents ici pour les ancrer sur Hedera Hashgraph
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Preuve d'intégrité immuable et vérification instantanée
              </p>
            </div>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Choisir des fichiers
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Supported Formats */}
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
          <p><strong>Formats acceptés:</strong> PDF, JPG, PNG, DOCX</p>
          <p><strong>Taille maximum:</strong> 25MB par fichier</p>
          <p><strong>Système d'authentification :</strong> Hedera Hashgraph Testnet</p>
        </div>

        {/* Documents List */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Documents authentifiés</h4>
            {documents.map((document, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{document.filename}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(document.file_size)}
                    {document.file_hash && ` • Hash: ${document.file_hash.substring(0, 16)}...`}
                  </p>
                  {document.status === 'uploading' && (
                    <Progress value={document.progress} className="mt-2" />
                  )}
                  {document.transaction_url && (
                    <a 
                      href={document.transaction_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      Voir sur HashScan <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getStatusBadge(document)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(document)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;