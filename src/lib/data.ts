type Page = {
  sessionId: string;
  writtenIdeas: string[];
  submitted: boolean;
  ideasPerRound: number;
};

export let pages: Page[] = [];
