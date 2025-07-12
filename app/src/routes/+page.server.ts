import type { PageServerLoad } from './$types';
import type { BirthdayGenerationResult } from '$lib/types/BirthdayGenerator';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const birthdayParam = url.searchParams.get('birthday');
	if (!birthdayParam) {
		return { birthdayGenerationResult: null };
	}

	const birthdayGenerationResult: BirthdayGenerationResult = await fetch(
		'/api/binary/' + birthdayParam
	)
		.then((res) => res.json())
		.catch((err) => {
			console.error('Error fetching binary birthday data:', err);
			return { birthdayGenerationResult: null };
		});

	const processedData: BirthdayGenerationResult = {
		...birthdayGenerationResult,
		birthday: new Date(birthdayGenerationResult.birthday),
		birthdays: birthdayGenerationResult.birthdays.map((secretBirthday) => {
			return {
				date: new Date(secretBirthday.date),
				title: secretBirthday.title,
				description: secretBirthday.description
			};
		})
	};

	return { birthdayGenerationResult: processedData };
};
