import axios from 'axios';

// Base URL configuration - React Vite proxy will handle '/api'
const API_URL = '/api/auth/';

// Register user
const register = async (userData: any) => {
  const response = await axios.post(API_URL + 'register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData: any) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout
const logout = () => {
  localStorage.removeItem('user');
};

// Error handler
const handleAuthError = (error: any) => {
  if (error.response && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || 'Something went wrong';
};

const authService = {
  register,
  login,
  logout,
  handleAuthError
};

export default authService;
