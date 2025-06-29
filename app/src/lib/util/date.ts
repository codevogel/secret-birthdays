import moment from 'moment';

export function getDateSince(start: Date, daysSince: number): Date {
	return moment(start).add(daysSince, 'days').toDate();
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
   return moment().diff(moment(date), 'days');
}

export function addDays(date: Date, days: number): Date {
   return moment(date).add(days, 'days').toDate();
}

export function subtractDays(date: Date, days: number): Date {
   return moment(date).subtract(days, 'days').toDate();
}
