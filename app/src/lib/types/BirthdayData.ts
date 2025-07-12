export interface BirthdayData {
		birthday: Date,
		dayOffsets: number[],
		birthdays: Date[],
}

export interface BinaryBirthdayData extends BirthdayData {
      binaryStrings: string[],
}
