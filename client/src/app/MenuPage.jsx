import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import BlurText from "../animation/BlurText";

export default function MenuPage({ onStartGame }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-12 p-4">
      <div className="w-full max-w-5xl">
        <BlurText
          text="GHOST TAC TOE"
          className="text-5xl md:text-8xl font-black text-center tracking-tighter uppercase italic text-cyan-400 drop-shadow-lg"
        />
      </div>

      <div className="flex flex-col gap-6 items-center animate-fade-in-up">
        <button
          onClick={() => onStartGame("PvP")}
          className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-black text-white text-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all"
        >
          VS FRIEND (LOCAL)
        </button>

        <button
          onClick={() => navigate("/lobby")}
          className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl font-black text-white text-xl shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:scale-110 hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] transition-all"
        >
          VS FRIEND (ONLINE)
        </button>

        <div className="h-px w-32 bg-gray-700 my-2"></div>

        <p className="text-gray-400 tracking-widest text-sm uppercase">VS COMPUTER</p>
        <div className="flex flex-wrap justify-center gap-4">
          {["Easy", "Normal", "Hard", "Impossible"].map((diff) => (
            <button
              key={diff}
              onClick={() => onStartGame(diff)}
              className={`
                px-6 py-2 border border-gray-700 rounded-lg font-bold text-sm shadow-lg transition-all
                ${
                  diff === "Impossible"
                    ? "bg-red-900/35 text-red-500 border-red-900 hover:bg-red-600 hover:text-white"
                    : "bg-gray-800 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 hover:scale-105"
                }
              `}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="h-px w-32 bg-gray-700 my-2"></div>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              Logged in as <span className="text-cyan-400 font-bold">{user?.username}</span>
            </span>
            <button
              onClick={() => {
                useAuthStore.getState().logout();
                navigate("/");
              }}
              className="px-4 py-1.5 border border-red-900 text-red-400 text-sm rounded-lg hover:bg-red-900/30 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg font-bold text-gray-300 text-sm hover:border-cyan-400 hover:text-cyan-400 transition"
          >
            Login / Register
          </button>
        )}
      </div>
    </div>
  );
}
