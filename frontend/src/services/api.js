import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (username, password) =>
    api.post('/api/auth/register', { username, password }),

  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post('/api/auth/login', formData);
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  me: () => api.get('/api/auth/me'),

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export const gamesService = {
  getAll: () => api.get('/api/games/'),
  getOne: (game) => api.get(`/api/games/${game}`),
};

export const serversService = {
  matchmaking: (game) => api.post(`/api/servers/matchmaking/${game}`),
  getGameServers: (game) => api.get(`/api/servers/game/${game}`),
  disconnect: () => api.delete('/api/servers/disconnect'),
  getClusterInfo: () => api.get('/api/servers/cluster/info'),
  getMyConnection: () => api.get('/api/servers/my-connection'),
};

export default api;