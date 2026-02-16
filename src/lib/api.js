import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const api = {
  // Auth
  auth: {
    googleLogin: (idToken) => apiClient.post('/auth/google', { idToken }),
    playerLogin: (playerId, password) => apiClient.post('/auth/player-login', { playerId, password }),
    getMe: () => apiClient.get('/auth/me'),
    logout: () => apiClient.post('/auth/logout'),
  },

  // Leaderboard
  leaderboard: {
    getTop: (limit = 50) => apiClient.get(`/leaderboard?limit=${limit}`),
    getUserRank: (userId) => apiClient.get(`/leaderboard/${userId}`),
  },

  // Predictions
  predictions: {
    create: (data) => apiClient.post('/predictions', data),
    getByMatch: (matchId) => apiClient.get(`/predictions/${matchId}`),
    getUserPredictions: (userId) => apiClient.get(`/predictions/user/${userId}`),
  },

  // Fantasy
  fantasy: {
    createTeam: (data) => apiClient.post('/fantasy/create-team', data),
    getUserTeams: (userId) => apiClient.get(`/fantasy/${userId}`),
    getLeaderboard: (matchId) => apiClient.get(`/fantasy/leaderboard/${matchId}`),
  },

  // Badges & Tasks
  badges: {
    getUserBadges: (userId) => apiClient.get(`/badges/${userId}`),
  },
  tasks: {
    getActive: () => apiClient.get('/tasks'),
    submit: (data) => apiClient.post('/tasks/submit', data),
  },

  // Player
  player: {
    getDashboard: (playerId) => apiClient.get(`/player/dashboard/${playerId}`),
    getStats: (playerId) => apiClient.get(`/player/stats/${playerId}`),
    getPerformanceAnalysis: (playerId) => apiClient.get(`/player/performance-analysis/${playerId}`),
    getDrills: (playerId) => apiClient.get(`/player/drills/${playerId}`),
    getOppositionDossier: (teamName) => apiClient.get(`/player/opposition-dossier/${teamName}`),
  },

  // Shared
  playingXI: {
    suggest: (data) => apiClient.post('/playing-xi/suggest', data),
  },
  headToHead: {
    player: (player1, player2) => apiClient.get(`/head-to-head/player/${player1}/${player2}`),
    team: (team1, team2) => apiClient.get(`/head-to-head/team/${team1}/${team2}`),
  },
  matches: {
    getAll: () => apiClient.get('/matches'),
    getById: (matchId) => apiClient.get(`/matches/${matchId}`),
  },
};

export default apiClient;
