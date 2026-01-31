import BlurText from '../animation/BlurText'; 

export default function MenuPage({ onStartGame }) {
    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-12 p-4">
            
            <div className="w-full max-w-5xl">
                <BlurText
                    text="GHOST TAC TOE"
                    className="text-5xl md:text-8xl font-black text-center tracking-tighter uppercase italic text-cyan-400 drop-shadow-lg"
                />
            </div>

            <div className="flex flex-col gap-6 items-center animate-fade-in-up" style={{animationDelay: '1s'}}>

                <button
                    onClick={() => onStartGame('PvP')}
                    className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-black text-white text-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all"
                >
                    VS FRIEND (2P)
                </button>

                <div className="h-px w-32 bg-gray-700 my-2"></div>

                <p className="text-gray-400 tracking-widest text-sm uppercase">VS COMPUTER</p>
                <div className="flex flex-wrap justify-center gap-4">
                    {['Easy', 'Normal', 'Hard', 'Impossible'].map((diff) => (
                        <button
                            key={diff}
                            onClick={() => onStartGame(diff)}
                            className={`
                                px-6 py-2 border border-gray-700 rounded-lg font-bold text-sm shadow-lg transition-all
                                ${diff === 'Impossible' 
                                    ? 'bg-red-900/35 text-red-500 border-red-900 hover:bg-red-600 hover:text-white' 
                                    : 'bg-gray-800 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 hover:scale-105'
                                }
                            `}
                        >
                            {diff}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}