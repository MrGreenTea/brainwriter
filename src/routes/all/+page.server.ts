import { pages } from '$lib/data';
import { get } from 'svelte/store';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		pages: get(pages)
	};
};
