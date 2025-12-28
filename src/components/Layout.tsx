import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
    
    if (token) {
      apiClient.getUnreadNotificationCount()
        .then(res => setUnreadCount(res.unreadCount))
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        background: '#2c3e50',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          RE-V
        </Link>
        
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/boards" style={{ color: 'white', textDecoration: 'none' }}>게시판</Link>
              <Link to="/me" style={{ color: 'white', textDecoration: 'none' }}>내 정보</Link>
              <Link to="/notifications" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
                알림
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'red',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </Link>
              <button onClick={handleLogout} style={{
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                borderRadius: '4px'
              }}>
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>로그인</Link>
          )}
        </nav>
      </header>
      
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {children}
      </main>
      
      <footer style={{
        background: '#34495e',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <p>© 2024 RE-V. All rights reserved.</p>
      </footer>
    </div>
  );
}

