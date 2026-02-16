
import React from 'react';

interface LandingScreenProps {
  onBegin: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onBegin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
      <div className="space-y-4 animate-[fadeIn_2s_ease-out]">
        <h1 className="text-5xl md:text-7xl font-extralight tracking-[0.2em] text-neutral-100 italic">
          Echoes <span className="text-neutral-500 font-thin">of</span> Choice
        </h1>
        <div className="flex justify-center items-center space-x-4 opacity-50">
          <div className="h-px w-12 bg-neutral-800"></div>
          <span className="mono text-[10px] uppercase tracking-[0.5em] text-neutral-600">A Narrative Engine</span>
          <div className="h-px w-12 bg-neutral-800"></div>
        </div>
      </div>

      <button
        onClick={onBegin}
        className="group relative px-12 py-4 animate-[fadeIn_3s_ease-out]"
      >
        <span className="relative z-10 mono text-xs uppercase tracking-[0.4em] text-neutral-400 group-hover:text-neutral-100 transition-colors duration-700">
          Begin
        </span>
        <div className="absolute inset-x-0 bottom-0 h-px bg-neutral-900 group-hover:bg-neutral-500 transition-all duration-1000 transform scale-x-50 group-hover:scale-x-100"></div>
        <div className="absolute -inset-2 bg-neutral-100/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-1000 rounded-full"></div>
      </button>
    </div>
  );
};
