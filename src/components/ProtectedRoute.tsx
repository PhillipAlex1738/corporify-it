
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAdmin = false 
}) => {
  const { user, isLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    toast({
      title: "Access denied",
      description: "Please login to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }
  
  if (requiresAdmin && !isAdmin) {
    toast({
      title: "Permission denied",
      description: "You don't have permission to access this area.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
