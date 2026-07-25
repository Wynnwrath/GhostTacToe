import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { api } from "../lib/api";
import { Input } from "../components/ui/Input";
import BlurText from "../animation/BlurText";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (tab === "login") {
        data = await api.login({ email, password });
      } else {
        data = await api.register({ username, email, password });
      }
      setAuth(data.token, data.user);
      navigate(from);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <div className="w-full max-w-md">
        <BlurText
          text="GHOST TAC TOE"
          className="text-3xl md:text-5xl font-black text-center tracking-tighter uppercase italic text-cyan-400 drop-shadow-lg"
        />
      </div>

      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="flex gap-2 bg-gray-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2 rounded-md font-bold text-sm transition ${
              tab === "login" ? "bg-cyan-400 text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 py-2 rounded-md font-bold text-sm transition ${
              tab === "register" ? "bg-pink-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === "register" && (
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-black text-white text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Loading..." : tab === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>

      <button
        onClick={() => navigate("/")}
        className="text-gray-500 hover:text-white text-sm transition"
      >
        &larr; Back to Menu
      </button>
    </div>
  );
}
