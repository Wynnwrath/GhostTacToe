import BlurText from '../animation/BlurText'; 

export default function MenuPage({ onStartGame }) {
    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-12 p-4">
            
            { /* Title */}
            <div className="w-full max-w-5xl">
                <BlurText
                    text="GHOST TAC TOE"
                    className="text-5xl md:text-8xl font-black text-center tracking-tighter uppercase italic text-cyan-400 drop-shadow-lg"
                />
            </div>

            <div className="flex flex-col gap-4 items-center animate-fade-in-up">
                <p className="text-gray-400 tracking-widest text-sm uppercase">Select Difficulty</p>
                <div className="flex flex-wrap justify-center gap-6">
                    {['Easy', 'Normal', 'Hard', 'Impossible'].map((diff) => (
                        <button
                            key={diff}
                            onClick={() => onStartGame(diff)}
                            className="px-8 py-3 bg-gray-800 border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 hover:scale-110 transition-all rounded-xl font-bold text-white text-lg shadow-lg"
                        >
                            {diff}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}