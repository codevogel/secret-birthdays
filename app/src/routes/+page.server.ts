import { BirthdayGenerationResultsSchema } from '$lib/types/BirthdayGenerator';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const birthdayParam = url.searchParams.get('birthday');
	if (!birthdayParam) {
		return { birthdayGenerationResults: null };
	}

	try {
		const fetchUrl = new URL('/api', url.origin);
      for (const [key, value] of url.searchParams.entries()) {
         fetchUrl.searchParams.set(key, value);
      }
      console.log('Fetching birthday generation results from:', fetchUrl.toString());
		const res = await fetch(fetchUrl.toString());
		const data = await res.json();
		return { birthdayGenerationResults: BirthdayGenerationResultsSchema.parse(data) };
	} catch (err) {
		return { birthdayGenerationResults: null };
	}
};
