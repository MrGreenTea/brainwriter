import { error, type Cookies } from '@sveltejs/kit';
import { get } from 'svelte/store';

import type { PageServerLoad, Actions } from './$types';
import { pages, currentRound } from '$lib/data';

const IDEAS_PER_ROUND = 3;

const getSessionId = (cookies: Cookies) => {
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

const getPage = (sessionId: string) => {
	const page = get(pages).find((page) => page.sessionId === sessionId);
	if (!page) {
		throw new Error('No page for session');
	}
	return page;
};

export const load: PageServerLoad = ({ cookies }) => {
	const sessionId = getSessionId(cookies);
	if (!get(pages).some((p) => p.sessionId === sessionId)) {
		if (get(currentRound) === 1) {
			pages.update((ps) => [
				...ps,
				{
					sessionId,
					writtenIdeas: [],
					submitted: false,
					ideasPerRound: IDEAS_PER_ROUND
				}
			]);
		} else {
			error(403, 'No page for session');
		}
	}

	const page = getPage(sessionId);
	return {
		page,
		currentRound: get(currentRound)
	};
};

const nextRound = () => {
	let ideas = get(pages).map((p) => p.writtenIdeas);
	// shift ideas one place to the left
	ideas = [...ideas.slice(1), ideas[0]];
	pages.update((ps) =>
		ideas.map((ideas, i) => ({ ...ps[i], writtenIdeas: ideas, submitted: false }))
	);
	currentRound.update((n) => n + 1);
};

export const actions: Actions = {
	default: async (event) => {
		const sessionid = getSessionId(event.cookies);
		const page = getPage(sessionid);
		if (page.submitted) {
			error(400, 'Already submitted');
		}
		const formData = await event.request.formData();
		console.log(formData);

		// iterate over all three idea fields
		// and add them to the IdeasMap
		const newIdeas = [];
		for (let i = 0; i < 3; i++) {
			let idea = formData.get(`idea${i}`) as string;
			idea = idea && idea.trim();
			if (idea.length > 0) {
				newIdeas.push(idea);
			}
		}
		if (newIdeas.length !== IDEAS_PER_ROUND) {
			error(400, 'Not enough ideas');
		}
		page.writtenIdeas.push(...newIdeas);
		page.submitted = true;
		if (get(pages).every((p) => p.submitted)) {
			nextRound();
		}
	}
};
