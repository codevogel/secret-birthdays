export function isBinaryNumber(str: string): boolean {
	return /^[01]+$/.test(str);
}

export function toBinaryString(num: number, pad?: number): string {
   return num.toString(2).padStart(pad ?? 0, '0');
}

