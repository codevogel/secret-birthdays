import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {
	BirthdayType,
	createBirthdayGenerator,
	type BirthdayGenerationResult
} from '$lib/types/BirthdayGenerator';

export const GET: RequestHandler = async ({ url, params }) => {
	const birthday: Date = new Date(params.birthday!);
	if (isNaN(birthday.getTime())) {
		return json('Invalid birthday date format', { status: 400 });
	}

	const birthdayTypes: BirthdayType[] = url.searchParams.getAll('type') as BirthdayType[];
	const birthdayGenerationResults: BirthdayGenerationResult[] = birthdayTypes.map((type) =>
		createBirthdayGenerator(type, birthday).generate()
	);
	return json(birthdayGenerationResults);
};
