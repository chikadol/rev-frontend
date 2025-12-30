import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../lib/api";

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"USER" | "IDOL">("USER");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !username || !password || !confirmPassword) {
            setError("모든 필드를 입력해주세요.");
            return;
        }

        if (password.length < 8) {
            setError("비밀번호는 최소 8자 이상이어야 합니다.");
            return;
        }

        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        setLoading(true);

        try {
            const data = await apiClient.register({ 
                email: email.trim(), 
                username: username.trim(),
                password,
                role
            });
            
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            
            console.log("회원가입 성공:", data);
            navigate("/");
        } catch (err: any) {
            console.error("회원가입 실패:", err);
            let errorMessage = err.message || "회원가입에 실패했습니다.";
            
            if (errorMessage.includes("이미 등록된 이메일")) {
                errorMessage = "이미 등록된 이메일입니다.";
            } else if (errorMessage.includes("이미 사용 중인 사용자명")) {
                errorMessage = "이미 사용 중인 사용자명입니다.";
            } else if (errorMessage.includes("email")) {
                errorMessage = "올바른 이메일 형식을 입력해주세요.";
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 'calc(100vh - 200px)',
            padding: 'var(--spacing-xl)'
        }}>
            <div className="card" style={{ 
                maxWidth: '420px', 
                width: '100%',
                padding: 'var(--spacing-2xl)'
            }}>
                <h1 style={{ 
                    margin: '0 0 var(--spacing-sm) 0',
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    letterSpacing: '-0.02em'
                }}>
                    회원가입
                </h1>
                <p style={{ 
                    margin: '0 0 var(--spacing-xl) 0',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9375rem'
                }}>
                    RE-V 커뮤니티에 가입하세요
                </p>
                
                {error && (
                    <div style={{ 
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: 'var(--color-error)',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--radius)',
                        marginBottom: 'var(--spacing-lg)',
                        fontSize: '0.9375rem'
                    }}>
                        {error}
                    </div>
                )}

                {/* 소셜 로그인 버튼 */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 'var(--spacing-sm)' 
                    }}>
                        <a
                            href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/google`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--spacing-sm)',
                                padding: 'var(--spacing-md)',
                                background: 'white',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius)',
                                textDecoration: 'none',
                                color: 'var(--color-text)',
                                fontWeight: '500',
                                fontSize: '0.9375rem',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#4285F4';
                                e.currentTarget.style.background = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.background = 'white';
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            구글로 시작하기
                        </a>
                        <a
                            href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/naver`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--spacing-sm)',
                                padding: 'var(--spacing-md)',
                                background: '#03C75A',
                                border: 'none',
                                borderRadius: 'var(--radius)',
                                textDecoration: 'none',
                                color: 'white',
                                fontWeight: '500',
                                fontSize: '0.9375rem',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#02B350';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#03C75A';
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                            </svg>
                            네이버로 시작하기
                        </a>
                        <a
                            href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/kakao`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--spacing-sm)',
                                padding: 'var(--spacing-md)',
                                background: '#FEE500',
                                border: 'none',
                                borderRadius: 'var(--radius)',
                                textDecoration: 'none',
                                color: '#000000',
                                fontWeight: '500',
                                fontSize: '0.9375rem',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#FDD835';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#FEE500';
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
                            </svg>
                            카카오로 시작하기
                        </a>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--spacing-md)',
                        margin: 'var(--spacing-lg) 0'
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                        <span style={{ 
                            color: 'var(--color-text-secondary)', 
                            fontSize: '0.875rem' 
                        }}>
                            또는
                        </span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                    </div>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: 'var(--spacing-sm)', 
                            fontWeight: '500',
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
                        />
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: 'var(--spacing-sm)', 
                            fontWeight: '500',
                            fontSize: '0.9375rem',
                            color: 'var(--color-text)'
                        }}>
                            사용자명
                        </label>
                        <input
                            type="text"
                            placeholder="사용자명을 입력하세요"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={2}
                            maxLength={50}
                            className="input"
                        />
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: 'var(--spacing-sm)', 
                            fontWeight: '500',
                            fontSize: '0.9375rem',
                            color: 'var(--color-text)'
                        }}>
                            비밀번호
                        </label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요 (최소 8자)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="input"
                        />
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: 'var(--spacing-sm)', 
                            fontWeight: '500',
                            fontSize: '0.9375rem',
                            color: 'var(--color-text)'
                        }}>
                            비밀번호 확인
                        </label>
                        <input
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="input"
                        />
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: 'var(--spacing-sm)', 
                            fontWeight: '500',
                            fontSize: '0.9375rem',
                            color: 'var(--color-text)'
                        }}>
                            가입 유형
                        </label>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="USER"
                                    checked={role === "USER"}
                                    onChange={() => setRole("USER")}
                                />
                                <span>일반 유저</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="IDOL"
                                    checked={role === "IDOL"}
                                    onChange={() => setRole("IDOL")}
                                />
                                <span>지하아이돌</span>
                            </label>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--spacing-sm)' }}
                    >
                        {loading ? "가입 중..." : "회원가입"}
                    </button>
                </form>

                <div style={{ 
                    marginTop: 'var(--spacing-xl)', 
                    textAlign: 'center',
                    paddingTop: 'var(--spacing-lg)',
                    borderTop: '1px solid var(--color-border)'
                }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                        이미 계정이 있으신가요?{" "}
                    </span>
                    <Link 
                        to="/login" 
                        style={{ 
                            color: 'var(--color-primary)', 
                            textDecoration: 'none', 
                            fontWeight: '500',
                            fontSize: '0.9375rem'
                        }}
                    >
                        로그인
                    </Link>
                </div>
            </div>
        </div>
    );
}
