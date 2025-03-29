// ______________________________________________________________________________
// This is (obviously) the main Header.
// // It contains the logo, title, navigation links, dark mode toggle (ThemeSwitch) and auth buttons (login/logout)
// It's split up in to several sub-components
// TODO tabs for internal navigation
// TODO stretch: Put these class names in tailwindClassNames.ts
// ______________________________________________________________________________

"use client";

import React, { useState, useRef, useEffect, RefObject } from "react";
import Link from "next/link";
import ThemeSwitch from "../ThemeSwitch";
import { createClientCSROnly } from "@/app/utils/server/supabase/client";
import { useAppSelector } from "@/redux/hooks";
import ProfileDropdown from "./HeaderSubComponents/ProfileDropdown";
import NavLinks from "./HeaderSubComponents/NavLinks";
import MobileHamburgerMenu from "./HeaderSubComponents/MobileHamburgerMenu";
import Tabs from "./HeaderSubComponents/Tabs";
// TODO header.test

export const Header: React.FC = () => {
	const user = useAppSelector((state) => state.user.value);
	const isLoggedIn = user?.id ? true : false;
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
	const profileDropdownRef = useRef<HTMLDivElement>(null);

	const handleSignOut = async () => {
		const supabase = createClientCSROnly();
		// Also triggers redux store to update via <AuthWatcher/>
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Error logging out:", error.message);
		}
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileDropdownRef.current &&
				!profileDropdownRef.current.contains(event.target as Node)
			) {
				setIsProfileDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className="bg-background-header border-b border-primary-100 dark:border-primary-200 shadow-sm">
			<div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
				{/* Logo and title section */}
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center space-x-2 group">
						<span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
							MileageBuddy
						</span>
						<span className="hidden md:inline-block text-sm text-neutral-text opacity-70 group-hover:opacity-100 transition-opacity">
							True car cost calculator
						</span>
					</Link>

					{/* Mobile menu hamburger button. Hidden on large screen sizes */}
					<MobileHamburgerMenu
						isMobileMenuOpen={isMobileMenuOpen}
						setIsMobileMenuOpen={setIsMobileMenuOpen}
					/>
				</div>

				{/* Navigation and auth section - visible on larger screens or when mobile menu is open */}
				<div
					className={`${isMobileMenuOpen ? "flex" : "hidden"} sm:flex flex-col sm:flex-row items-center mt-4 sm:mt-0 space-y-3 sm:space-y-0 sm:space-x-6`}
				>
					{isLoggedIn && (
						// Simple Profile dropdown (obviously) that shows user's email and a signout button
						<ProfileDropdown
							user={user!}
							isProfileDropdownOpen={isProfileDropdownOpen}
							setIsProfileDropdownOpen={setIsProfileDropdownOpen}
							handleSignOut={handleSignOut}
							profileDropdownRef={
								profileDropdownRef as unknown as RefObject<HTMLDivElement>
							}
						/>
					)}

					{/* Main navigation*/}
					<NavLinks />

					{/* Dark/light mode toggle icon */}
					<div className="hidden sm:block">
						<ThemeSwitch />
					</div>
				</div>
			</div>

			<Tabs />
		</header>
	);
};
