import React, { useState, useEffect } from 'react';
import { Topic, ActivityItem } from '../types';
import { generateActivities } from '../services/geminiService';
import { NeonButton, GlassCard, Header } from './FuturisticUI';
import { Loader2, BookOpen, Lightbulb } from 'lucide-react';

interface Props {
  topic: Topic;
  onBack: () => void;
}

const Activities: React.FC<Props> = ({ topic, onBack }) => {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    generateActivities(topic).then(data => {
      if (mounted) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [topic]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
        <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mb-4" />
        <p className="text-cyan-400 text-xl animate-pulse">Cargando actividades de la matriz de datos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 animate-[fadeIn_0.5s_ease-out]">
      <NeonButton onClick={onBack} color="red" className="mb-6">
        &larr; Volver
      </NeonButton>
      <Header title="Actividades Interactivas" subtitle={`Explorando: ${topic}`} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div 
            key={item.id}
            className="group perspective-1000 h-64 cursor-pointer"
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          >
            <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${activeIndex === index ? 'rotate-y-180' : ''}`}>
              
              {/* Front */}
              <div className="absolute inset-0 backface-hidden">
                <GlassCard className="h-full flex flex-col items-center justify-center border-t-4 border-cyan-500 hover:shadow-neon-blue transition-shadow group-hover:bg-white/5">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-300 font-bold text-xl border border-cyan-500">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-center text-white mb-2">{item.term}</h3>
                  <p className="text-gray-400 text-sm">Toca para descubrir</p>
                  <BookOpen className="mt-4 text-cyan-500 animate-bounce" />
                </GlassCard>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <GlassCard className="h-full flex flex-col overflow-y-auto border-t-4 border-fuchsia-500 shadow-neon-purple custom-scrollbar">
                   <h4 className="text-lg font-bold text-fuchsia-400 mb-2 border-b border-fuchsia-500/30 pb-1">Definición</h4>
                   <p className="text-sm mb-4 leading-relaxed">{item.definition}</p>
                   
                   <h4 className="text-lg font-bold text-green-400 mb-2 border-b border-green-500/30 pb-1 flex items-center gap-2">
                     <Lightbulb size={16} /> Ejemplo
                   </h4>
                   <p className="text-sm text-gray-300 italic">"{item.example}"</p>
                </GlassCard>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
