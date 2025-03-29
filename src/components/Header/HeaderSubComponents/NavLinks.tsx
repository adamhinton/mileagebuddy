// ____________________________________________________________________________
// This is the nav menu for Header.tsx
// TODO tabs
// ____________________________________________________________________________

import Link from "next/link";

type NavLinksProps = {
	isLoggedIn: boolean;
};

/**Navigation links in Header.tsx */
const NavLinks = (props: NavLinksProps) => {
	const { isLoggedIn } = props;

	return (
		<nav className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 w-full sm:w-auto">
			<Link href="/dashboard" className="nav-link w-full sm:w-auto text-center">
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
	);
};

export default NavLinks;
