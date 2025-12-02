import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("test@test.com");
    const [password, setPassword] = useState("1234");
    const [token, setToken] = useState("");

    async function handleLogin() {
        const res = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        console.log("response:", data);

        setToken(data.accessToken || "로그인 실패");
        localStorage.setItem("accessToken", data.accessToken);
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>로그인 테스트</h1>

            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
            />
            <br />

            <input
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
            />
            <br />

            <button onClick={handleLogin}>로그인</button>

            {token && (
                <pre style={{ marginTop: "20px" }}>
          Access Token:
          <br />
                    {token}
        </pre>
            )}
        </div>
    );
}
