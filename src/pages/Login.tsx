import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
    const navigate = useNavigate();
    const { login, loading: authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/");
        } catch (err: any) {
            console.error("로그인 실패:", err);
            setError(err.message || "로그인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const socialButtons = [
        {
            name: '구글',
            href: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/google`,
            color: '#4285F4',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
            )
        },
        {
            name: '네이버',
            href: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/naver`,
            color: '#03C75A',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                </svg>
            )
        },
        {
            name: '카카오',
            href: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/kakao`,
            color: '#FEE500',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                    <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
                </svg>
            )
        }
    ];

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 'calc(100vh - 200px)',
            padding: 'var(--spacing-xl)'
        }}>
            <div className="card" style={{ 
                maxWidth: '440px', 
                width: '100%',
                padding: 'var(--spacing-3xl)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)'
                }} />

                <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    <h1 style={{ 
                        margin: '0 0 var(--spacing-sm) 0',
                        fontSize: '2rem',
                        fontWeight: '800',
                        letterSpacing: '-0.03em',
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        로그인
                    </h1>
                    <p style={{ 
                        margin: 0,
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.9375rem',
                        lineHeight: 1.6
                    }}>
                        RE-V에 오신 것을 환영합니다
                    </p>
                </div>

                {/* 소셜 로그인 버튼 */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'var(--spacing-sm)' 
                    }}>
                        {socialButtons.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    padding: 'var(--spacing-md)',
                                    background: social.name === '카카오' ? social.color : social.name === '네이버' ? social.color : 'white',
                                    border: social.name === '구글' ? '1.5px solid var(--color-border)' : 'none',
                                    borderRadius: 'var(--radius-md)',
                                    textDecoration: 'none',
                                    color: social.name === '카카오' ? '#000000' : social.name === '구글' ? '#1a1a1a' : 'white',
                                    fontWeight: '600',
                                    fontSize: '0.8125rem',
                                    transition: 'all var(--transition-base)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    if (social.name === '구글') {
                                        e.currentTarget.style.borderColor = social.color;
                                        e.currentTarget.style.background = '#f8f9fa';
                                        e.currentTarget.style.color = '#1a1a1a';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                    if (social.name === '구글') {
                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.color = '#1a1a1a';
                                    }
                                }}
                            >
                                {social.icon}
                                <span>{social.name}</span>
                            </a>
                        ))}
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--spacing-md)',
                        margin: 'var(--spacing-xl) 0'
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                        <span style={{ 
                            color: 'var(--color-text-tertiary)', 
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}>
                            또는
                        </span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                    </div>
                </div>
                
                {error && (
                    <ErrorMessage 
                        error={error} 
                        onDismiss={() => setError("")}
                    />
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: 'var(--spacing-sm)', 
                            fontWeight: '600',
                            fontSize: '0.9375rem',
                            color: 'var(--color-text)'
                        }}>
                            이메일
                        </label>
                        <input
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: 'var(--spacing-sm)', 
                            fontWeight: '600',
                            fontSize: '0.9375rem',
                            color: 'var(--color-text)'
                        }}>
                            비밀번호
                        </label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || authLoading}
                        className="btn btn-primary"
                        style={{ 
                            width: '100%', 
                            marginTop: 'var(--spacing-sm)',
                            padding: '0.875rem',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}
                    >
                        {loading || authLoading ? (
                            <>
                                <LoadingSpinner size="small" />
                                <span>로그인 중...</span>
                            </>
                        ) : "로그인"}
                    </button>
                </form>

                <div style={{ 
                    marginTop: 'var(--spacing-xl)', 
                    textAlign: 'center',
                    paddingTop: 'var(--spacing-xl)',
                    borderTop: '1px solid var(--color-border-light)'
                }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                        계정이 없으신가요?{" "}
                    </span>
                    <Link 
                        to="/register" 
                        style={{ 
                            color: 'var(--color-primary)', 
                            textDecoration: 'none', 
                            fontWeight: '600',
                            fontSize: '0.9375rem',
                            transition: 'all var(--transition-base)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--color-primary-dark)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                    >
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}
