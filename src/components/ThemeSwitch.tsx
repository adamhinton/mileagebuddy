"use client";

// README:
// This is the toggle icon between light and dark mode
// It works with the ThemeWrapper component in providers.tsx
// I got this from Dave at https://youtu.be/7zqI4qMDdg8, thanks Dave!

// Only using react-icons package for this item, so uninstall that package if you delete FISun and FIMoon
import { FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function ThemeSwitch() {
	const [mounted, setMounted] = useState(false);
	const { setTheme, resolvedTheme } = useTheme();

	useEffect(() => setMounted(true), []);

	if (!mounted)
		return (
			<Image
				// Just an empty image, it shows nothing until the theme is resolved
				// I do it this way so the other icons and content don't jump around when the theme is resolved
				src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
				width={36}
				height={36}
				sizes="36x36"
				alt="Loading Light/Dark Toggle"
				priority={false}
				title="Loading Light/Dark Toggle"
			/>
		);

	if (resolvedTheme === "dark") {
		return (
			<FiSun onClick={() => setTheme("light")} data-testid="theme-switch" />
		);
	}

	if (resolvedTheme === "light") {
		return (
			<FiMoon onClick={() => setTheme("dark")} data-testid="theme-switch" />
		);
	}
}
