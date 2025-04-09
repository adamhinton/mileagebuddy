// ___________________________________________________________________________
// This is the ToC for the About page at /about
// Styled to match the conventions in globals.css and related files
// ___________________________________________________________________________

import Link from "next/link";

const TableOfContents = () => {
	return (
		<nav className="bg-background-elevated p-4 rounded-lg shadow-sm">
			<h2 className="text-lg font-bold text-primary mb-4">Table of Contents</h2>
			<ul className="space-y-3">
				{/* Introduction */}
				<li>
					<Link
						href="#introduction"
						className="flex items-center gap-2 text-neutral-text hover:text-primary transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-5 h-5 text-primary"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						<span>Introduction</span>
					</Link>
				</li>

				{/* Benefits */}
				<li>
					<Link
						href="#benefits"
						className="flex items-center gap-2 text-neutral-text hover:text-primary transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-5 h-5 text-secondary"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>Benefits</span>
					</Link>
				</li>

				{/* How It Works */}
				<li>
					<Link
						href="#how-it-works"
						className="flex items-center gap-2 text-neutral-text hover:text-primary transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-5 h-5 text-accent"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>How It Works</span>
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default TableOfContents;
