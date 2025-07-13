import * as z from 'zod';
import { toBinaryString } from '$lib/util/binary';
import moment from 'moment';

export enum BirthdayType {
	Normal = 'Normal',
	Binary = 'Binary',
	Pi = 'Pi'
}

export const SecretBirthdaySchema = z.object({
	date: z.string().transform((date) => new Date(date)),
	title: z.string(),
	description: z.string().optional()
});

export type SecretBirthday = z.infer<typeof SecretBirthdaySchema>;

export const BirthdayGenerationResultSchema = z.object({
	birthday: z.string().transform((date) => new Date(date)),
	birthdayType: z.enum(Object.values(BirthdayType)),
	dayOffsets: z.array(z.number()),
	birthdays: z.array(SecretBirthdaySchema)
});

export const BirthdayGenerationResultsSchema = z.array(BirthdayGenerationResultSchema);

export type BirthdayGenerationResults = z.infer<typeof BirthdayGenerationResultsSchema>;

export type BirthdayGenerationResult = z.infer<typeof BirthdayGenerationResultSchema>;

abstract class BirthdayGenerator {
	protected birthday: Date;
	private depth: number;
	// Depth limit, as some birthday types may require a maximum depth to prevent Date overflow issues.
	abstract depthLimit: number;
	abstract birthdayType: BirthdayType;

	constructor(birthday: Date, depth: number = 100) {
		this.birthday = birthday;
		this.depth = depth;
	}

	abstract generateOffsetSequence(depth: number): number[];
	abstract getBirthdayDescription(index: number, offset: number): string;

	generate(): BirthdayGenerationResult {
		const dayOffsets: number[] = this.generateOffsetSequence(this.depth);
		const birthdays: SecretBirthday[] = dayOffsets.map((offset, i) => {
			return {
				date: moment(this.birthday).startOf('day').add(offset, 'days').toDate(),
				title: `${this.birthdayType} Birthday`,
				description: this.getBirthdayDescription(offset, i)
			};
		});

		return {
			birthday: this.birthday,
			birthdayType: this.birthdayType,
			dayOffsets: dayOffsets,
			birthdays: birthdays
		};
	}
}

export class BinaryBirthdayGenerator extends BirthdayGenerator {
	birthdayType = BirthdayType.Binary;
	depthLimit = 33;
	generateOffsetSequence(depth: number): number[] {
		const sequence: number[] = [...Array(Math.min(depth, this.depthLimit)).keys()];
		const binaryStrings = sequence.slice(1).map((num) => toBinaryString(num, 6));
		return binaryStrings.map((binary) => parseInt(binary));
	}
	getBirthdayDescription(offset: number, index: number): string {
		return `Turned ${index + 1} in ${this.birthdayType} Years. You are alive for ${offset} days on this date!`;
	}
}

export class PiBirthdayGenerator extends BirthdayGenerator {
	birthdayType = BirthdayType.Pi;
	depthLimit = 6;
	generateOffsetSequence(depth: number): number[] {
		const sequence: number[] = [...Array(Math.min(depth, this.depthLimit)).keys()];
		const pi = Math.PI.toString().replace('.', '');
		return sequence.map((num) => pi.slice(0, num + 1)).map(Number);
	}
	getBirthdayDescription(offset: number, index: number): string {
		return `Turned ${index + 1} in ${this.birthdayType} Years. You are alive for ${offset} days on this date!`;
	}
}

export class NormalBirthdayGenerator extends BirthdayGenerator {
	birthdayType = BirthdayType.Normal;
	depthLimit = 150;
	generateOffsetSequence(depth: number): number[] {
		const offsets: number[] = [];
		let birthdayMoment = moment(this.birthday).startOf('day');
		for (let i = 0; i < Math.min(depth, this.depthLimit); i++) {
			birthdayMoment = birthdayMoment.add(1, 'year');
			offsets.push(birthdayMoment.diff(moment(this.birthday).startOf('day'), 'days'));
		}
		return offsets;
	}
	getBirthdayDescription(offset: number, index: number): string {
		return `Turned ${index + 1} in Normal Years. You are alive for ${offset} days on this date!`;
	}
}

type BirthdayGeneratorFactory = (birthday: Date, depth?: number) => BirthdayGenerator;

const birthdayGenerators = new Map<BirthdayType, BirthdayGeneratorFactory>([
	[
		BirthdayType.Binary,
		(birthday: Date, depth?: number) => new BinaryBirthdayGenerator(birthday, depth)
	],
	[BirthdayType.Pi, (birthday: Date, depth?: number) => new PiBirthdayGenerator(birthday, depth)],
	[
		BirthdayType.Normal,
		(birthday: Date, depth?: number) => new NormalBirthdayGenerator(birthday, depth)
	]
]);

export function createBirthdayGenerator(
	type: BirthdayType,
	birthday: Date,
	depth?: number
): BirthdayGenerator {
	const factory = birthdayGenerators.get(type);
	if (!factory) {
		throw new Error(`Unknown birthday type: ${type}`);
	}
	return factory(birthday, depth);
}
