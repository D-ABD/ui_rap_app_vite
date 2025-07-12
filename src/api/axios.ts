// src/api/axios.ts

import axios from 'axios';
import qs from 'qs';
import { triggerGlobalLogout } from './globalLogout';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  const publicEndpoints = ['/users/register/', '/login/', '/token/'];
  const url = config.url ?? '';

  const isPublic = publicEndpoints.some(endpoint => url.endsWith(endpoint));

  if (token && !isPublic) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ⛔️ Intercepteur réponse : déconnexion automatique si erreur d’auth
api.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      console.warn("🔒 Session expirée ou invalide");
      triggerGlobalLogout();
      toast.error("Session expirée. Veuillez vous reconnecter.");
    }

    return Promise.reject(error);
  }
);

export default api;
