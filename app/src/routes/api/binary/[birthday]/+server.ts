import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { BinaryBirthdayGenerator, PiBirthdayGenerator } from '$lib/types/BirthdayGenerator';

export const GET: RequestHandler = async ({ params }) => {
	const YYYY_MM_DD_REGEX: RegExp = /^\d{4}-\d{2}-(0[1-9]|1[0-2])$/;
	const birthdayParam: string = params.birthday!;

	if (!YYYY_MM_DD_REGEX.test(birthdayParam)) {
		return json({ error: 'Invalid date format. Expected format: YYYY-MM-DD' });
	}

	const birthday = new Date(birthdayParam);
	const binaryBirthdayGenerator = new BinaryBirthdayGenerator(birthday, 32 + 1);
	const piBirthdayGenerator = new PiBirthdayGenerator(birthday, 5 + 1);

	console.log(piBirthdayGenerator.generate());
	return json(binaryBirthdayGenerator.generate());
};
