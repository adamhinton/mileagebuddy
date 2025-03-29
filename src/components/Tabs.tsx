"use client";

// ________________________________________________________________________
// This is tabs that handle internal navigation
// Has links to all internal pages
// Thanks to Flowbite, whom I shamelessly ripped this off from:
// https://flowbite.com/docs/components/tabs/
// This is toggleable. It's also collapsed by default on mobile
// It's sticky to the top of the page except on mobile
// Active tabs: It knows which tab the user is currently on; that tab is more visually distinct, and nothing happens when user clicks it.

// TODO tabs:
// -- Organize styling
// -- Unit tests
// -- Toggleable; collapsed by default on mobile
// ________________________________________________________________________

import Link from "next/link";
import { usePathname } from "next/navigation";

const Tabs = () => {
	const pathname = usePathname();

	const isActiveTab = (path: string): boolean => {
		return pathname === path;
	};

	return (
		// Sticky to top of page, except on mobile
		<section className="md:sticky md:top-0 md:z-30 bg-background-header shadow-md">
			<div className="container mx-auto px-4">
				<ul className="flex flex-wrap text-sm font-medium text-center text-neutral-text border-b-2 border-primary-50 dark:border-primary-100/30">
					{[
						{ path: "/login", label: "Login" },
						{ path: "/dashboard", label: "Dashboard" },
						{ path: "/calculator", label: "Calculator" },
						{ path: "/", label: "About" },
					].map((tab) => {
						// Active tab is more visually distinct, and nothing happens when user clicks it
						const active = isActiveTab(tab.path);
						return (
							<li key={tab.path} className="me-2">
								<Link
									href={tab.path}
									aria-current={active ? "page" : undefined}
									className={`inline-block p-4 rounded-t-lg ${
										active
											? "bg-primary-50 text-primary font-semibold border-b-2 border-primary dark:bg-primary-100/20 dark:border-primary-200"
											: "hover:bg-background-highlight hover:text-primary transition-colors"
									}`}
									onClick={(e) => {
										if (active) {
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
