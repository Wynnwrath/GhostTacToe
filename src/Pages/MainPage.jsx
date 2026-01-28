import { useState } from 'react';
import Grid from '../components/Grid.jsx';
import GameContainer from '../components/GameContainer.jsx';
export default function MainPage() {
    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <GameContainer />
        </div>
    )
}