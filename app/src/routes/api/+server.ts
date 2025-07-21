import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {
	BirthdayType,
	createBirthdayGenerator,
	type BirthdayGenerationResult
} from '$lib/types/BirthdayGenerator';

export const GET: RequestHandler = async ({ url }) => {
   console.log('GET request received for birthday generation');
   const birthdayParam = url.searchParams.get('birthday');
	const birthday: Date | null =  birthdayParam ? new Date(birthdayParam) : null;
	if (!birthday) {
		return json('No valid birthday provided', { status: 400 });
	}

	const birthdayTypes: BirthdayType[] = url.searchParams.get('types')?.split(',') as BirthdayType[] ?? [];
	const birthdayGenerationResults: BirthdayGenerationResult[] = birthdayTypes.map((type) =>
		createBirthdayGenerator(type, birthday).generate()
	);
	return json(birthdayGenerationResults);
};
