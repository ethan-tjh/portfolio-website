import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            const res = await login({ username, password });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", username);
            navigate("/projects");
        } catch (e2) {
            console.error(e2);
            setError("Login failed");
        } finally {
            setBusy(false);
        }
    }
    return (
        <main>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div>
                    <label>Username:</label>
                    <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={busy}
                    required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={busy}
                    required
                    />
                </div>
                {error && <p>{error}</p>}
                <button disabled={busy} type="submit">
                    {busy ? "Logging in..." : "Login"}
                </button>
            </form>
        </main>
    );
}