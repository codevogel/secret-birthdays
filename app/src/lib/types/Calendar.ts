export interface CalendarEvent {
	date: Date;
	title: string;
	description?: string;
}

export class EventCalendar {
	private events: CalendarEvent[];
	private eventsByDate: Map<string, CalendarEvent[]> = new Map();
	private eventsByMonth: Map<string, CalendarEvent[]> = new Map();
	private eventsByYear: Map<string, CalendarEvent[]> = new Map();

	constructor(events: CalendarEvent[] = []) {
		this.events = [];
		events.forEach((e) => this.addEvent(e));
	}

	addEvent(event: CalendarEvent): void {
		this.events.push(event);
		this.addToMap(
			this.eventsByDate,
			`${event.date.getDate()}-${event.date.getMonth()}-${event.date.getFullYear()}`,
			event
		);
		this.addToMap(
			this.eventsByMonth,
			`${event.date.getMonth()}-${event.date.getFullYear()}`,
			event
		);
		this.addToMap(this.eventsByYear, `${event.date.getFullYear()}`, event);
	}

	private addToMap(eventsByDate: Map<string, CalendarEvent[]>, key: string, event: CalendarEvent) {
		if (!eventsByDate.has(key)) {
			eventsByDate.set(key, []);
		}
		eventsByDate.get(key)?.push(event);
	}

	getEventsByDate(date: number, month: number, year: number) {
		return this.eventsByDate.get(`${date}-${month}-${year}`);
	}

	getEventsByMonth(month: number, year: number) {
		return this.eventsByMonth.get(`${month}-${year}`);
	}

	getEventsByYear(year: number) {
		return this.eventsByYear.get(`${year}`);
	}

	getAllEvents(): CalendarEvent[] {
		return this.events;
	}
}
