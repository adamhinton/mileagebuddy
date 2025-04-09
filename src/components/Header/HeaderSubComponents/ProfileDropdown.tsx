// ____________________________________________________________________
// This is the dropdown that appears when user clicks their profile icon in Header.tsx
// ____________________________________________________________________

import { type User } from "@/app/zod/schemas/UserSchema";

type ProfileDropdownProps = {
	user: User;
	isProfileDropdownOpen: boolean;
	setIsProfileDropdownOpen: (isOpen: boolean) => void;
	handleSignOut: () => void;
	profileDropdownRef: React.RefObject<HTMLDivElement>;
};

const ProfileDropdown = (props: ProfileDropdownProps) => {
	const {
		user,
		isProfileDropdownOpen,
		setIsProfileDropdownOpen,
		handleSignOut,
		profileDropdownRef,
	} = props;

	return (
		<div className="relative" ref={profileDropdownRef}>
			{/* Profile button - Icon on small screens, full text on md+ screens */}
			<button
				onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
				className="flex items-center px-3 py-1 bg-background-elevated rounded-full text-sm text-neutral-text border border-primary-50 dark:border-primary-200 hover:bg-background-highlight transition-colors"
			>
				{/* Always visible profile icon */}
				<div className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse"></div>

				{/* TODO replace with profile icon */}
				<span className="hidden sm:inline" data-testid="profile-icon">
					Profile
				</span>

				{/* Dropdown indicator */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4 ml-2"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{/* Profile dropdown menu */}
			{isProfileDropdownOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-background-elevated rounded-md shadow-lg border border-primary-50 dark:border-primary-200 z-40">
					<div className="p-2">
						<div className="text-sm font-medium text-neutral-text mb-2 border-b border-primary-50 dark:border-primary-200 pb-2">
							{user?.email}
						</div>
						<button
							onClick={handleSignOut}
							className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
						>
							Sign Out
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfileDropdown;
