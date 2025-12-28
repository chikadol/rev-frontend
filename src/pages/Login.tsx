import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../lib/api";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await apiClient.login({ email, password });
            
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            
            console.log("로그인 성공:", data);
            navigate("/");
        } catch (err: any) {
            console.error("로그인 실패:", err);
            let errorMessage = err.message || "로그인에 실패했습니다.";
            
            if (errorMessage.includes("Invalid credentials")) {
                errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
            } else if (errorMessage.includes("Invalid")) {
                errorMessage = "입력 정보가 올바르지 않습니다.";
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
                    로그인
                </h1>
                <p style={{ 
                    margin: '0 0 var(--spacing-xl) 0',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9375rem'
                }}>
                    RE-V에 오신 것을 환영합니다
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

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
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
                            비밀번호
                        </label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--spacing-sm)' }}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div style={{ 
                    marginTop: 'var(--spacing-xl)', 
                    textAlign: 'center',
                    paddingTop: 'var(--spacing-lg)',
                    borderTop: '1px solid var(--color-border)'
                }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                        계정이 없으신가요?{" "}
                    </span>
                    <Link 
                        to="/register" 
                        style={{ 
                            color: 'var(--color-primary)', 
                            textDecoration: 'none', 
                            fontWeight: '500',
                            fontSize: '0.9375rem'
                        }}
                    >
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}
