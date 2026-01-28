export default function Square({ value, onClick, isFading }) {
    return (
        <button 
            className={`
                w-24 h-24 text-5xl font-bold flex items-center justify-center rounded bg-white
                transition-all duration-300
                ${isFading ? 'opacity-40 text-red-500 ring-4 ring-red-200' : 'text-black'}
                ${!value ? 'hover:bg-gray-100' : ''}
            `}
            onClick={onClick}
        >
            {value}
        </button>
    );
}