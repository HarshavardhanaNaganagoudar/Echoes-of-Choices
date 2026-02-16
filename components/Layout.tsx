
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showHeader = true }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 max-w-3xl mx-auto selection:bg-neutral-800 selection:text-neutral-200">
      {showHeader && (
        <header className="fixed top-8 left-0 right-0 flex flex-col items-center pointer-events-none select-none z-10 animate-[fadeIn_1.5s_ease-out]">
          <h1 className="mono text-[10px] tracking-[0.5em] uppercase text-neutral-600 font-medium">
            Echoes of Choice
          </h1>
          <div className="h-px w-8 bg-neutral-800 mt-4"></div>
        </header>
      )}
      
      <main className="w-full mt-16 mb-24">
        {children}
      </main>

      <footer className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none select-none z-10">
        <p className="mono text-[10px] text-neutral-700 tracking-wider">
          v1.0.4 // Gemini-3-Flash Engine
        </p>
      </footer>
    </div>
  );
};
