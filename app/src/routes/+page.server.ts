import { BirthdayGenerationResultSchema } from '$lib/types/BirthdayGenerator';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const birthdayParam = url.searchParams.get('birthday');
	if (!birthdayParam) {
		return { birthdayGenerationResult: null };
	}

	const jsonResponse = await fetch('/api/' + birthdayParam)
		.then((res) => res.json())
		.catch((err) => {
			console.error('Error fetching binary birthday data:', err);
			return { birthdayGenerationResult: null };
		});

	return { birthdayGenerationResult: BirthdayGenerationResultSchema.parse(jsonResponse) };
};
