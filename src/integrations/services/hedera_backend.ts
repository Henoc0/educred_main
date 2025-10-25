// src/integrations/services/hedera_backend.ts
const API_BASE_URL = 'https://backend-hedera.onrender.com/api/documents';

// Fonction pour convertir le fichier en base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Fonction pour calculer le hash SHA256 du fichier
export const calculateFileHash = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

// Upload vers votre backend Express - VERSION CORRIGÉE
export const uploadToHederaBackend = async (file: File, userId: string) => {
  try {
    // Convertir le fichier en base64 (comme votre backend l'attend)
    const base64File = await convertFileToBase64(file);
    
    // Préparer les données EXACTEMENT comme votre backend les attend
    const payload = {
      userId: userId,
      fileName: file.name,  // ⚠️ "fileName" pas "filename"
      file: base64File,     // ⚠️ Fichier en base64
      mimeType: file.type   // ⚠️ "mimeType" pas "fileType"
    };

    // Envoyer à votre backend
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erreur backend: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur upload backend:', error);
    throw error;
  }
};

// Récupérer les documents d'un utilisateur - VERSION CORRIGÉE
export const getUserDocumentsFromBackend = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Erreur récupération documents: ${response.statusText}`);
    }

    const result = await response.json();
    return result.documents || [];
  } catch (error) {
    console.error('Erreur récupération documents:', error);
    throw error;
  }
};

// Vérifier un document
export const verifyDocumentWithBackend = async (hederaFileId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify/${hederaFileId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Erreur vérification: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur vérification document:', error);
    throw error;
  }
};