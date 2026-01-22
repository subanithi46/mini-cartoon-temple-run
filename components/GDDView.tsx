
import React from 'react';

interface GDDData {
  title: string;
  coreLoop: string;
  powerUps: Array<{ name: string; description: string; upgrades: string }>;
  biomes: Array<{ name: string; description: string; hazards: string[] }>;
  monetization: string;
}

interface GDDViewProps {
  data: GDDData | null;
  onBack: () => void;
}

const GDDView: React.FC<GDDViewProps> = ({ data, onBack }) => {
  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-amber-500">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
      <p className="font-cinzel">Consulting Ancient Archives...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 text-stone-200">
      <button 
        onClick={onBack}
        className="mb-8 text-amber-500 hover:text-amber-400 font-cinzel flex items-center gap-2"
      >
        ← BACK TO MENU
      </button>

      <h1 className="text-5xl font-cinzel text-amber-500 mb-4">{data.title}</h1>
      <p className="text-stone-500 mb-12 italic border-l-4 border-amber-600 pl-4 py-2 text-xl">
        A spiritual successor to the endless runner genre.
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-cinzel text-amber-600 mb-4">Core Loop</h2>
          <p className="leading-relaxed bg-stone-900/50 p-6 rounded-lg border border-stone-800">{data.coreLoop}</p>
        </section>

        <section>
          <h2 className="text-3xl font-cinzel text-amber-600 mb-4">Power-Ups</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.powerUps.map((p, i) => (
              <div key={i} className="bg-stone-800/50 p-6 rounded border border-amber-900/20">
                <h3 className="text-xl font-bold text-amber-400 mb-2">{p.name}</h3>
                <p className="text-stone-300 text-sm mb-3">{p.description}</p>
                <div className="text-xs text-amber-600 font-bold uppercase tracking-wider">Upgrade Path</div>
                <p className="text-xs text-stone-500">{p.upgrades}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-cinzel text-amber-600 mb-4">Biomes & Environments</h2>
          <div className="space-y-6">
            {data.biomes.map((b, i) => (
              <div key={i} className="bg-stone-900/50 p-6 rounded-lg border-l-4 border-amber-700">
                <h3 className="text-2xl font-cinzel text-amber-400 mb-2">{b.name}</h3>
                <p className="text-stone-400 mb-4">{b.description}</p>
                <div className="flex flex-wrap gap-2">
                  {b.hazards.map((h, j) => (
                    <span key={j} className="bg-stone-800 px-3 py-1 rounded-full text-xs text-red-400 border border-red-900/30">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-cinzel text-amber-600 mb-4">Monetization</h2>
          <p className="bg-stone-800/30 p-6 rounded border border-amber-900/10 italic text-stone-400">
            {data.monetization}
          </p>
        </section>
      </div>

      <div className="mt-20 pb-10 text-center opacity-30 text-xs uppercase tracking-widest">
        End of Design Document
      </div>
    </div>
  );
};

export default GDDView;
