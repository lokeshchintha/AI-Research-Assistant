import { create } from 'zustand';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      set({ isLoading: false });
      
      // Check if OTP is required
      if (data.requiresOTP) {
        toast.success(data.message || 'OTP sent to your email');
        return { success: true, requiresOTP: true, email: data.email };
      }
      
      // Old flow (if OTP not required)
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      
      set({ user: data.data, token: data.data.token });
      toast.success('Welcome back!');
      return { success: true, requiresOTP: false };
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false };
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      
      set({ isLoading: false });
      
      // Check if OTP is required
      if (data.requiresOTP) {
        toast.success(data.message || 'OTP sent to your email');
        return { success: true, requiresOTP: true, email: data.email };
      }
      
      // Old flow (if OTP not required)
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      
      set({ user: data.data, token: data.data.token });
      toast.success('Account created successfully!');
      return { success: true, requiresOTP: false };
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
    toast.success('Logged out successfully');
  },

  setUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData, token: userData.token });
  },

  updateUser: (userData) => {
    const updatedUser = { ...useAuthStore.getState().user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));

export default useAuthStore;
