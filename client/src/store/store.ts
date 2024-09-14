import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

type Store = {
  user?: {
    name: string;
    email: string;
    createdAt: string;
    lastLogin: string;
  } | null;
  isAuthenticated: boolean;
  error: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  isCheckingVerification: boolean;
  message: string | null;
  signUpFunction: ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;

  verifyEmail: (token: number) => Promise<void>;
  isSignIn: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const API_URL = "http://localhost:8080/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create<Store>((set) => ({
  user: null,
  isAuthenticated: false,
  error: false,
  isLoading: false,
  isCheckingAuth: false,
  isCheckingVerification: false,
  message: null,

  signUpFunction: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/sign-up`, data);
      set({ message: res.data.suggestion, isCheckingVerification: true });

      toast.success(res.data.suggestion);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        set({
          error: true,
          message: error.response.data.message,
        });
        toast.error(error.response.data.message);
      } else {
        set({
          error: true,
          message: "An unexpected error occurred.",
        });
      }

      throw error;
    } finally {
      set({ isLoading: false });

      setTimeout(() => {
        set({ error: false, message: null });
      }, 3000);
    }
  },

  verifyEmail: async (token) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/verify-email`, { code: token });
      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingVerification: false,
      });
      toast.success("Verification completed");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        set({
          error: true,
          message: error.response.data.message,
        });

        toast.error(error.response.data.message);
      } else {
        set({
          error: true,
          message: "An unexpected error occurred.",
        });
      }
      throw error;
    } finally {
      set({ isLoading: false });

      setTimeout(() => {
        set({ error: false, message: null });
      }, 3000);
    }
  },

  isSignIn: async () => {
    set({ isLoading: true, error: false, isCheckingAuth: true });
    try {
      const res = await axios.get(`${API_URL}/check-me`);
      set({ user: res.data.user, isAuthenticated: true });

      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false, isCheckingAuth: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/sign-in`, {
        email,
        password,
      });
      set({
        user: res.data.user,
        isAuthenticated: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        set({
          error: true,
          message: error.response.data.message,
        });

        toast.error(error.response.data.message);
      } else {
        set({
          error: true,
          message: "An unexpected error occurred.",
        });
      }
      throw error;
    } finally {
      set({ isLoading: false });

      setTimeout(() => {
        set({ error: false, message: null });
      }, 3000);
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.get(`${API_URL}/sign-out`);
      set({
        user: null,
        isAuthenticated: false,
        error: false,
        isCheckingAuth: false,
        isCheckingVerification: false,
        message: null,
      });

      toast.success("Logout done...");
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
