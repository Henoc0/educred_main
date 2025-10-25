// src/components/EmailConfirmation.tsx
import React from 'react';

export default function EmailConfirmation() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Email confirmé avec succès !
        </h1>

        <p className="text-gray-600 mb-2">
          Votre adresse email a été vérifiée.
        </p>
        
        <p className="text-gray-600">
          Vous pouvez maintenant fermer cette page et vous connecter à votre compte.
        </p>
      </div>
    </div>
  );
}