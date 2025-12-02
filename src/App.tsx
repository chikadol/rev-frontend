import { useState } from "react";
import "./App.css";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!email || !password) {
            setMessage("이메일과 비밀번호를 모두 입력해줘!");
            return;
        }

        try {
            setIsSubmitting(true);

            // 지금은 테스트용
            console.log("로그인 시도:", { email, password });

            // 가짜 성공 응답
            setTimeout(() => {
                setMessage("🎉 (임시) 로그인 성공 처리! 이제 API 연동만 하면 돼.");
                setIsSubmitting(false);
            }, 500);
        } catch (e) {
            console.error(e);
            setMessage("알 수 없는 오류가 발생했어. 잠시 후 다시 시도해줘.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="app-root">
            <div className="app-card">
                <h1 className="app-title">re:v 커뮤니티</h1>
                <p className="app-subtitle">로그인 화면 테스트</p>

                <form className="app-form" onSubmit={handleSubmit}>
                    <label className="app-label">
                        이메일
                        <input
                            className="app-input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <label className="app-label">
                        비밀번호
                        <input
                            className="app-input"
                            type="password"
                            placeholder="●●●●●●●●"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <button className="app-button" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                {message && <p className="app-message">{message}</p>}

                <p className="app-footer">
                    지금은 <strong>프론트 UI 테스트용</strong>이라 실제 로그인은 안됨
                </p>
            </div>
        </div>
    );
}

export default App;
