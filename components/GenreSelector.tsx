
import React from 'react';
import { Genre } from '../types';

interface GenreSelectorProps {
  onSelect: (genre: Genre) => void;
}

const genres = Object.values(Genre);

export const GenreSelector: React.FC<GenreSelectorProps> = ({ onSelect }) => {
  return (
    <div className="fade-in space-y-12 w-full max-w-md mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-light text-neutral-200 tracking-tight italic">
          Choose your reality.
        </h2>
        <p className="text-neutral-500 text-sm italic font-serif leading-relaxed">
          The void waits for a shape. Select a genre to begin the weaving.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelect(genre)}
            className="group relative flex items-center justify-between p-4 bg-transparent border border-neutral-800 hover:border-neutral-500 transition-all duration-500 rounded-sm"
          >
            <span className="mono text-xs uppercase tracking-widest text-neutral-500 group-hover:text-neutral-200 transition-colors">
              {genre}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 group-hover:bg-neutral-200 transition-all duration-500 group-hover:scale-125"></div>
          </button>
        ))}
      </div>
    </div>
  );
};
