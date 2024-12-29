// README
// This is the ThemeWrapper, wraps around the app to provide dark theming
// This uses next/themes package
// It purports to work with RSC, we'll find out if that's true
// I got this from Dave at https://youtu.be/7zqI4qMDdg8. Thanks Dave!

"use client";

import { ThemeProvider } from "next-themes";

/**
 * ThemeWrapper is the dark/light theme wrapper
 */
export function ThemeWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
		</ThemeProvider>
	);
}
