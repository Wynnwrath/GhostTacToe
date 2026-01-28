export default function Square({ value, onClick, isFading }) {
    return (
        <button 
            className={`w-20 h-20 text-4xl border-2 font-bold flex items-center justify-center
                ${isFading ? 'opacity-40 border-red-400 text-red-400' : 'border-black'}
            `}
            onClick={onClick}
        >
            {value}
        </button>
    );
}