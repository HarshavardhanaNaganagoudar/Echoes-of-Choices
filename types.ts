
export enum Genre {
  HORROR = 'Cosmic Horror',
  SCIFI = 'Hard Sci-Fi',
  FANTASY = 'High Fantasy',
  MYSTERY = 'Noir Mystery',
  THRILLER = 'Techno-Thriller',
  POST_APOCALYPTIC = 'Post-Apocalyptic'
}

export interface Choice {
  text: string;
  id: string;
}

export interface StoryNode {
  id: string;
  narrative: string;
  choices: Choice[];
  isEnding: boolean;
  depth: number;
}

export interface GameState {
  hasStarted: boolean;
  currentGenre: Genre | null;
  history: StoryNode[];
  isLoading: boolean;
  error: string | null;
}
