import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				/* Primary color: Soft blue */
				primary: {
					50: "hsl(var(--primary-50))",
					100: "hsl(var(--primary-100))",
					200: "hsl(var(--primary-200))",
					DEFAULT: "hsl(var(--primary))",
				},
				/* Secondary color: Soft orange */
				secondary: {
					50: "hsl(var(--secondary-50))",
					100: "hsl(var(--secondary-100))",
					200: "hsl(var(--secondary-200))",
					DEFAULT: "hsl(var(--secondary))",
				},
				/* Accent color: Soft green */
				accent: {
					50: "hsl(var(--accent-50))",
					100: "hsl(var(--accent-100))",
					200: "hsl(var(--accent-200))",
					DEFAULT: "hsl(var(--accent))",
				},
				/* Neutral color: Light gray background */
				neutral: {
					DEFAULT: "hsl(var(--neutral))",
				},
				"neutral-text": {
					DEFAULT: "hsl(var(--neutral-text))",
				},
				/* Background color: Very soft blue */
				background: {
					DEFAULT: "hsl(var(--background))",
					component: "hsl(var(--background-component))", // Different background for components
				},
				foreground: {
					DEFAULT: "hsl(var(--foreground))",
				},
			},
		},
	},
	plugins: [],
	darkMode: "class",
} satisfies Config;
