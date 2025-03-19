import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

interface User {
  UserId: string;
  Username: string;
}

interface RegisterData {
  username: string;
  passwordHash: string;
  confirmPassword: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  User: {
    UserId: string;
    Username: string;
  };
}

interface LoginData {
  username: string;
  passwordHash: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  Token: string;
  User: {
    UserId: string;
    Username: string;
  };
}

interface UserStore {
  user: User | null;
  loading: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  register: async (data: RegisterData) => {
    set({ loading: true });

    if (data.passwordHash !== data.confirmPassword) {
      toast.error("Passwords do not match");
      set({ loading: false });
      return;
    }

    try {
      const response = await axios.post<RegisterResponse>(
        "/api/auth/register",
        data
      );
      if (response.data.success) {
        set({ user: response.data.User, loading: false });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
    set({ loading: false });
  },

  login: async (data: LoginData) => {
    set({ loading: true });

    try {
      const response = await axios.post<LoginResponse>("/api/auth/login", data);
      if (response.data.success) {
        set({ user: response.data.User, loading: false });
        localStorage.setItem("token", response.data.Token);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
    set({ loading: false });
  },
}));
