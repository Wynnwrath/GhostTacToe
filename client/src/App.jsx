import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Dither from "./animation/Dither";
import MenuPage from "./app/MenuPage";
import GamePage from "./app/GamePage";
import LobbyPage from "./app/LobbyPage";
import AuthPage from "./app/AuthPage";
import { useAuthStore } from "./stores/auth.store";
import { api } from "./lib/api";

const WAVE_COLOR = [0.3, 0.3, 0.3];
const DITHER_CONFIG = {
  disableAnimation: false,
  enableMouseInteraction: true,
  mouseRadius: 0.3,
  colorNum: 4,
  waveAmplitude: 0.3,
  waveFrequency: 3,
  waveSpeed: 0.05,
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function PageTransition({ children }) {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return children;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function MenuScreen() {
  const navigate = useNavigate();

  const handleStart = (difficulty) => {
    navigate("/game", { state: { mode: difficulty === "PvP" ? "pvp-local" : "vs-ai", difficulty } });
  };

  return <MenuPage onStartGame={handleStart} />;
}

function GameScreen() {
  const location = useLocation();

  return <GamePage />;
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token && !useAuthStore.getState().isAuthenticated) {
      api.getMe().then((data) => {
        useAuthStore.getState().setUser(data);
        useAuthStore.getState().setAuth(token, data);
      }).catch(() => {
        useAuthStore.getState().logout();
      });
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <MenuScreen />
            </PageTransition>
          }
        />
        <Route
          path="/game"
          element={
            <PageTransition>
              <GameScreen />
            </PageTransition>
          }
        />
        <Route
          path="/lobby"
          element={
            <PageTransition>
              <LobbyPage />
            </PageTransition>
          }
        />
        <Route
          path="/auth"
          element={
            <PageTransition>
              <AuthPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-gray-900 font-sans overflow-hidden">
        <div className="fixed inset-0 z-0 opacity-40 pointer-events-auto">
          <Dither waveColor={WAVE_COLOR} {...DITHER_CONFIG} />
        </div>

        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
