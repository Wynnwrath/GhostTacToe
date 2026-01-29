import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dither from './animation/Dither'; 
import MenuPage from './Pages/MenuPage';
import GamePage from './Pages/GamePage';

const WAVE_COLOR = [0.3, 0.3, 0.3]; 
const DITHER_CONFIG = {
    disableAnimation: false,
    enableMouseInteraction: true,
    mouseRadius: 0.3,
    colorNum: 4,
    waveAmplitude: 0.3,
    waveFrequency: 3,
    waveSpeed: 0.05
};

const MenuScreen = () => {
    const navigate = useNavigate();

    const handleStart = (difficulty) => {
        navigate('/game', { state: { difficulty } });
    };

    return <MenuPage onStartGame={handleStart} />;
};

const GameScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const difficulty = location.state?.difficulty || 'Normal';

    return (
        <GamePage 
            difficulty={difficulty} 
            onGoHome={() => navigate('/')} 
        />
    );
};

export default function App() {
    return (
        <BrowserRouter>
            <div className="relative min-h-screen bg-gray-900 font-sans overflow-hidden">
                <div className="fixed inset-0 z-0 opacity-40 pointer-events-auto">
                    <Dither waveColor={WAVE_COLOR} {...DITHER_CONFIG} />
                </div>

                <Routes>
                    <Route path="/" element={<MenuScreen />} />
                    <Route path="/game" element={<GameScreen />} />
                </Routes>

            </div>
        </BrowserRouter>
    );
}