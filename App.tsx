import React, { useState } from 'react';
import { AppView, Topic } from './types';
import { NeonButton, GlassCard, Header } from './components/FuturisticUI';
import Activities from './components/Activities';
import QuizModule from './components/QuizModule';
import GameHub from './components/GameHub';
import { Atom, BrainCircuit, Dna, Activity, ArrowRight } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const topics = Object.values(Topic);

  const handleTopicSelect = (t: Topic) => {
    setSelectedTopic(t);
    setCurrentView(AppView.TOPIC_HUB);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in duration-1000">
             <div className="mb-8 relative">
                <div className="absolute inset-0 bg-cyan-500 blur-[100px] opacity-20 rounded-full" />
                <Atom className="w-32 h-32 text-cyan-400 animate-[spin_10s_linear_infinite]" />
             </div>
             <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500 tracking-tighter mb-4 text-center drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
               BIOFUTURA
             </h1>
             <p className="text-xl md:text-2xl text-gray-400 max-w-2xl text-center mb-12 font-light">
               Plataforma Avanzada de Aprendizaje Biológico Interactivo
             </p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
                {topics.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => handleTopicSelect(t)}
                    className="group relative overflow-hidden rounded-xl transition-all hover:scale-105 duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 to-black border border-cyan-500/30 group-hover:border-cyan-400" />
                    <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-6 flex flex-col h-full items-start justify-between min-h-[160px]">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors text-left">
                        {t}
                      </h3>
                      <div className="self-end p-2 bg-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                        <ArrowRight className="w-5 h-5 text-cyan-400" />
                      </div>
                    </div>
                  </button>
                ))}
             </div>
          </div>
        );

      case AppView.TOPIC_HUB:
        return (
          <div className="max-w-5xl mx-auto px-4 py-8 animate-in slide-in-from-right-8 duration-500">
            <NeonButton onClick={() => setCurrentView(AppView.HOME)} color="red" className="mb-6">&larr; Inicio</NeonButton>
            <Header title={selectedTopic || ''} subtitle="Selecciona un módulo de acceso" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
               <button onClick={() => setCurrentView(AppView.ACTIVITIES)} className="group">
                  <GlassCard className="h-full hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-shadow border-t-4 border-cyan-500">
                    <BrainCircuit className="w-16 h-16 text-cyan-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold text-white text-center mb-2">Actividades</h3>
                    <p className="text-gray-400 text-center text-sm">10 Conceptos interactivos con definiciones y ejemplos.</p>
                  </GlassCard>
               </button>

               <button onClick={() => setCurrentView(AppView.QUIZ)} className="group">
                  <GlassCard className="h-full hover:shadow-[0_0_30px_rgba(188,19,254,0.3)] transition-shadow border-t-4 border-fuchsia-500">
                    <Activity className="w-16 h-16 text-fuchsia-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold text-white text-center mb-2">Quiz Neural</h3>
                    <p className="text-gray-400 text-center text-sm">Evaluación de 20 preguntas con retroalimentación.</p>
                  </GlassCard>
               </button>

               <button onClick={() => setCurrentView(AppView.GAMES_MENU)} className="group">
                  <GlassCard className="h-full hover:shadow-[0_0_30px_rgba(10,255,10,0.3)] transition-shadow border-t-4 border-green-500">
                    <Dna className="w-16 h-16 text-green-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold text-white text-center mb-2">Zona de Juegos</h3>
                    <p className="text-gray-400 text-center text-sm">Ahorcado, TicTacToe, Jeopardy y 100 Galileanos.</p>
                  </GlassCard>
               </button>
            </div>
          </div>
        );

      case AppView.ACTIVITIES:
        return <Activities topic={selectedTopic!} onBack={() => setCurrentView(AppView.TOPIC_HUB)} />;

      case AppView.QUIZ:
        return <QuizModule topic={selectedTopic!} onBack={() => setCurrentView(AppView.TOPIC_HUB)} />;

      case AppView.GAMES_MENU:
        return <GameHub topic={selectedTopic!} onBack={() => setCurrentView(AppView.TOPIC_HUB)} />;

      default:
        return <div>Error 404: Sector no encontrado</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-gray-100 font-sans selection:bg-cyan-500 selection:text-black">
       {/* Background Grid Effect */}
       <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
            style={{ backgroundImage: 'linear-gradient(#00f3ff 1px, transparent 1px), linear-gradient(90deg, #00f3ff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
       </div>

       <main className="relative z-10 pt-8 pb-20">
         {renderContent()}
       </main>

       <footer className="fixed bottom-0 w-full bg-black/80 backdrop-blur border-t border-white/10 py-4 text-center text-sm text-gray-500 z-50">
          <p>Desarrollado por <span className="text-cyan-500 font-bold">Luis Munoz Soto</span> | BioFutura System v1.0</p>
       </footer>
    </div>
  );
};

export default App;
