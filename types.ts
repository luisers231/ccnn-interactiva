export enum AppView {
  HOME,
  TOPIC_HUB,
  ACTIVITIES,
  QUIZ,
  GAMES_MENU,
  GAME_HANGMAN,
  GAME_TICTACTOE,
  GAME_JEOPARDY,
  GAME_GALILEANS
}

export enum Topic {
  REPRODUCCION_HUMANA = "Reproducción en los seres humanos",
  ETAPAS_FETO = "Etapas de desarrollo del feto",
  CICLO_MENSTRUAL = "Ciclo menstrual",
  APARATO_MASCULINO = "Estructura aparato reproductor masculino",
  APARATO_FEMENINO = "Estructura aparato reproductor femenino"
}

export interface ActivityItem {
  id: number;
  term: string;
  definition: string;
  example: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface GalileanQuestion {
  question: string;
  answers: { text: string; points: number }[];
}

export interface JeopardyCategory {
  name: string;
  questions: {
    points: number;
    question: string;
    answer: string;
  }[];
}

export interface GameState {
  score: number;
  team1Score?: number;
  team2Score?: number;
  currentTurn?: number; // 0 for Team 1, 1 for Team 2
}
