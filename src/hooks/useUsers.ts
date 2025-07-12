import { useEffect, useState } from 'react';
import { CustomUserRole, RoleChoice, SimpleUser, User } from '../types/User';
import api from '../api/axios';


// 👤 Données de l’utilisateur connecté
export function useMe() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.get('/users/me/')
      .then(res => setUser(res.data.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
}


// 📄 Tous les utilisateurs (liste complète)
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.get('/users/')
      .then(res => setUsers(res.data.results || []))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}


// 📋 Liste simplifiée pour les selects
export function useSimpleUsers() {
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.get('/users/liste-simple/')
      .then(res => setUsers(res.data.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}


// 🧩 Rôles disponibles (valeur + label)
export function useUserRoles() {
  const [roles, setRoles] = useState<RoleChoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.get('/users/roles/')
      .then(res => {
        const entries = Object.entries(res.data.data);
        const formatted = entries.map(([value, label]) => ({
          value: value as CustomUserRole,
          label: String(label),
        }));
        setRoles(formatted);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { roles, loading, error };
}


// 🔎 Filtres utilisateurs pour <FiltresPanel />
interface RoleOption {
  value: string;
  label: string;
}

export default function useUserFiltres() {
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/roles/')
      .then((res) => {
        const data = res.data?.data || {};
        const roleOptions = Object.entries(data).map(([value, label]) => ({
          value,
          label: String(label),
        }));
        setRoles(roleOptions);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return {
    filtresOptions: {
      role: roles,
      is_active: [
        { value: 'true', label: 'Actif' },
        { value: 'false', label: 'Inactif' },
      ],
    },
    loading,
  };
}
