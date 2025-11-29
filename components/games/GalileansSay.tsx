import React, { useState, useEffect } from 'react';
import { Topic, GalileanQuestion } from '../../types';
import { generateGalileanRound } from '../../services/geminiService';
import { NeonButton, GlassCard, Header } from '../FuturisticUI';
import { Loader2, Users, ShieldAlert } from 'lucide-react';

interface Props {
  topic: Topic;
  onBack: () => void;
}

const GalileansSay: React.FC<Props> = ({ topic, onBack }) => {
  const [data, setData] = useState<GalileanQuestion | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [currentTeam, setCurrentTeam] = useState<1 | 2>(1);
  const [strikes, setStrikes] = useState(0); // Max 3
  const [roundOver, setRoundOver] = useState(false);
  const [stealPhase, setStealPhase] = useState(false);

  const loadRound = async () => {
    setLoading(true);
    setStrikes(0);
    setRoundOver(false);
    setStealPhase(false);
    // Reset revealed for new data length later
    const qData = await generateGalileanRound(topic);
    setData(qData);
    setRevealed(new Array(qData.answers.length).fill(false));
    setLoading(false);
  };

  useEffect(() => {
    loadRound();
  }, [topic]);

  const revealAnswer = (index: number) => {
    if (roundOver || revealed[index]) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    // Add points
    const points = data!.answers[index].points;
    if (stealPhase) {
        // Steal successful
        if (currentTeam === 1) setTeam1Score(s => s + points); // Should logic be steal total pool? 
        // Simplifying logic: Just add points to current team for simplicity in this demo.
        // In real feud, stealing team gets the pot. 
        // Let's implement: Points go to currentTeam.
        if(currentTeam === 1) setTeam1Score(s => s + calculatePot());
        else setTeam2Score(s => s + calculatePot());
        setRoundOver(true);
    } else {
        // Normal play
        // In a real automated game, we'd need input text matching.
        // For this interactive "Host" version, we click to reveal.
        // We assume the host (user) clicked because the team got it right.
        // Points accumulate in a pot usually, but let's just add to current team immediately for simplicity.
        if (currentTeam === 1) setTeam1Score(s => s + points);
        else setTeam2Score(s => s + points);
    }

    // Check if all revealed
    if (newRevealed.every(Boolean)) {
        setRoundOver(true);
    }
  };

  const calculatePot = () => {
      // Calculate current visible points if we were banking them, 
      // but here we already added them.
      // Logic for steal: If stealing team gets it right, they steal the points ON THE BOARD?
      // Simplified: Just playing for points.
      return 0; 
  };

  const addStrike = () => {
      if(roundOver) return;
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      if (newStrikes >= 3) {
          if (!stealPhase) {
            setStealPhase(true);
            setCurrentTeam(currentTeam === 1 ? 2 : 1); // Switch team for steal attempt
            setStrikes(0); // Reset strikes for steal attempt (usually 1 chance)
            alert(`¡Tres X! Robo de puntos para el Equipo ${currentTeam === 1 ? 2 : 1}`);
          } else {
              setRoundOver(true);
              alert("¡Robo fallido! Ronda terminada.");
          }
      }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-green-500" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
          <NeonButton onClick={onBack} color="red">&larr; Salir</NeonButton>
          <NeonButton onClick={loadRound} color="blue">Siguiente Ronda &rarr;</NeonButton>
      </div>
      
      <Header title="100 Galileanos Dicen" />

      {/* Scoreboard */}
      <div className="flex justify-between mb-8 gap-4">
          <GlassCard className={`flex-1 text-center border-2 ${currentTeam === 1 ? 'border-yellow-400 shadow-neon-blue' : 'border-transparent'}`}>
              <h3 className="text-xl text-cyan-400">Equipo Alfa</h3>
              <div className="text-4xl font-black text-white">{team1Score}</div>
              <NeonButton onClick={() => setCurrentTeam(1)} color="blue" className="mt-2 text-xs">Turno</NeonButton>
          </GlassCard>
          
          <div className="flex items-center justify-center">
             <div className="text-6xl font-black text-red-600 animate-pulse tracking-widest">
                 {"X".repeat(strikes)}
             </div>
          </div>

          <GlassCard className={`flex-1 text-center border-2 ${currentTeam === 2 ? 'border-yellow-400 shadow-neon-blue' : 'border-transparent'}`}>
              <h3 className="text-xl text-fuchsia-400">Equipo Beta</h3>
              <div className="text-4xl font-black text-white">{team2Score}</div>
              <NeonButton onClick={() => setCurrentTeam(2)} color="purple" className="mt-2 text-xs">Turno</NeonButton>
          </GlassCard>
      </div>

      <GlassCard className="p-8 border-t-8 border-yellow-500">
          <h2 className="text-2xl text-center mb-8 font-bold italic">"{data?.question}"</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.answers.map((ans, idx) => (
                  <div key={idx} className="relative h-16 perspective-1000 cursor-pointer" onClick={() => revealAnswer(idx)}>
                      <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${revealed[idx] ? 'rotate-x-180' : ''}`}>
                          {/* Front (Hidden) */}
                          <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-blue-900 to-blue-950 border-2 border-blue-400 rounded flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                              <span className="text-3xl font-black text-blue-300 drop-shadow-md">{idx + 1}</span>
                          </div>
                          {/* Back (Revealed) */}
                          <div className="absolute inset-0 backface-hidden rotate-x-180 bg-gradient-to-r from-yellow-600 to-yellow-500 border-2 border-white rounded flex items-center justify-between px-4">
                              <span className="font-bold text-black uppercase">{ans.text}</span>
                              <span className="font-black text-black bg-white px-2 py-1 rounded">{ans.points}</span>
                          </div>
                      </div>
                  </div>
              ))}
              {/* Empty slots filler to maintain grid look if needed */}
              {Array.from({ length: Math.max(0, 8 - (data?.answers.length || 0)) }).map((_, i) => (
                   <div key={`empty-${i}`} className="h-16 bg-gray-900/50 border border-gray-800 rounded opacity-50"></div>
              ))}
          </div>
      </GlassCard>

      <div className="mt-8 flex justify-center">
          <button 
            onClick={addStrike}
            className="w-24 h-24 rounded-full bg-red-600 border-4 border-red-800 shadow-[0_0_30px_red] flex items-center justify-center active:scale-95 transition-transform"
          >
              <ShieldAlert className="w-12 h-12 text-white" />
          </button>
      </div>
    </div>
  );
};

export default GalileansSay;
