import { produce } from 'sveltekit-sse';

import { currentRound, pages, getPage, getSessionId } from '$lib/data';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ cookies }) => {
	// HACK: fix asap
	const sessionId = getSessionId(cookies);
	try {
		getPage(sessionId).connected = true;
		pages.update((ps) => [...ps]);
	} catch (e) {
		console.error(e);
	}
	return produce(async function start({ emit }) {
		const cancelRoundSubscription = currentRound.subscribe((n) => emit('round', `${n}`));
		const cancelPagesSubscription = pages.subscribe((ps) => emit('pages', JSON.stringify(ps)));
		return function cancel() {
			// TODO: remove user, but not if just submitted
			cancelRoundSubscription();
			cancelPagesSubscription();
			try {
				getPage(sessionId).connected = false;
				pages.update((ps) => [...ps]);
			} catch (e) {
				console.error(e);
			}
		};
	});
};
