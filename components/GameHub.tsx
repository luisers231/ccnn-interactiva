import React, { useState } from 'react';
import { Topic, AppView } from '../types';
import { NeonButton, Header, GlassCard } from './FuturisticUI';
import { Gamepad2, Grid3X3, Users, HelpCircle, Dna } from 'lucide-react';
import Hangman from './games/Hangman';
import GalileansSay from './games/GalileansSay';
import TicTacToe from './games/TicTacToe';
import Jeopardy from './games/Jeopardy';

interface Props {
  topic: Topic;
  onBack: () => void;
}

const GameHub: React.FC<Props> = ({ topic, onBack }) => {
  const [selectedGame, setSelectedGame] = useState<AppView | null>(null);

  if (selectedGame === AppView.GAME_HANGMAN) return <Hangman topic={topic} onBack={() => setSelectedGame(null)} />;
  if (selectedGame === AppView.GAME_GALILEANS) return <GalileansSay topic={topic} onBack={() => setSelectedGame(null)} />;
  if (selectedGame === AppView.GAME_TICTACTOE) return <TicTacToe topic={topic} onBack={() => setSelectedGame(null)} />;
  if (selectedGame === AppView.GAME_JEOPARDY) return <Jeopardy topic={topic} onBack={() => setSelectedGame(null)} />;

  const games = [
    { id: AppView.GAME_HANGMAN, name: "El Ahorcado Bio", icon: <Dna className="w-12 h-12 text-cyan-500" />, desc: "Descubre el término oculto antes de que el sistema se desconecte." },
    { id: AppView.GAME_TICTACTOE, name: "Tic Tac Toe: Trivia", icon: <Grid3X3 className="w-12 h-12 text-fuchsia-500" />, desc: "Domina el tablero respondiendo preguntas para colocar tu marca." },
    { id: AppView.GAME_JEOPARDY, name: "Jeopardy Lab", icon: <HelpCircle className="w-12 h-12 text-yellow-500" />, desc: "Arriesga puntos por conocimientos en diferentes categorías." },
    { id: AppView.GAME_GALILEANS, name: "100 Galileanos Dicen", icon: <Users className="w-12 h-12 text-green-500" />, desc: "Duelo de equipos. Adivina lo que la mayoría respondió." },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 animate-[fadeIn_0.5s]">
      <NeonButton onClick={onBack} color="red" className="mb-6">&larr; Volver</NeonButton>
      <Header title="Zona de Juegos Neurales" subtitle="Aprende jugando" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {games.map((game) => (
          <button 
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
            className="group relative text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-50 group-hover:opacity-100" />
            <GlassCard className="relative h-full border border-white/10 group-hover:border-cyan-500/50 transition-colors flex flex-col items-center text-center p-8">
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 bg-black/50 p-4 rounded-full border border-white/10">
                {game.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{game.name}</h3>
              <p className="text-gray-400">{game.desc}</p>
              <div className="mt-6">
                <span className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/50 rounded text-cyan-400 text-sm font-bold uppercase tracking-widest">
                  Iniciar Protocolo
                </span>
              </div>
            </GlassCard>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameHub;
