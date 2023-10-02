export function getIndexedNeighbors<T>(arr: T[][], r: number, c: number) {
	if (r < 0 || r >= arr.length || c < 0 || c >= arr[0].length) return [];
	const ret = [];
	for (let dr = -1; dr <= 1; dr++) {
		for (let dc = -1; dc <= 1; dc++) {
			if (dr === 0 && dc === 0) continue;
			const nr = r + dr;
			const nc = c + dc;
			if (nr >= 0 && nr < arr.length && nc >= 0 && nc < arr[0].length) ret.push({ val: arr[nr][nc], nr, nc });
		}
	}
	return ret;
}

export function getNeighbors<T>(arr: T[][], r: number, c: number) {
	return getIndexedNeighbors(arr, r, c).map(({ val }) => val);
}

/**
 * shuffles `array` in place
 */
export function shuffledArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i (inclusive).

		// Swap elements at i and j.
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array;
}

export function formatDuration(timeInMs: number) {
	const formattedDuration = new Intl.DateTimeFormat("en-US", {
		minute: "2-digit",
		second: "2-digit",
		fractionalSecondDigits: 1,
		timeZone: "UTC",
	}).format(new Date(timeInMs));

	return formattedDuration;
}

// Example usage:
const durationInMilliseconds = 125432;
const formattedDuration = formatDuration(durationInMilliseconds);
console.log(formattedDuration); // Output: "02:05.432"
