import axios from 'axios';

// --- INITIALIZATION ---
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api' });

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
export const verifyOtp = (data) => API.post('/auth/verify-otp', data);

// --- BOT CONFIGURATION & CREDITS ---
export const getConfig = () => API.get('/bot/config');
export const saveConfig = (configData) => API.post('/bot/save', configData);

// --- INTEGRATION SETTINGS ---
export const verifyIntegration = (platform, id, token) => API.post('/bot/settings/verify', { platform, id, token }); 
export const updateIntegration = (settings) => API.post('/bot/settings/update', settings);

// --- CHAT & NEURAL INTERFACE (For Dashboard Testing) ---
// Accepts message + current UI prompt so users can test before saving
export const sendDebugMessage = (message, activePrompt) => 
  API.post('/bot/chat/debug', { message, activePrompt });

// --- PUBLIC CHAT ROUTES (Used in PublicChat.jsx) ---
export const getPublicBotInfo = (botId) => 
  API.get(`/chat/public-info/${botId}`);

export const sendPublicMessage = (botId, message, customerIdentifier, customerData) => 
  API.post(`/chat/public-message/${botId}`, { 
      message, 
      customerIdentifier, // e.g., "John Doe (john@example.com)"
      customerData        // e.g., { name: "John Doe", email: "john@example.com" }
  });

// --- GENERAL CHAT HISTORY ---
export const sendMessage = (message) => API.post('/chat/message', { message });
export const getHistory = () => API.get('/chat/history');

// --- BILLING & PAYMENTS ---
export const createCheckoutSession = (planId) => API.post('/billing/create-checkout', { planId });
export const verifyPayment = (sessionId) => API.post('/billing/verify-payment', { sessionId });

// --- LEADS MANAGEMENT ---
export const getLeads = () => API.get('/leads');
export const updateLeadStatus = (id, status) => API.patch(`/leads/${id}`, { status });
export const deleteLead = (id) => API.delete(`/leads/${id}`);

// --- ADMIN MANAGEMENT ---
export const getAllUsers = () => API.get('/auth/admin/users');
export const decommissionNode = (userId) => API.delete(`/auth/admin/user/${userId}`);

export default API;