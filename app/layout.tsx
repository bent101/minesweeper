import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Minesweeper",
	description: "Play minesweeper online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta name="darkreader-lock" />
			</head>
			<body className="h-screen select-none">{children}</body>
		</html>
	);
}
