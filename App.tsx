
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { LandingScreen } from './components/LandingScreen';
import { GenreSelector } from './components/GenreSelector';
import { StoryNode } from './components/StoryNode';
import { generateInitialNode, generateNextNode } from './services/geminiService';
import { GameState, Genre, Choice, StoryNode as StoryNodeType } from './types';

const MAX_STEPS = 5;

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    hasStarted: false,
    currentGenre: null,
    history: [],
    isLoading: false,
    error: null,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on history update
  useEffect(() => {
    if (scrollRef.current) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [state.history, state.isLoading]);

  const handleBegin = useCallback(() => {
    setState(prev => ({ ...prev, hasStarted: true }));
  }, []);

  const handleStartGame = useCallback(async (genre: Genre) => {
    setState(prev => ({ ...prev, currentGenre: genre, isLoading: true, error: null }));
    try {
      const initialNode = await generateInitialNode(genre);
      setState(prev => ({
        ...prev,
        history: [initialNode],
        isLoading: false,
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: "The narrative engine failed to initialize. Try again.", isLoading: false }));
    }
  }, []);

  const handleChoice = useCallback(async (choice: Choice) => {
    if (!state.currentGenre) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    const currentDepth = state.history.length;

    try {
      const nextNode = await generateNextNode(
        state.currentGenre,
        state.history,
        choice.text,
        currentDepth,
        MAX_STEPS
      );

      setState(prev => ({
        ...prev,
        history: [...prev.history, nextNode],
        isLoading: false,
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: "Lost connection to the story stream.", isLoading: false }));
    }
  }, [state.currentGenre, state.history]);

  const resetGame = useCallback(() => {
    setState({
      hasStarted: false,
      currentGenre: null,
      history: [],
      isLoading: false,
      error: null,
    });
  }, []);

  return (
    <Layout showHeader={state.hasStarted}>
      {!state.hasStarted ? (
        <LandingScreen onBegin={handleBegin} />
      ) : !state.currentGenre ? (
        <GenreSelector onSelect={handleStartGame} />
      ) : (
        <div ref={scrollRef} className="space-y-32">
          {state.history.map((node, index) => (
            <StoryNode
              key={node.id}
              node={node}
              onChoice={handleChoice}
              onReset={resetGame}
              isLatest={index === state.history.length - 1 && !state.isLoading}
            />
          ))}

          {state.isLoading && (
            <div className="flex flex-col items-center space-y-6 pt-12 animate-pulse">
              <div className="flex space-x-2">
                <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <span className="mono text-[10px] uppercase tracking-[0.4em] text-neutral-600">
                Processing Reality
              </span>
            </div>
          )}

          {state.error && (
            <div className="pt-8 text-center">
              <p className="text-red-900/80 mono text-xs mb-4">{state.error}</p>
              <button onClick={resetGame} className="mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-neutral-200 underline decoration-neutral-800 underline-offset-4">
                Attempt Reboot
              </button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
