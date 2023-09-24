"use client";

import { Flag, Timer } from "@mui/icons-material";
import { clsx } from "clsx";
import { useCallback, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import useLocalStorage from "use-local-storage";
import Board from "./components/Board";
import PostGameModal from "./components/PostGameModal";
import { msReducer, newMsGame } from "./lib/minesweeper";
import { useStopwatch } from "./lib/stopwatch";
import { formatTime } from "./lib/utils";

export default function Home() {
	const [msGameState, dispatch] = useImmerReducer(msReducer, newMsGame());
	const [highScore, setHighScore] = useLocalStorage<number | null>("highScore", null);
	const stopwatch = useStopwatch();

	useEffect(() => {
		switch (msGameState.stage) {
			case "start":
				stopwatch.reset();
				break;
			case "playing":
				stopwatch.start();
				break;
			case "won":
				stopwatch.stop();
				setHighScore(Math.min(highScore ?? Infinity, stopwatch.time));
				break;
			case "lost":
				stopwatch.stop();
				break;
		}
	}, [msGameState.stage, stopwatch, highScore, setHighScore]);

	const newGame = useCallback(() => {
		dispatch({ type: "new game" });
	}, [dispatch]);

	useEffect(() => {
		function handleKeydown(this: Window, event: KeyboardEvent) {
			switch (event.code) {
				case "KeyR": {
					newGame();
					break;
				}
				case "KeyD": {
					dispatchEvent(new MouseEvent("mousedown", { button: 0, bubbles: true, cancelable: true }));
					break;
				}
				case "KeyF": {
					dispatchEvent(new MouseEvent("mousedown", { button: 2, bubbles: true, cancelable: true }));
					break;
				}
			}
		}

		function handleMouseDown(this: Window, event: MouseEvent) {
			console.log(event.button);
		}

		window.addEventListener("keydown", handleKeydown);
		window.addEventListener("mousedown", handleMouseDown);
		return () => {
			window.removeEventListener("keydown", handleKeydown);
			window.removeEventListener("mousedown", handleMouseDown);
		};
	}, [newGame]);

	return (
		<div className="flex items-stretch">
			<Board msGameState={msGameState} dispatch={dispatch} />

			<aside className="flex-1 bg-green-800">
				<div className="mx-auto max-w-lg p-4">
					<div className="flex items-center justify-center gap-20 py-24 text-3xl font-semibold text-white">
						<div className="flex w-28 items-center gap-2">
							<Flag style={{ width: "3rem", height: "3rem" }} /> {msGameState.flagsLeft}
						</div>
						<div className={clsx("flex w-32 items-center gap-2", !stopwatch.isRunning && "text-white/40")}>
							<Timer style={{ width: "3rem", height: "3rem" }} /> {formatTime(stopwatch.time)}
						</div>
					</div>
					{(msGameState.stage === "won" || msGameState.stage === "lost") && (
						<PostGameModal
							outcome={msGameState.stage}
							score={stopwatch.time}
							highScore={highScore}
							newGame={newGame}
						/>
					)}
				</div>
			</aside>
		</div>
	);
}
