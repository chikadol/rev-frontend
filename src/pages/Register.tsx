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

        // 입력 검증
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
            
            // 영어 에러 메시지를 한국어로 변환
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
        <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
            <h2>회원가입</h2>
            
            {error && (
                <div style={{ 
                    color: "red", 
                    marginBottom: 16, 
                    padding: "1rem", 
                    background: "#fee", 
                    borderRadius: "4px" 
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                        이메일
                    </label>
                    <input
                        type="email"
                        placeholder="이메일을 입력하세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ 
                            width: "100%", 
                            padding: "0.75rem", 
                            fontSize: "1rem", 
                            border: "1px solid #ddd", 
                            borderRadius: "4px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
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
                        style={{ 
                            width: "100%", 
                            padding: "0.75rem", 
                            fontSize: "1rem", 
                            border: "1px solid #ddd", 
                            borderRadius: "4px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                        비밀번호
                    </label>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력하세요 (최소 8자)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        style={{ 
                            width: "100%", 
                            padding: "0.75rem", 
                            fontSize: "1rem", 
                            border: "1px solid #ddd", 
                            borderRadius: "4px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                        비밀번호 확인
                    </label>
                    <input
                        type="password"
                        placeholder="비밀번호를 다시 입력하세요"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ 
                            width: "100%", 
                            padding: "0.75rem", 
                            fontSize: "1rem", 
                            border: "1px solid #ddd", 
                            borderRadius: "4px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: "100%", 
                        padding: "0.75rem", 
                        fontSize: "1rem", 
                        background: loading ? "#95a5a6" : "#3498db", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "4px", 
                        cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: "500"
                    }}
                >
                    {loading ? "가입 중..." : "회원가입"}
                </button>
            </form>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <span style={{ color: "#7f8c8d" }}>이미 계정이 있으신가요? </span>
                <Link 
                    to="/login" 
                    style={{ color: "#3498db", textDecoration: "none", fontWeight: "500" }}
                >
                    로그인
                </Link>
            </div>
        </div>
    );
}

