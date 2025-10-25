import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Utilisateur non connecté, rediriger vers auth
        navigate('/auth');
      } else if (!requireAuth && user) {
        // Utilisateur connecté qui essaie d'accéder à auth, rediriger vers dashboard
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate, requireAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si requireAuth=true et pas d'utilisateur, ne pas afficher le contenu (redirection en cours)
  if (requireAuth && !user) {
    return null;
  }

  // Si requireAuth=false et utilisateur connecté, ne pas afficher le contenu (redirection en cours)
  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;