export interface CustomUser {
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
}

export type CustomUserRole = 'superadmin' | 'admin' | 'stagiaire' | 'staff' | 'test' | 'candidat';

export interface SimpleUser {
  id: number;
  nom: string;
}

export interface RoleChoice {
  value: CustomUserRole;
  label: string;
}
