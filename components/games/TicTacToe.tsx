import React, { useState, useEffect } from 'react';
import { Topic, QuizQuestion } from '../../types';
import { generateQuiz } from '../../services/geminiService';
import { NeonButton, GlassCard, Header } from '../FuturisticUI';
import { Loader2 } from 'lucide-react';

interface Props {
  topic: Topic;
  onBack: () => void;
}

const TicTacToe: React.FC<Props> = ({ topic, onBack }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);

  useEffect(() => {
    generateQuiz(topic).then(data => {
      setQuestions(data);
      setLoading(false);
    });
  }, [topic]);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleSquareClick = (index: number) => {
    if (board[index] || checkWinner(board)) return;
    
    // Pick a random question to validate the move
    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQ);
    setTargetIndex(index);
    setModalOpen(true);
  };

  const handleAnswer = (option: string) => {
    if (!currentQuestion) return;

    if (option === currentQuestion.correctAnswer) {
      // Correct! Place mark
      const newBoard = [...board];
      newBoard[targetIndex!] = isXNext ? 'X' : 'O';
      setBoard(newBoard);
      setIsXNext(!isXNext);
      setModalOpen(false);
    } else {
      // Wrong! Turn passes, no mark placed (or penalty?)
      // Simple rule: Turn passes.
      alert(`Incorrecto. La respuesta era: ${currentQuestion.correctAnswer}. Pierdes el turno.`);
      setIsXNext(!isXNext);
      setModalOpen(false);
    }
  };

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(Boolean);

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-fuchsia-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <NeonButton onClick={onBack} color="red" className="self-start mb-4">&larr; Salir</NeonButton>
      <Header title="Tic Tac Toe: Trivia" />
      
      <div className="mb-4 text-2xl font-bold text-white">
        {winner ? `Ganador: ${winner}` : isDraw ? "Empate" : `Turno: ${isXNext ? 'X' : 'O'}`}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleSquareClick(i)}
            className={`
              w-24 h-24 md:w-32 md:h-32 bg-white/5 border-2 border-cyan-500/30 rounded-xl
              text-6xl font-black flex items-center justify-center
              hover:bg-cyan-500/10 transition-colors
              ${val === 'X' ? 'text-cyan-400' : 'text-fuchsia-400'}
            `}
          >
            {val}
          </button>
        ))}
      </div>

      <NeonButton onClick={() => { setBoard(Array(9).fill(null)); setIsXNext(true); }} color="green">
        Reiniciar Tablero
      </NeonButton>

      {modalOpen && currentQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <GlassCard className="max-w-lg w-full border-t-4 border-yellow-400 animate-in zoom-in duration-300">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">¡Pregunta de Validación!</h3>
            <p className="text-white mb-6 text-lg">{currentQuestion.question}</p>
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="p-3 text-left bg-white/10 hover:bg-white/20 rounded border border-white/10 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
