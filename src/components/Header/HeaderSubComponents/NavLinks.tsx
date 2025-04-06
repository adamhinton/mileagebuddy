// ____________________________________________________________________________
// This is the nav menu for Header.tsx
// ____________________________________________________________________________

import Link from "next/link";

/**Navigation links in Header.tsx */
const NavLinks = () => {
	return (
		<nav className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 w-full sm:w-auto">
			<Link
				href="https://www.linkedin.com/in/adam-hinton/"
				className="nav-link w-full sm:w-auto text-center"
				target="_blank"
			>
				Adam Hinton
			</Link>
			<Link
				href="/calculator"
				className="nav-link w-full sm:w-auto text-center"
			>
				Calculator
			</Link>
			<Link
				href="https://github.com/adamhinton/mileagebuddy/"
				className="nav-link-primary w-full sm:w-auto text-center"
			>
				Source
			</Link>
		</nav>
	);
};

export default NavLinks;
