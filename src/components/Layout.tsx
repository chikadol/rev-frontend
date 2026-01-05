import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo, memo } from 'react';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import '../index.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = memo(function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const userIsAdmin = user?.roles?.some((role: string) => 
    role === 'ADMIN' || role === 'ROLE_ADMIN' || role.includes('ADMIN')
  ) || false;

  // 디버깅용
  useEffect(() => {
    console.log('Layout - isAuthenticated:', isAuthenticated);
    console.log('Layout - user:', user);
    console.log('Layout - userIsAdmin:', userIsAdmin);
    console.log('Layout - authLoading:', authLoading);
  }, [isAuthenticated, user, userIsAdmin, authLoading]);

  useEffect(() => {
    if (isAuthenticated) {
      apiClient.getUnreadNotificationCount()
        .then(res => {
          const count = (res as any).data?.unreadCount || res.unreadCount || 0;
          setUnreadCount(count);
        })
        .catch((err) => {
          console.warn('알림 카운트 로드 실패 (무시됨):', err);
          setUnreadCount(0);
        });
    } else {
      setUnreadCount(0);
    }
  }, [location.pathname, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = useMemo(() => {
    const allLinks = [
      { to: '/performances', label: '공연', icon: '🎫' },
      { to: '/boards', label: '게시판', icon: '💬', requireAuth: true },
      { to: '/idols', label: '아이돌', icon: '🌟' },
      { to: '/my-tickets', label: '내 티켓', icon: '🎟️', requireAuth: true },
      { to: '/notifications', label: '알림', icon: '🔔', requireAuth: true, badge: unreadCount },
      { to: '/me', label: '내정보', icon: '👤', requireAuth: true },
      { to: '/admin/users', label: '사용자 관리', icon: '👥', requireAuth: true, requireAdmin: true },
    ];
    
    return allLinks.filter(link => {
      if (link.requireAuth && !isAuthenticated) return false;
      if ((link as any).requireAdmin && !userIsAdmin) return false;
      return true;
    });
  }, [isAuthenticated, userIsAdmin, unreadCount]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #fafbfc 0%, #f4f6f8 50%, #eef1f4 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <header style={{
        background: scrolled 
          ? 'rgba(255, 255, 255, 0.95)' 
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: scrolled 
          ? '1px solid var(--color-border)' 
          : '1px solid transparent',
        padding: 'var(--spacing-md) var(--spacing-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all var(--transition-base)'
      }}>
        <Link 
          to="/" 
          style={{ 
            color: 'var(--color-text)', 
            textDecoration: 'none', 
            fontSize: '1.75rem', 
            fontWeight: '800',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'all var(--transition-base)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          RE-V
        </Link>
        
        <nav style={{ 
          display: 'flex', 
          gap: 'var(--spacing-md)', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{ 
                color: location.pathname === link.to 
                  ? 'var(--color-primary)' 
                  : 'var(--color-text-secondary)', 
                textDecoration: 'none',
                fontSize: '0.9375rem',
                fontWeight: location.pathname === link.to ? '600' : '500',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-base)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: location.pathname === link.to 
                  ? 'rgba(139, 92, 246, 0.1)' 
                  : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== link.to) {
                  e.currentTarget.style.color = 'var(--color-text)';
                  e.currentTarget.style.background = 'var(--color-bg-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== link.to) {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
              <span>{link.label}</span>
              {link.badge && link.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%)',
                  borderRadius: 'var(--radius-full)',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.6875rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: 'var(--shadow-sm)',
                  border: '2px solid white'
                }}>
                  {link.badge > 9 ? '9+' : link.badge}
                </span>
              )}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                fontWeight: '500',
                transition: 'all var(--transition-base)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-error-light)';
                e.currentTarget.style.color = 'var(--color-error)';
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.background = 'var(--color-bg-secondary)';
              }}
            >
              로그아웃
            </button>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-primary"
              style={{ 
                textDecoration: 'none',
                fontSize: '0.9375rem',
                padding: '0.5rem 1.25rem'
              }}
            >
              로그인
            </Link>
          )}
        </nav>
      </header>
      
      <main style={{ 
        flex: 1, 
        padding: 'var(--spacing-xl)', 
        maxWidth: '1400px', 
        margin: '0 auto', 
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>
      
      <footer style={{
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--color-border-light)',
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        marginTop: 'auto',
        color: 'var(--color-text-tertiary)',
        fontSize: '0.875rem',
        fontWeight: '400'
      }}>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          © 2024 RE-V. 지하아이돌 공연과 커뮤니티를 한 곳에서.
        </p>
      </footer>
    </div>
  );
});

export default Layout;
