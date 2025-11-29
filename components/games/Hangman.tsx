import React, { useState, useEffect } from 'react';
import { Topic } from '../../types';
import { generateHangmanWord } from '../../services/geminiService';
import { NeonButton, GlassCard, Header } from '../FuturisticUI';
import { Loader2, RefreshCw } from 'lucide-react';

interface Props {
  topic: Topic;
  onBack: () => void;
}

const Hangman: React.FC<Props> = ({ topic, onBack }) => {
  const [target, setTarget] = useState<{ word: string, hint: string } | null>(null);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const maxMistakes = 6;

  const initGame = async () => {
    setLoading(true);
    setGuessed(new Set());
    setMistakes(0);
    setGameStatus('playing');
    const data = await generateHangmanWord(topic);
    setTarget({ word: data.word.toUpperCase(), hint: data.hint });
    setLoading(false);
  };

  useEffect(() => {
    initGame();
  }, [topic]);

  const handleGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessed.has(letter) || !target) return;

    const newGuessed = new Set(guessed).add(letter);
    setGuessed(newGuessed);

    if (!target.word.includes(letter)) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= maxMistakes) setGameStatus('lost');
    } else {
      const isWon = target.word.split('').every(l => newGuessed.has(l));
      if (isWon) setGameStatus('won');
    }
  };

  const keyboard = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('');

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-cyan-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-4 text-center">
      <NeonButton onClick={onBack} color="red" className="mb-4">&larr; Salir</NeonButton>
      <Header title="El Ahorcado Cuántico" subtitle="Adivina el concepto" />

      <GlassCard className="mb-8">
        <div className="mb-6 flex justify-center">
             {/* Simple SVG Hangman drawing based on mistakes */}
             <svg width="200" height="200" className="stroke-cyan-500 stroke-2 fill-none">
                {/* Base */}
                <path d="M20,180 L180,180" />
                <path d="M50,180 L50,20" />
                <path d="M50,20 L120,20" />
                <path d="M120,20 L120,50" />
                {mistakes >= 1 && <circle cx="120" cy="70" r="20" />}
                {mistakes >= 2 && <path d="M120,90 L120,140" />}
                {mistakes >= 3 && <path d="M120,100 L90,120" />}
                {mistakes >= 4 && <path d="M120,100 L150,120" />}
                {mistakes >= 5 && <path d="M120,140 L100,170" />}
                {mistakes >= 6 && <path d="M120,140 L140,170" />}
             </svg>
        </div>

        <div className="text-4xl md:text-6xl font-mono tracking-[0.5em] text-white mb-8 min-h-[80px]">
          {target?.word.split('').map((char, i) => (
            <span key={i} className={`inline-block border-b-4 ${guessed.has(char) || gameStatus === 'lost' ? 'border-cyan-500 text-white' : 'border-gray-600 text-transparent'}`}>
              {guessed.has(char) || gameStatus === 'lost' ? char : '_'}
            </span>
          ))}
        </div>
        
        <p className="text-yellow-400 text-lg mb-6">Pista: {target?.hint}</p>

        {gameStatus !== 'playing' && (
          <div className="mb-6">
            <h3 className={`text-3xl font-bold mb-4 ${gameStatus === 'won' ? 'text-green-500' : 'text-red-500'}`}>
              {gameStatus === 'won' ? '¡SISTEMA DESBLOQUEADO!' : '¡FALLO CRÍTICO!'}
            </h3>
            <NeonButton onClick={initGame} color="purple">
              <RefreshCw className="mr-2 inline" /> Jugar de nuevo
            </NeonButton>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {keyboard.map(char => (
            <button
              key={char}
              onClick={() => handleGuess(char)}
              disabled={guessed.has(char) || gameStatus !== 'playing'}
              className={`
                w-10 h-10 md:w-12 md:h-12 rounded bg-opacity-20 font-bold border
                transition-all duration-200
                ${guessed.has(char) 
                  ? 'bg-gray-700 border-gray-700 text-gray-500 opacity-50 cursor-not-allowed' 
                  : 'bg-cyan-500/10 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black'}
              `}
            >
              {char}
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default Hangman;
