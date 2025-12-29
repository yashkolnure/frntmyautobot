import axios from 'axios';

// --- INITIALIZATION ---
const API = axios.create({ baseURL: '/api' });

// --- REQUEST INTERCEPTOR (JWT Injection) ---
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- AUTHENTICATION ROUTES ---
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const requestPasswordReset = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.post(`/auth/reset-password/${token}`, { password });

// --- BOT CONFIGURATION & CREDITS ---
export const getConfig = () => API.get('/bot/config');
export const saveConfig = (configData) => API.post('/bot/configure', configData);

// --- INTEGRATION SETTINGS ---
export const verifyIntegration = (platform, id, token) => API.post('/bot/settings/verify', { platform, id, token }); 
export const updateIntegration = (settings) => API.post('/bot/settings/update', settings);

// --- CHAT & NEURAL INTERFACE ---
// Deducts 5 tokens (used in Dashboard/TrainingView)
export const sendDebugMessage = (message) => API.post('/bot/chat/debug', { message });

// General/Public Chat routes
export const sendMessage = (message) => API.post('/chat/message', { message });
export const getHistory = () => API.get('/chat/history');
export const getPublicBotInfo = (botId) => API.get(`/chat/public-info/${botId}`);
export const sendPublicMessage = (botId, message, customerIdentifier, customerData) => 
    API.post(`/chat/public-message/${botId}`, { 
        message, 
        customerIdentifier, // Combined Name + Email
        customerData        // Object { name, email }
    });

// --- LEADS MANAGEMENT ---
export const getLeads = () => API.get('/leads');
export const updateLeadStatus = (id, status) => API.patch(`/leads/${id}`, { status });
export const deleteLead = (id) => API.delete(`/leads/${id}`);

export default API;