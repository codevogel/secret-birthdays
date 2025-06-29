export function getBinaryStringsRange(nInclusive: number): string[] {
	const binaryStrings: string[] = [];
	for (let i = 0; i <= nInclusive; i++) {
		const binaryString = i.toString(2);
		const paddedBinaryString = binaryString.padStart(8, '0');
		binaryStrings.push(paddedBinaryString);
	}
	return binaryStrings;
}

export function stringIsBinaryNumber(str: string): boolean {
	return /^[01]+$/.test(str);
}

export function numToBinaryString(num: number, padLength: number = 8): string {
	if (num < 0) {
		throw new Error(
			"Negative numbers cannot be converted to binary strings. (Two's complement not supported.)"
		);
	}
	const binaryString = num.toString(2);
	return binaryString.padStart(padLength, '0');
}

export function splitBinaryStringInZeroesAndRest(binaryString: string): {
	zeroes: string;
	rest: string;
} {
	const indexOfFirstOne = binaryString.indexOf('1');
	if (indexOfFirstOne === -1) {
		return { zeroes: binaryString, rest: '' };
	}
	return {
		zeroes: binaryString.slice(0, indexOfFirstOne),
		rest: binaryString.slice(indexOfFirstOne)
	};
}

export function getNextBase10WithOnlyBinaryDigits(num: number): number {
   num++;
   while (!stringIsBinaryNumber(num.toString())) {
      num++;
   }
   return num;
}

export function getPreviousBase10WithOnlyBinaryDigits(num: number): number {
   num--;
   while (num >= 0 && !stringIsBinaryNumber(num.toString())) {
      num--;
   }
   return num
}

