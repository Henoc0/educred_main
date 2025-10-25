import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  FileText, 
  Calendar,
  Hash,
  Fingerprint,
  Shield,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentDetailsProps {
  document: {
    id: string;
    filename: string;
    file_size: number;
    file_type: string;
    file_hash: string;
    hedera_file_id: string;
    hedera_transaction_id: string;
    status: string;
    verification_status: string;
    uploaded_at: string;
    transaction_url?: string;
  };
  onClose: () => void;
}

const DocumentDetails = ({ document, onClose }: DocumentDetailsProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${label} a été copié dans le presse-papier`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = () => {
    switch (document.verification_status) {
      case 'authentic':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Authentique</Badge>;
      case 'modified':
        return <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Modifié</Badge>;
      case 'anchored':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ancré sur Hedera
          </Badge>
        );
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Détails du document
              </CardTitle>
              <CardDescription>
                Preuves d'authenticité et vérification blockchain
              </CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </CardHeader>

        <ScrollArea className="h-[70vh]">
          <CardContent className="p-6 space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Informations du document
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Nom du fichier</label>
                    <p className="font-medium truncate">{document.filename}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Taille</label>
                    <p className="font-medium">{formatFileSize(document.file_size)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Type</label>
                    <p className="font-medium">{document.file_type}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Statut</label>
                    <div className="mt-1">{getStatusBadge()}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Horodatage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Date d'upload</label>
                    <p className="font-medium">
                      {new Date(document.uploaded_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Identifiant document</label>
                    <p className="font-mono text-sm truncate">{document.id}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

 {/* Preuve blockchain par hedera */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Shield className="h-5 w-5" />
      Preuves Blockchain Hedera
    </CardTitle>
    <CardDescription>
      Ces informations certifient l'authenticité et l'intégrité de votre document
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Hash SHA256 */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Hash className="h-4 w-4" />
          Empreinte numérique (SHA256)
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(document.file_hash, "L'empreinte numérique")}
          disabled={!document.file_hash}
        >
          <Copy className="h-3 w-3 mr-1" />
          Copier
        </Button>
      </div>
      <div className="bg-muted p-3 rounded-lg font-mono text-sm break-all">
        {document.file_hash || "Chargement..."}
      </div>
      <p className="text-xs text-muted-foreground">
        Cette empreinte unique identifie votre document de manière sécurisée
      </p>
    </div>

    {/* File ID Hedera */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Fingerprint className="h-4 w-4" />
          File ID Hedera
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(document.hedera_file_id, "Le File ID Hedera")}
          disabled={!document.hedera_file_id}
        >
          <Copy className="h-3 w-3 mr-1" />
          Copier
        </Button>
      </div>
      <div className="bg-muted p-3 rounded-lg font-mono text-sm">
        {document.hedera_file_id || "Chargement..."}
      </div>
    </div>

    {/* Transaction ID */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Transaction ID Hedera
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(document.hedera_transaction_id, "La Transaction ID")}
          disabled={!document.hedera_transaction_id}
        >
          <Copy className="h-3 w-3 mr-1" />
          Copier
        </Button>
      </div>
      <div className="bg-muted p-3 rounded-lg font-mono text-sm">
        {document.hedera_transaction_id || "Chargement..."}
      </div>
    </div>

    {/* Lien de vérification */}
    <div className="pt-4">
      <Button 
        asChild 
        variant="default" 
        className="w-full"
        disabled={!document.hedera_transaction_id}
      >
        <a 
          href={`https://hashscan.io/testnet/transaction/${document.hedera_transaction_id}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Vérifier sur HashScan Testnet
        </a>
      </Button>
      <p className="text-xs text-muted-foreground text-center mt-2">
        {document.hedera_transaction_id 
          ? "Cliquez pour voir la transaction sur l'explorateur blockchain" 
          : "Transaction ID non disponible"}
      </p>
    </div>
  </CardContent>
</Card>

            {/* Informations de sécurité */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Ce document est sécurisé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>✅ <strong>Immutable</strong> : L'empreinte est ancrée pour toujours sur Hedera</li>
                  <li>✅ <strong>Vérifiable</strong> : L'authenticité peut être vérifiée à tout moment</li>
                  <li>✅ <strong>Transparent</strong> : La transaction est visible publiquement</li>
                  <li>✅ <strong>Infalsifiable</strong> : Toute modification serait détectée immédiatement</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default DocumentDetails;