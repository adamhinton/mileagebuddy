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
import tailwindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";

type Tab = {
	path: string;
	label: string;
};

/**Internal links to display in Tabs */
const myTabs: Tab[] = [
	{ path: "/login", label: "Login" },
	{ path: "/dashboard", label: "Dashboard" },
	{ path: "/calculator", label: "Calculator" },
	{ path: "/about", label: "About" },
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

	const navStyles = tailwindClassNames.navigation;

	return (
		// Sticky to top of page, except on mobile
		<section className={navStyles.TABS_CONTAINER}>
			<div className={navStyles.TABS_INNER}>
				<ul className={navStyles.TABS_LIST}>
					{myTabs.map((tab) => {
						// Hide the Dashboard tab for non-authenticated users
						if (tab.path === "/dashboard" && !isLoggedIn) {
							return null;
						}

						// Active tab is more visually distinct, and nothing happens when user clicks it
						const isActive = isActiveTab(tab.path);
						return (
							<li key={tab.path} className={navStyles.TABS_ITEM}>
								<Link
									href={tab.path}
									aria-current={isActive ? "page" : undefined}
									className={`${navStyles.TABS_LINK} ${
										isActive 
											? navStyles.TABS_LINK_ACTIVE 
											: navStyles.TABS_LINK_INACTIVE
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
