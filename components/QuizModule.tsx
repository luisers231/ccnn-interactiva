import React, { useState, useEffect } from 'react';
import { Topic, QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';
import { NeonButton, GlassCard, Header } from './FuturisticUI';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  topic: Topic;
  onBack: () => void;
}

const QuizModule: React.FC<Props> = ({ topic, onBack }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    let mounted = true;
    generateQuiz(topic).then(data => {
      if (mounted) {
        setQuestions(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [topic]);

  const handleOptionClick = (option: string) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    if (option === questions[currentQIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-20 h-20 text-fuchsia-500 animate-spin" />
        <h2 className="mt-4 text-2xl text-fuchsia-400">Generando Desafío Neural...</h2>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center animate-in fade-in zoom-in duration-500">
        <GlassCard className="border-neon-purple p-10">
          <Header title="Resultados del Diagnóstico" />
          <div className="text-6xl font-black text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {score} / {questions.length}
          </div>
          <p className="text-xl mb-8">
            {score > 15 ? "¡Excelente! Tu conocimiento es de nivel superior." : "Buen intento, sigue estudiando para alcanzar el máximo potencial."}
          </p>
          <div className="flex justify-center gap-4">
            <NeonButton onClick={onBack} color="blue">Volver al Hub</NeonButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <NeonButton onClick={onBack} color="red" className="text-sm px-4 py-2">Salir</NeonButton>
        <div className="text-cyan-400 font-mono text-xl">
          Pregunta {currentQIndex + 1}/{questions.length} | Score: {score}
        </div>
      </div>

      <GlassCard className="mb-8 min-h-[300px] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
            <div 
                className="h-full bg-cyan-500 transition-all duration-500" 
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
          {currentQ.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.options.map((opt, idx) => {
            let btnColor: 'blue' | 'green' | 'red' = 'blue';
            let opacity = 'opacity-100';
            
            if (showResult) {
              if (opt === currentQ.correctAnswer) btnColor = 'green';
              else if (opt === selectedOption) btnColor = 'red';
              else opacity = 'opacity-50';
            }

            return (
              <NeonButton
                key={idx}
                onClick={() => handleOptionClick(opt)}
                color={btnColor}
                disabled={showResult}
                className={`w-full text-left normal-case py-4 px-6 h-full flex items-center ${opacity}`}
              >
                <span className="mr-3 font-mono opacity-50">{String.fromCharCode(65 + idx)}.</span>
                {opt}
                {showResult && opt === currentQ.correctAnswer && <CheckCircle className="ml-auto text-green-400" />}
                {showResult && opt === selectedOption && opt !== currentQ.correctAnswer && <XCircle className="ml-auto text-red-400" />}
              </NeonButton>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border-l-4 border-yellow-400 animate-in slide-in-from-bottom-2">
            <h4 className="text-yellow-400 font-bold mb-1">Explicación:</h4>
            <p className="text-gray-300">{currentQ.explanation}</p>
            <div className="mt-4 flex justify-end">
              <NeonButton onClick={nextQuestion} color="purple">
                {currentQIndex < questions.length - 1 ? "Siguiente Pregunta >" : "Ver Resultados"}
              </NeonButton>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default QuizModule;
