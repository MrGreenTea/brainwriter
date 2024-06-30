import { produce } from 'sveltekit-sse';

import { currentRound, getSessionId, pages } from '$lib/data';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ cookies }) => {
	const sessionId = getSessionId(cookies);

	return produce(async function start({ emit }) {
		const rs = currentRound.subscribe((n) => emit('round', `${n}`));
		const ps = pages.subscribe((ps) => emit('pages', JSON.stringify(ps)));
		return function cancel() {
			pages.update((ps) => ps.filter((p) => p.sessionId !== sessionId));
			rs();
			ps();
		};
	});
};
