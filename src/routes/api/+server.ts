import { produce } from 'sveltekit-sse';

import { currentRound, pages } from '$lib/data';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = () => {
	return produce(async function start({ emit }) {
		const cancelRoundSubscription = currentRound.subscribe((n) => emit('round', `${n}`));
		const cancelPagesSubscription = pages.subscribe((ps) => emit('pages', JSON.stringify(ps)));
		return function cancel() {
			// TODO: remove user, but not if just submitted
			cancelRoundSubscription();
			cancelPagesSubscription();
		};
	});
};
