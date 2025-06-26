import moment from "moment";

export function getDateSince(start: Date, daysSince: number): Date {
	return moment(start).add(daysSince, 'days').toDate();
}

export function daysToYears(days: number): number {
   return moment.duration(days, 'days').asYears();
}
