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

// 🔐 Gère les erreurs d’authentification ou de permission
api.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;

if (status === 401) {
  console.warn("🔒 Session expirée");
  triggerGlobalLogout();
  toast.error("Session expirée. Veuillez vous reconnecter.");
}

if (status === 403) {
  console.warn("⛔️ Accès interdit");
  toast.error("Accès refusé. Vous n’avez pas les permissions nécessaires.");
  // Facultatif : redirection manuelle vers une page 403
  window.location.href = "/forbidden"; // à condition d’avoir une telle page dans ton routeur
}


    return Promise.reject(error);
  }
);

export default api;
