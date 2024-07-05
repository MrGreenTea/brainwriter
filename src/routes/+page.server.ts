import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

import type { PageServerLoad, Actions } from './$types';
import { IDEAS_PER_ROUND, pages, currentRound, getSessionId, getPage } from '$lib/data';

export const load: PageServerLoad = ({ cookies }) => {
	const sessionId = getSessionId(cookies);

	if (!get(pages).some((p) => p.sessionId === sessionId)) {
		pages.update((ps) => [
			...ps,
			{
				sessionId,
				writtenIdeas: [],
				submitted: false,
				ideasPerRound: IDEAS_PER_ROUND,
				connected: false
			}
		]);
	}
	return {
		page: getPage(sessionId),
		currentRound: get(currentRound)
	};
};

currentRound.subscribe((n) => console.log('Starting round', n));

const nextRound = () => {
	const currentPages = get(pages);
	if (currentPages.length < 2) {
		return;
	}
	let ideas = currentPages.map((p) => p.writtenIdeas);
	// shift ideas one place to the left
	ideas = [...ideas.slice(1), ideas[0]];
	pages.update((ps) =>
		ideas.map((ideas, i) => ({ ...ps[i], writtenIdeas: ideas, submitted: false }))
	);
	currentRound.update((r) => ({ round: r.round + 1, start: Date.now() }));
};

export const actions: Actions = {
	default: async (event) => {
		const sessionid = getSessionId(event.cookies);
		const page = getPage(sessionid);
		if (page.submitted) {
			error(400, 'Already submitted');
		}
		const formData = await event.request.formData();

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
		pages.update((ps) => [...ps]);
		if (get(pages).every((p) => p.submitted || !p.connected)) {
			nextRound();
		}
	}
};
