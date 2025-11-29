import React, { useState, useEffect } from 'react';
import { Topic, JeopardyCategory } from '../../types';
import { generateJeopardyBoard } from '../../services/geminiService';
import { NeonButton, GlassCard, Header } from '../FuturisticUI';
import { Loader2 } from 'lucide-react';

interface Props {
  topic: Topic;
  onBack: () => void;
}

const Jeopardy: React.FC<Props> = ({ topic, onBack }) => {
  const [categories, setCategories] = useState<JeopardyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [selectedQ, setSelectedQ] = useState<{catIndex: number, qIndex: number} | null>(null);
  const [revealAnswer, setRevealAnswer] = useState(false);

  useEffect(() => {
    generateJeopardyBoard(topic).then(data => {
      setCategories(data);
      setLoading(false);
    });
  }, [topic]);

  const handleSelect = (cIdx: number, qIdx: number) => {
    const key = `${cIdx}-${qIdx}`;
    if (answered.has(key)) return;
    setSelectedQ({ catIndex: cIdx, qIndex: qIdx });
    setRevealAnswer(false);
  };

  const handleResponse = (correct: boolean) => {
    if (!selectedQ) return;
    const { catIndex, qIndex } = selectedQ;
    const points = categories[catIndex].questions[qIndex].points;
    
    if (correct) setScore(s => s + points);
    else setScore(s => s - points);

    setAnswered(prev => new Set(prev).add(`${catIndex}-${qIndex}`));
    setSelectedQ(null);
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-yellow-500 w-12 h-12" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
          <NeonButton onClick={onBack} color="red">&larr; Salir</NeonButton>
          <div className="text-3xl font-black text-yellow-400 bg-black/50 px-6 py-2 rounded border border-yellow-500">
              ${score}
          </div>
      </div>
      <Header title="Jeopardy Lab" />

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
          {/* Headers */}
          {categories.map((cat, i) => (
              <div key={i} className="bg-blue-900 text-white font-bold p-4 text-center border-b-4 border-black uppercase text-sm md:text-xl flex items-center justify-center min-h-[80px]">
                  {cat.name}
              </div>
          ))}

          {/* Cells */}
          {[0, 1, 2].map(qIdx => (
              categories.map((cat, cIdx) => {
                  const q = cat.questions[qIdx];
                  const isAnswered = answered.has(`${cIdx}-${qIdx}`);
                  return (
                      <button
                        key={`${cIdx}-${qIdx}`}
                        disabled={isAnswered}
                        onClick={() => handleSelect(cIdx, qIdx)}
                        className={`
                            h-24 md:h-32 text-2xl md:text-4xl font-black transition-all
                            ${isAnswered ? 'bg-gray-900 text-gray-800' : 'bg-blue-800 text-yellow-400 hover:bg-blue-700 hover:shadow-[inset_0_0_20px_rgba(255,255,0,0.5)]'}
                        `}
                      >
                          {isAnswered ? '' : `$${q?.points}`}
                      </button>
                  );
              })
          ))}
      </div>

      {/* Question Modal */}
      {selectedQ && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/95 p-8">
              <div className="max-w-4xl w-full text-center">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 uppercase leading-relaxed shadow-black drop-shadow-lg">
                      {categories[selectedQ.catIndex].questions[selectedQ.qIndex].question}
                  </h2>
                  
                  {!revealAnswer ? (
                      <NeonButton onClick={() => setRevealAnswer(true)} color="yellow" className="text-xl py-4 px-8">
                          Mostrar Respuesta
                      </NeonButton>
                  ) : (
                      <div className="animate-in fade-in slide-in-from-bottom-4">
                          <p className="text-2xl text-green-400 mb-8 font-mono">
                              {categories[selectedQ.catIndex].questions[selectedQ.qIndex].answer}
                          </p>
                          <div className="flex justify-center gap-8">
                              <NeonButton onClick={() => handleResponse(true)} color="green">¡Correcto!</NeonButton>
                              <NeonButton onClick={() => handleResponse(false)} color="red">Incorrecto</NeonButton>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default Jeopardy;
