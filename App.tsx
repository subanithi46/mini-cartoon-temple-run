
import React, { useState, useEffect } from 'react';
import { GameState } from './types';
import GameCanvas from './components/GameCanvas';
import MainMenu from './components/MainMenu';
import GameOverScreen from './components/GameOverScreen';
import GDDView from './components/GDDView';
import { generateGDD } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [finalScore, setFinalScore] = useState(0);
  const [finalCoins, setFinalCoins] = useState(0);
  const [gddData, setGddData] = useState<any>(null);

  const startGame = () => {
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = (score: number, coins: number) => {
    setFinalScore(score);
    setFinalCoins(coins);
    setGameState(GameState.GAME_OVER);
  };

  const showGDD = async () => {
    setGameState(GameState.GDD);
    if (!gddData) {
      const data = await generateGDD();
      setGddData(data);
    }
  };

  const returnToMenu = () => {
    setGameState(GameState.MENU);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {gameState === GameState.MENU && (
          <MainMenu onStart={startGame} onShowGDD={showGDD} />
        )}

        {gameState === GameState.PLAYING && (
          <div className="w-full flex justify-center py-10 px-4">
             <GameCanvas onGameOver={handleGameOver} isPaused={false} />
             {/* Game Controls Tip */}
             <div className="fixed bottom-6 text-amber-500/50 text-xs font-cinzel tracking-widest uppercase hidden md:block">
               Use Left/Right to dodge, Up to jump, Down to slide
             </div>
          </div>
        )}

        {gameState === GameState.GAME_OVER && (
          <GameOverScreen 
            score={finalScore} 
            coins={finalCoins} 
            onRestart={startGame} 
            onMenu={returnToMenu} 
          />
        )}

        {gameState === GameState.GDD && (
          <GDDView data={gddData} onBack={returnToMenu} />
        )}
      </main>

      {/* Decorative corners */}
      <div className="fixed top-4 left-4 border-t-2 border-l-2 border-amber-900/40 w-12 h-12 pointer-events-none"></div>
      <div className="fixed top-4 right-4 border-t-2 border-r-2 border-amber-900/40 w-12 h-12 pointer-events-none"></div>
      <div className="fixed bottom-4 left-4 border-b-2 border-l-2 border-amber-900/40 w-12 h-12 pointer-events-none"></div>
      <div className="fixed bottom-4 right-4 border-b-2 border-r-2 border-amber-900/40 w-12 h-12 pointer-events-none"></div>
    </div>
  );
};

export default App;
