// src/components/RequireAuth.tsx

import type { JSX } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Chargement...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
