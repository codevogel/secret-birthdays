import { BirthdayGenerationResultsSchema, BirthdayType } from '$lib/types/BirthdayGenerator';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const birthdayParam = url.searchParams.get('birthday');
	if (!birthdayParam) {
		return { birthdayGenerationResults: null };
	}

	try {
		const fetchUrl = new URL('/api/' + birthdayParam, url.origin);
		const searchParams = url.searchParams.getAll('type');
		for (const type of searchParams) {
			fetchUrl.searchParams.append('type', type);
		}
      console.log('Fetching birthday generation results from:', fetchUrl.toString());
		const res = await fetch(fetchUrl.toString());
		const data = await res.json();
		return { birthdayGenerationResults: BirthdayGenerationResultsSchema.parse(data) };
	} catch (err) {
		return { birthdayGenerationResults: null };
	}
};
