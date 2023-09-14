import { useState, useEffect } from "react";

// Custom stopwatch hook
export function useStopwatch() {
	const [isRunning, setIsRunning] = useState(false);
	const [time, setTime] = useState(0);

	useEffect(() => {
		let interval: any;

		if (isRunning) {
			interval = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 1000);
		} else {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [isRunning]);

	const start = () => {
		setIsRunning(true);
	};

	const stop = () => {
		setIsRunning(false);
	};

	const reset = () => {
		setTime(0);
		setIsRunning(false);
	};

	return { time, isRunning, start, stop, reset };
}
