import { writable } from 'svelte/store';

export type Page = {
  sessionId: string;
  writtenIdeas: string[];
  submitted: boolean;
  ideasPerRound: number;
};

export const pages = writable<Page[]>([]);

export const currentRound = writable(1);
