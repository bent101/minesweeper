import { useState, useEffect, useRef } from "react";

// Custom stopwatch hook
export function useStopwatch() {
	const [time, setTime] = useState(0);
	const [isRunning, setIsRunning] = useState(false);

	const intervalRef = useRef<any>(null);

	function start() {
		if (isRunning) return;

		setIsRunning(true);
		intervalRef.current = setInterval(() => {
			setTime((prevTime) => prevTime + 100);
		}, 100);
	}

	function stop() {
		if (!isRunning) return;

		setIsRunning(false);
		clearInterval(intervalRef.current);
	}

	function reset() {
		stop();
		setTime(0);
	}

	// stop on dismount to prevent a memory leak
	useEffect(() => {
		return stop;
	}, []);

	return { time, isRunning, start, stop, reset };
}
