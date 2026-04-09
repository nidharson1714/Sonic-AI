// @ts-nocheck
import { create } from 'zustand';
import { User, GenerationJob } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));

interface JobState {
  activeJob: GenerationJob | null;
  setActiveJob: (job: GenerationJob | null) => void;
}

export const useJobStore = create<JobState>((set) => ({
  activeJob: null,
  setActiveJob: (job) => set({ activeJob: job }),
}));
