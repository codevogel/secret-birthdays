import { toBinaryString } from '$lib/util/binary';
import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import moment from 'moment';

export const GET: RequestHandler = async ({ params }) => {
	const YYYY_MM_DD_REGEX: RegExp = /^\d{4}-\d{2}-(0[1-9]|1[0-2])$/;
	const birthdayParam: string = params.birthday!;

	if (!YYYY_MM_DD_REGEX.test(birthdayParam)) {
		throw error(400, 'Invalid date format. Expected format: YYYY-MM-DD');
	}

	const birthday = new Date(birthdayParam);

	const sequence: number[] = [...Array(33).keys()];
	const binaryStrings = sequence.map((num) => toBinaryString(num, 6));
	const dayOffsets = binaryStrings.map((binary) => parseInt(binary));
	const birthdays = dayOffsets.map((num) => {
		return moment(birthday).startOf('day').add(num, 'days').toDate();
	});

	return json({
		birthday,
		dayOffsets,
		birthdays,
		binaryStrings
	});
};
