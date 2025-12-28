import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../lib/api";

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
                password 
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
