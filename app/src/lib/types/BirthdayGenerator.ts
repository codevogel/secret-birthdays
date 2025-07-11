import { toBinaryString } from '$lib/util/binary';
import moment from 'moment';

export type BirthdayType = 'Binary' | 'Pi';

export interface BirthdayGenerationResult {
	birthday: Date;
	birthdayType: BirthdayType;
	dayOffsets: number[];
	birthdays: SecretBirthday[];
}

export interface SecretBirthday {
	date: Date;
	title: string;
	description?: string;
}

abstract class BirthdayGenerator {
	private birthday: Date;
	private depth: number;
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
            description: this.getBirthdayDescription(offset, i),
			};
		});

		return {
			birthday: this.birthday,
			birthdayType: this.birthdayType,
			dayOffsets: dayOffsets,
			birthdays: birthdays,
		};
	}
}

export class BinaryBirthdayGenerator extends BirthdayGenerator {
	birthdayType: BirthdayType = 'Binary';
	generateOffsetSequence(depth: number): number[] {
		const sequence: number[] = [...Array(depth).keys()];
		const binaryStrings = sequence.map((num) => toBinaryString(num, 6));
		return binaryStrings.map((binary) => parseInt(binary));
	}
   getBirthdayDescription(offset: number, index: number): string {
      return `Turned ${index} in ${this.birthdayType} Years. You are alive for ${offset} days on this date!`;
   }
}

export class PiBirthdayGenerator extends BirthdayGenerator {
	birthdayType: BirthdayType = 'Pi';
	generateOffsetSequence(depth: number): number[] {
		const sequence: number[] = [...Array(depth).keys()];
		const pi = Math.PI.toString().replace('.', '');
		return sequence.map((num) => pi.slice(0, num + 1)).map(Number);
	}
   getBirthdayDescription(index: number, offset: number): string {
      return `Turned ${index} in ${this.birthdayType} Years. You are alive for ${offset} days on this date!`; 
   }
}
