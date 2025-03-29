"use client";

import React, { useState, useRef, useEffect, RefObject } from "react";
import Link from "next/link";
import ThemeSwitch from "../ThemeSwitch";
import { createClientCSROnly } from "@/app/utils/server/supabase/client";
import { useAppSelector } from "@/redux/hooks";
import ProfileDropdown from "./HeaderSubComponents/ProfileDropdown";
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

					{/* Mobile menu hamburger button */}
					<div className="sm:hidden flex items-center space-x-3">
						<ThemeSwitch />
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="p-2 rounded-md text-neutral-text hover:bg-background-highlight"
							aria-label="Toggle mobile menu"
						>
							{isMobileMenuOpen ? (
								// X icon for close
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								// Hamburger icon
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>
					</div>
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

					{/* Main navigation */}
					<nav className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 w-full sm:w-auto">
						<Link
							href="/dashboard"
							className="nav-link w-full sm:w-auto text-center"
						>
							Dashboard
						</Link>
						<Link
							href="/calculator"
							className="nav-link w-full sm:w-auto text-center"
						>
							Calculator
						</Link>
						{!isLoggedIn && (
							<Link
								href="/login"
								className="nav-link-primary w-full sm:w-auto text-center"
							>
								Login
							</Link>
						)}
					</nav>

					{/* Dark/light mode toggle icon */}
					<div className="hidden sm:block">
						<ThemeSwitch />
					</div>
				</div>
			</div>
		</header>
	);
};
