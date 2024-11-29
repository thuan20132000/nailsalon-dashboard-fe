import { authenticationAPI } from '@/apis/authenticationAPI';
import { UserType } from '@/types/user';
import { create } from 'zustand';



export type loginType = {
  username: string;
  password: string;
};

export interface AuthenticationState {
  isAuthenticated: boolean;
  user: UserType | null;
  login: (user: loginType) => Promise<any>;
  logout: () => void;
  isAuthenticating?: boolean;
  setIsAuthenticating: (isAuthenticating: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuth: () => boolean;
}


const useAuthenticationStore = create<AuthenticationState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (user: loginType) => {
    const res = await authenticationAPI.login(user);
    localStorage.setItem('token', res.access);
    localStorage.setItem('refresh', res.refresh);
    localStorage.setItem('user', JSON.stringify(res.user));
    set({ isAuthenticated: true, user: res?.user || null });
    return res;
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, user: null });
  },
  checkAuth: (): boolean => {
    const token = localStorage.getItem('token');
    let user = localStorage.getItem('user');
    const isAuth = token ? true : false;

    set({ isAuthenticated: isAuth, user: user ? JSON.parse(user) : null });
    return isAuth;
  },
  isAuthenticating: false,
  setIsAuthenticating: (isAuthenticating) => set({ isAuthenticating }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));

export default useAuthenticationStore;