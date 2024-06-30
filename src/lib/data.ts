import type { Cookies } from '@sveltejs/kit';
import { writable } from 'svelte/store';

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
};

export const pages = writable<Page[]>([]);
pages.subscribe(console.log);

export const currentRound = writable(1);
