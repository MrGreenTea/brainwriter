import { pages } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    pages
  };
};
