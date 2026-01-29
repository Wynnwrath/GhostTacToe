import { useState } from 'react';
import Dither from './Dither'; 
import MenuPage from '../Pages/MenuPage';
import GamePage from '../Pages/GamePage';

// Move Dither config outside
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

export default function GameContainer() {
    const [gameState, setGameState] = useState('menu'); // 'menu' | 'playing'
    const [difficulty, setDifficulty] = useState('Normal'); 

    const startGame = (diff) => {
        setDifficulty(diff);
        setGameState('playing');
    };

    const goHome = () => {
        setGameState('menu');
    };

    return (
        <div className="relative min-h-screen bg-gray-900 font-sans overflow-hidden">            
            
            {/* GLOBAL BACKGROUND */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-auto">
                <Dither waveColor={WAVE_COLOR} {...DITHER_CONFIG} />
            </div>

            {/* PAGE ROUTER */}
            {gameState === 'menu' ? (
                <MenuPage onStartGame={startGame} />
            ) : (
                <GamePage difficulty={difficulty} onGoHome={goHome} />
            )}

        </div>
    );
}