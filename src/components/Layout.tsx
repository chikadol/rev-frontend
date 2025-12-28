import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import '../index.css';

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-secondary)' }}>
      <header style={{
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-md) var(--spacing-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--color-shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}>
        <Link to="/" style={{ 
          color: 'var(--color-text)', 
          textDecoration: 'none', 
          fontSize: '1.5rem', 
          fontWeight: '700',
          letterSpacing: '-0.02em'
        }}>
          RE-V
        </Link>
        
        <nav style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/" style={{ 
                color: 'var(--color-text-secondary)', 
                textDecoration: 'none',
                fontSize: '0.9375rem',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
              >
                게시판
              </Link>
              <Link to="/me" style={{ 
                color: 'var(--color-text-secondary)', 
                textDecoration: 'none',
                fontSize: '0.9375rem',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
              >
                내 정보
              </Link>
              <Link to="/notifications" style={{ 
                color: 'var(--color-text-secondary)', 
                textDecoration: 'none',
                fontSize: '0.9375rem',
                fontWeight: '500',
                position: 'relative',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
              >
                알림
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-12px',
                    background: 'var(--color-error)',
                    borderRadius: 'var(--radius-full)',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.6875rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: 'var(--color-shadow-sm)'
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <button 
                onClick={handleLogout} 
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-text-secondary)';
                  e.currentTarget.style.color = 'var(--color-text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" style={{ 
              color: 'var(--color-primary)', 
              textDecoration: 'none',
              fontSize: '0.9375rem',
              fontWeight: '500'
            }}>
              로그인
            </Link>
          )}
        </nav>
      </header>
      
      <main style={{ 
        flex: 1, 
        padding: 'var(--spacing-xl)', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>
      
      <footer style={{
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--spacing-lg)',
        textAlign: 'center',
        marginTop: 'auto',
        color: 'var(--color-text-tertiary)',
        fontSize: '0.875rem'
      }}>
        <p style={{ margin: 0 }}>© 2024 RE-V. All rights reserved.</p>
      </footer>
    </div>
  );
}
