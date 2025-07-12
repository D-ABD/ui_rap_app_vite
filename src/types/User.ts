// types/user.ts

// 🎭 Rôles possibles
export type CustomUserRole =
  | 'superadmin'
  | 'admin'
  | 'stagiaire'
  | 'staff'
  | 'test'
  | 'candidat'
  | 'candidatuser';

// ✅ Interface principale utilisée dans tout le frontend
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  bio?: string;
  avatar?: string | null;
  avatar_url?: string;
  role: CustomUserRole;
  role_display?: string;
  is_active: boolean;
  date_joined?: string;
  full_name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  last_login?: string;
}

// ✏️ Données de formulaire pour création/édition
export interface UserFormData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  avatar?: File | null;
  role: CustomUserRole;
}

// ➕ Création avec mot de passe (admin)
export interface UserCreatePayload extends Record<string, unknown> {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  avatar?: File | null;
  role: CustomUserRole;
  password: string;
}

// ✏️ Mise à jour partielle
export interface UserUpdatePayload extends Partial<Record<string, unknown>> {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  avatar?: File | null;
  role?: CustomUserRole;
  password?: string;
}

// 📄 Liste simplifiée
export interface SimpleUser {
  id: number;
  nom: string;
}

// 🧾 Rôles disponibles pour un <select>
export interface RoleChoice {
  value: CustomUserRole;
  label: string;
}

// 🔐 Inscription
export interface RegistrationPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  user: {
    email: string;
  };
}

export interface UserFiltresValues {
  [key: string]: string | number | undefined;
  role?: string;
  is_active?: string;
  date_joined_min?: string;
  date_joined_max?: string;
}

export interface UserFiltresOptions {
  role: { value: string; label: string }[];
  is_active: { value: 'true' | 'false'; label: string }[];
}