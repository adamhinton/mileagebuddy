"use client";

// ________________________________________________________________________
// This is tabs that handle internal navigation
// Has links to all internal pages
// Thanks to Flowbite, whom I shamelessly ripped this off from:
// https://flowbite.com/docs/components/tabs/
// It's sticky to the top of the page except on mobile
// Active tabs: It knows which tab the user is currently on; that tab is more visually distinct, and nothing happens when user clicks it.
// Testing: See Tabs.test.tsx
// Doesn't show Dashboard tab if user isn't logged in

// TODO Stretch tabs:
// -- Organize styling
// ________________________________________________________________________

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../redux/hooks";

type Tab = {
	path: string;
	label: string;
};

/**Internal links to display in Tabs */
const myTabs: Tab[] = [
	{ path: "/login", label: "Login" },
	{ path: "/dashboard", label: "Dashboard" },
	{ path: "/calculator", label: "Calculator" },
	{ path: "/", label: "About" },
];

const Tabs = () => {
	const pathname = usePathname();
	// We don't show the Dashboard tab if user isn't logged in
	const user = useAppSelector((state) => state.user.value);
	const isLoggedIn = !!user?.id;

	/**Determine whether a given tab is the page the user is currently on */
	const isActiveTab = (path: string): boolean => {
		return pathname === path;
	};

	return (
		// Sticky to top of page, except on mobile
		<section className="md:sticky md:top-0 md:z-30 bg-background-header shadow-md">
			<div className="container mx-auto px-2 sm:px-4">
				<ul className="flex flex-wrap text-xs sm:text-sm font-medium text-center text-neutral-text border-b-2 border-primary-50 dark:border-primary-100/30">
					{myTabs.map((tab) => {
						// Hide the Dashboard tab for non-authenticated users
						if (tab.path === "/dashboard" && !isLoggedIn) {
							return null;
						}

						// Active tab is more visually distinct, and nothing happens when user clicks it
						const isActive = isActiveTab(tab.path);
						return (
							<li key={tab.path} className="me-1 sm:me-2">
								<Link
									href={tab.path}
									aria-current={isActive ? "page" : undefined}
									className={`inline-block p-2 sm:p-3 md:p-4 rounded-t-lg ${
										isActive
											? "bg-primary-50 text-primary font-semibold border-b-2 border-primary dark:bg-primary-100/20 dark:border-primary-200"
											: "hover:bg-background-highlight hover:text-primary transition-colors"
									}`}
									onClick={(e) => {
										if (isActive) {
											// Nothing happens because user is already on the active tab
											e.preventDefault();
										}
									}}
								>
									{tab.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
};

export default Tabs;
