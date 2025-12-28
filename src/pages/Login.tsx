import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
            setError(err.message || "로그인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
            <h2>로그인</h2>
            
            {error && (
                <div style={{ color: "red", marginBottom: 16, padding: "1rem", background: "#fee", borderRadius: "4px" }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 16 }}>
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, fontSize: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, fontSize: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ width: "100%", padding: 10, fontSize: "1rem", background: loading ? "#95a5a6" : "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer" }}
                >
                    {loading ? "로그인 중..." : "로그인"}
                </button>
            </form>
        </div>
    );
}

