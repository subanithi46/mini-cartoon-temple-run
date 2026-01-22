
import React from 'react';

interface GameOverScreenProps {
  score: number;
  coins: number;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, coins, onRestart, onMenu }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center p-6 z-50">
      <div className="bg-stone-900 border-2 border-red-900 p-8 rounded-lg max-w-sm w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.3)]">
        <h2 className="text-5xl font-cinzel text-red-600 mb-2">CAUGHT!</h2>
        <p className="text-stone-400 mb-8 font-cinzel">The Guardian has claimed another soul.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-stone-800 p-4 rounded border border-amber-900/30">
            <div className="text-stone-400 text-xs uppercase font-bold">Distance</div>
            <div className="text-2xl text-white font-cinzel">{score}m</div>
          </div>
          <div className="bg-stone-800 p-4 rounded border border-amber-900/30">
            <div className="text-stone-400 text-xs uppercase font-bold">Relics</div>
            <div className="text-2xl text-amber-500 font-cinzel">{coins}</div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-cinzel py-3 rounded shadow-lg transition-colors"
          >
            TRY AGAIN
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-stone-700 hover:bg-stone-600 text-stone-200 font-cinzel py-3 rounded transition-colors"
          >
            BACK TO CAMP
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
