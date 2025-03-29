// _______________________________________________________________________________
// This is the hamburger dropdown icon for Header.tsx
// Note, this is just the icon, nothing else
// This only appears on mobile; on larger screen sizes the menu is always visible.
// _______________________________________________________________________________

import ThemeSwitch from "@/components/ThemeSwitch";

type MobileHamburgerMenuProps = {
	isMobileMenuOpen: boolean;
	setIsMobileMenuOpen: (isOpen: boolean) => void;
};

const MobileHamburgerMenu = (props: MobileHamburgerMenuProps) => {
	const { isMobileMenuOpen, setIsMobileMenuOpen } = props;

	return (
		<div className="sm:hidden flex items-center space-x-3">
			{/* ThemeSwitch is the dark/light mode toggle icon */}
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
	);
};

export default MobileHamburgerMenu;
