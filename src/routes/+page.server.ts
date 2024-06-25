import { error, type Cookies } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { pages } from '$lib/data';

const IDEAS_PER_ROUND = 3;

let currentRound = 1;

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
	let page = pages.find((page) => page.sessionId === sessionId);
	if (!page) {
		throw new Error('No page for session');
	}
	return page;
};

export const load: PageServerLoad = ({ cookies }) => {
	const sessionId = getSessionId(cookies);
	if (!pages.some((p) => p.sessionId === sessionId)) {
		if (currentRound === 1) {
			pages.push({
				sessionId,
				writtenIdeas: [],
				submitted: false,
				ideasPerRound: IDEAS_PER_ROUND
			});
		} else {
			error(403, 'No page for session');
		}
	}

	const page = getPage(sessionId);
	return {
		page
	};
};

const nextRound = () => {
	let ideas = pages.map((p) => p.writtenIdeas);
	// shift ideas one place to the left
	ideas = [...ideas.slice(1), ideas[0]];
	pages.forEach((page, i) => {
		page.writtenIdeas = ideas[i];
		page.submitted = false;
	});
	currentRound++;
};

export const actions: Actions = {
	default: async (event) => {
		const sessionid = getSessionId(event.cookies);
		const page = getPage(sessionid);
		const formData = await event.request.formData();
		console.log(formData);

		// iterate over all three idea fields
		// and add them to the IdeasMap
		let newIdeas = [];
		for (let i = 0; i < 3; i++) {
			const idea = formData.get(`idea${i}`) as string;
			if (idea) {
				newIdeas.push(idea);
			}
		}
		page.writtenIdeas.push(...newIdeas);
		page.submitted = true;
		if (pages.every((p) => p.submitted)) {
			nextRound();
		}
	}
};
