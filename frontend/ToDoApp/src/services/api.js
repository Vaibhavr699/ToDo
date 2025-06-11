// frontend/src/services/api.js
import axios from 'axios';

const API_URL = 'https://todo-backend-p970.onrender.com/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return Promise.reject({ message: 'Request setup failed' });
    }
  }
);

// Task API endpoints
export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data.data;
};

export const getTasksByStatus = async (status) => {
  const response = await api.get(`/tasks/status/${status}`);
  return response.data.data;
};

export const getTasksByPriority = async (priority) => {
  const response = await api.get(`/tasks/priority/${priority}`);
  return response.data.data;
};

export const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

// Auth API endpoints
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  console.log('Login API response:', response);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData);
  return {
    data: response.data.data,
    token: response.data.token
  };
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axios.post('/auth/reset-password', {
    token,
    newPassword
  });
  return response.data;
};

// Search API endpoint
export const searchTasks = async (query) => {
  const response = await api.get(`/tasks/search?q=${encodeURIComponent(query)}`);
  return response.data.data;
};

export default api;