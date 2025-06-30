import moment from 'moment';

export function getDateSince(start: Date, daysSince: number): Date {
	return moment(start).startOf('day').add(daysSince, 'days').toDate();
}

export function daysToYears(days: number): number {
	return moment.duration(days, 'days').asYears();
}

export function toLegibleDate(date: Date): string {
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function daysSince(date: Date): number {
	return moment().startOf('day').diff(moment(date).startOf('day'), 'days');
}

export function daysDiff(from: Date, to: Date) {
	return moment(to).startOf('day').diff(moment(from).startOf('day'), 'days', true);
}

export function addDays(date: Date, days: number): Date {
	return moment(date).startOf('day').add(days, 'days').toDate();
}

export function subtractDays(date: Date, days: number): Date {
	return moment(date).startOf('day').subtract(days, 'days').toDate();
}
