
import React, { useEffect, useState } from 'react';
import { StoryNode as StoryNodeType, Choice } from '../types';

interface StoryNodeProps {
  node: StoryNodeType;
  onChoice: (choice: Choice) => void;
  onReset: () => void;
  isLatest: boolean;
}

export const StoryNode: React.FC<StoryNodeProps> = ({ node, onChoice, onReset, isLatest }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isLatest) {
      setDisplayText(node.narrative);
      setIsTyping(false);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(node.narrative.slice(0, i));
      i++;
      if (i > node.narrative.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [node, isLatest]);

  return (
    <div className={`fade-in transition-opacity duration-1000 ${isLatest ? 'opacity-100' : 'opacity-40 pointer-events-none scale-[0.98]'}`}>
      <div className="mb-12">
        <p className="text-xl md:text-2xl leading-relaxed text-neutral-300 font-light italic">
          {displayText}
          {isTyping && <span className="inline-block w-1.5 h-5 ml-1 bg-neutral-500 animate-pulse align-middle"></span>}
        </p>
      </div>

      {!isTyping && (
        <div className="space-y-4 animate-[fadeIn_1s_ease-out]">
          {node.isEnding ? (
            <div className="pt-8 border-t border-neutral-900 mt-12 flex flex-col items-center">
              <span className="mono text-[10px] uppercase tracking-[0.4em] text-neutral-600 mb-6">Execution Concluded</span>
              <button
                onClick={onReset}
                className="group flex items-center space-x-3 px-8 py-3 border border-neutral-800 hover:border-neutral-500 transition-all duration-700"
              >
                <span className="mono text-xs uppercase tracking-widest text-neutral-500 group-hover:text-neutral-200">Return to Origin</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {node.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => onChoice(choice)}
                  className="group flex items-center justify-start text-left p-4 bg-neutral-950/50 border border-neutral-900 hover:border-neutral-700 transition-all duration-300 rounded-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 group-hover:bg-neutral-300 mr-4 transition-all duration-500"></div>
                  <span className="text-neutral-500 group-hover:text-neutral-200 transition-colors text-lg italic font-light">
                    {choice.text}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
