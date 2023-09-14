import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Minesweeper",
	description: "Play minesweeper online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="h-screen select-none">
				<main>{children}</main>
			</body>
		</html>
	);
}
