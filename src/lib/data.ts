import type { Cookies } from '@sveltejs/kit';
import { writable, get } from 'svelte/store';

export const IDEAS_PER_ROUND = 3;

export const getSessionId = (cookies: Cookies) => {
	let sessionid = cookies.get('sessionid');
	if (!sessionid) {
		sessionid = crypto.randomUUID();
		cookies.set('sessionid', sessionid, {
			path: '/',
			httpOnly: true
		});
	}
	return sessionid;
};

export type Page = {
	sessionId: string;
	writtenIdeas: string[];
	submitted: boolean;
	ideasPerRound: number;
	connected: boolean;
};

export type Round = {
	round: number;
	start: number;
};

export const pages = writable<Page[]>([]);
pages.subscribe(console.log);

export const currentRound = writable<Round>({ round: 0, start: Date.now() });

// TODO: turn into derived store
export const getPage = (sessionId: string) => {
	const page = get(pages).find((page) => page.sessionId === sessionId);
	if (!page) {
		throw new Error('No page for session');
	}
	return page;
};
