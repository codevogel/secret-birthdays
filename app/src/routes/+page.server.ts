import type { PageServerLoad } from './$types';
import type { BinaryBirthdayData } from '$lib/types/birthdayData';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const birthdayParam = url.searchParams.get('birthday');
	if (!birthdayParam) {
		return { binaryBirthdayData: null };
	}

	const binaryBirthdayData: BinaryBirthdayData = await fetch('/api/binary/' + birthdayParam)
		.then((res) => res.json())
		.catch((err) => {
			console.error('Error fetching birthdays:', err);
			return { binaryBirthdayData: null };
		});

	console.log('binaryBirthdayData in +page.server.ts:', binaryBirthdayData);

	const processedData: BinaryBirthdayData = {
		...binaryBirthdayData,
		birthday: new Date(binaryBirthdayData.birthday),
		birthdays: binaryBirthdayData.birthdays.map((birthday) => new Date(birthday))
	};

	return { binaryBirthdayData: processedData };
};
