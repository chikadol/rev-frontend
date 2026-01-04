import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../lib/api';

interface User {
  userId: string; // UUID를 문자열로 받음
  username: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드 시 사용자 정보 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // API 응답 형식이 변경되었으므로 data 필드에서 추출
      const response = await apiClient.getMe();
      console.log('getMe 응답:', response);
      
      // 응답이 ApiResponse 형식인지 확인
      let userData;
      if (response && typeof response === 'object' && 'data' in response) {
        userData = (response as any).data;
      } else if (response && typeof response === 'object' && 'userId' in response) {
        // 직접 데이터인 경우
        userData = response;
      } else {
        throw new Error('사용자 정보 형식이 올바르지 않습니다.');
      }
      
      console.log('파싱된 사용자 데이터:', userData);
      
      if (!userData || !userData.userId) {
        throw new Error('사용자 정보가 없습니다.');
      }
      
      setUser({
        userId: String(userData.userId || ''),
        username: userData.username || '',
        roles: Array.isArray(userData.roles) ? userData.roles : []
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      const tokenData = (response as any).data || response;
      
      localStorage.setItem('accessToken', tokenData.accessToken);
      localStorage.setItem('refreshToken', tokenData.refreshToken);
      
      await refreshUser();
    } catch (error: any) {
      throw new Error(error.message || '로그인에 실패했습니다.');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    // 로그아웃 시 로그인 페이지로 리다이렉트
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

