"use client";

import Link from "next/link";

// ________________________________________________________________________
// This is tabs that handle internal navigation
// Has links to all internal pages
// Thanks to Flowbite, whom I shamelessly ripped this off from:
// https://flowbite.com/docs/components/tabs/
// This is toggleable. It's also collapsed by default on

// TODO tabs:
// -- Delineate this visually from Header.tsx
// -- Organize styling
// -- Unit tests
// -- Make it know which tab it's on (active tab)
// -- Don't refresh or do anything when clicking currently active tab
// Toggleable on mobile
// ________________________________________________________________________

const Tabs = () => {
	return (
		<section className="bg-background-elevated py-2 shadow-sm">
			<div className="container mx-auto px-4">
				<ul className="flex flex-wrap text-sm font-medium text-center text-neutral-text border-b border-primary-50 dark:border-primary-100/30">
					<li className="me-2">
						<Link
							href="/login"
							aria-current="page"
							className="inline-block p-3 bg-primary-50 text-primary rounded-t-lg border-b-2 border-primary dark:bg-primary-100/20 dark:border-primary-200"
						>
							Login
						</Link>
					</li>
					<li className="me-2">
						<Link
							href="/dashboard"
							className="inline-block p-3 rounded-t-lg hover:bg-background-highlight hover:text-primary transition-colors"
						>
							Dashboard
						</Link>
					</li>
					<li className="me-2">
						<Link
							href="/calculator"
							className="inline-block p-3 rounded-t-lg hover:bg-background-highlight hover:text-primary transition-colors"
						>
							Calculator
						</Link>
					</li>
					<li className="me-2">
						<Link
							href="/"
							className="inline-block p-3 rounded-t-lg hover:bg-background-highlight hover:text-primary transition-colors"
						>
							About
						</Link>
					</li>
				</ul>
			</div>
		</section>
	);
};

export default Tabs;
