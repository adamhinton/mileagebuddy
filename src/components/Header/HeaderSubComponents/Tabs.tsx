"use client";

import Link from "next/link";

// ________________________________________________________________________
// This is tabs that handle internal navigation
// Has links to all internal pages

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
		<ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
			<li className="me-2">
				<Link
					href="/login"
					aria-current="page"
					className="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
				>
					Login
				</Link>
			</li>
			<li className="me-2">
				<Link
					href="/dashboard"
					className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
				>
					Dashboard
				</Link>
			</li>
			<li className="me-2">
				<Link
					href="/calculator"
					className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
				>
					Calculator
				</Link>
			</li>
			<li className="me-2">
				<Link
					href="/"
					className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
				>
					{/* TODO about page */}
					About
				</Link>
			</li>
			{/* Example of disabled */}
			{/* <li>
				<Link className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">
					Disabled
				</Link>
			</li> */}
		</ul>
	);
};

export default Tabs;
