
import React from 'react';

interface MainMenuProps {
  onStart: () => void;
  onShowGDD: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onShowGDD }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-6xl md:text-8xl font-cinzel font-bold text-amber-500 drop-shadow-lg mb-4 animate-pulse">
        ANCIENT ESCAPE
      </h1>
      <p className="text-amber-200/70 max-w-md mb-12 text-lg italic">
        "The relic is yours, but the temple's guardian does not sleep. Run, explorer, or be reclaimed by the stone."
      </p>

      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={onStart}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-cinzel text-2xl py-4 rounded-md shadow-[0_0_20px_rgba(217,119,6,0.5)] transition-all transform hover:scale-105 active:scale-95"
        >
          ENTER THE TEMPLE
        </button>
        <button
          onClick={onShowGDD}
          className="w-full bg-stone-800 hover:bg-stone-700 text-amber-300 font-cinzel text-lg py-3 rounded-md border border-amber-900/50 transition-all"
        >
          GAME DESIGN DOC
        </button>
      </div>

      <div className="mt-16 text-amber-100/40 text-sm">
        <p>Use [Arrow Keys] or [Space] to move, jump, and slide</p>
      </div>
    </div>
  );
};

export default MainMenu;
