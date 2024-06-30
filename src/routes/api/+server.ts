import { produce } from 'sveltekit-sse';

import { currentRound, pages } from '$lib/data';

export const POST = () => {
  return produce(async function start({ emit }) {
    const rs = currentRound.subscribe((n) => emit('round', `${n}`));
    const ps = pages.subscribe((ps) => emit('pages', JSON.stringify(ps)));
    return function cancel() {
      rs();
      ps();
    };
  });
};
