import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	// These aren't accessed directly in the code, but are used in the ... build process, or whatever.
	theme: {
		extend: {
			colors: {
				primary: "hsl(var(--primary))",
				secondary: "hsl(var(--secondary))",
				accent: "hsl(var(--accent))",
				neutral: "hsl(var(--neutral))",
				"neutral-text": "hsl(var(--neutral-text))",
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
		},
	},
	plugins: [],
	darkMode: "class",
} satisfies Config;
