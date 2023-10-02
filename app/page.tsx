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
import { formatDuration } from "./lib/utils";
import DifficultySwitcher from "./components/DifficultySwitcher";
import Link from "next/link";

export default function Home() {
	const [msGameState, dispatch] = useImmerReducer(
		msReducer,
		newMsGame("MEDIUM")
	);
	const [highScore, setHighScore] = useLocalStorage<number | null>(
		"highScore",
		null
	);
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
		dispatch({ type: "new game", difficulty: msGameState.difficulty });
	}, [dispatch, msGameState.difficulty]);

	useEffect(() => {
		function handleKeydown(this: Window, event: KeyboardEvent) {
			switch (event.code) {
				case "KeyR": {
					newGame();
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
		<div className="flex h-screen items-stretch px-16">
			<div className="grid flex-1 place-items-center">
				<Board
					msGameState={msGameState}
					dispatch={dispatch}
					timeInMs={stopwatch.time}
				/>
			</div>

			<aside className="flex flex-col items-center gap-8 py-24">
				<DifficultySwitcher
					dispatch={dispatch}
					curDifficulty={msGameState.difficulty}
				/>

				<div className="flex items-center justify-center gap-4 text-xl font-semibold text-white">
					<div className="flex w-24 items-center gap-2">
						<Flag style={{ width: "3rem", height: "3rem" }} />{" "}
						{msGameState.flagsLeft}
					</div>
					<div
						className={clsx(
							"flex w-36 items-center gap-2",
							!stopwatch.isRunning && "text-white/40"
						)}
					>
						<Timer style={{ width: "3rem", height: "3rem" }} />{" "}
						{formatDuration(stopwatch.time)}
					</div>
				</div>

				<Link
					href={"/lb"}
					className="inline-block cursor-pointer pt-16 text-lg font-bold text-white underline underline-offset-4"
				>
					Leaderboard
				</Link>
				{(msGameState.stage === "won" ||
					msGameState.stage === "lost") && (
					<PostGameModal
						outcome={msGameState.stage}
						score={stopwatch.time}
						highScore={highScore}
						newGame={newGame}
					/>
				)}
			</aside>
		</div>
	);
}
