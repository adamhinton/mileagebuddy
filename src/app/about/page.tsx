// _____________________________________________________________________________
// This is the About page
// Includes a table of contents, app description, benefits, and a quick how-to guide
// _____________________________________________________________________________

export default function AboutPage() {
	return (
		<section className="min-h-screen bg-background-base text-neutral-text p-6 sm:p-8 md:p-12">
			<div className="max-w-5xl mx-auto space-y-12">
				{/* Table of Contents */}
				<nav id="table-of-contents" className="mb-8">
					{/* Placeholder for ToC */}
					<div className="bg-background-elevated p-4 rounded-lg shadow-sm">
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							Table of Contents Placeholder
						</p>
					</div>
				</nav>

				{/* Introduction Section */}
				<section id="introduction" className="space-y-4">
					<h1 className="text-4xl font-bold text-primary">
						About MileageBuddy
					</h1>
					<p className="text-lg">
						MileageBuddy helps you calculate the true cost per mile of owning a
						car, including expenses like fuel, maintenance, depreciation,
						insurance, and more.
					</p>
				</section>

				{/* Benefits Section */}
				<section id="benefits" className="space-y-4">
					<h2 className="text-3xl font-bold text-secondary">
						Why Use MileageBuddy?
					</h2>
					<ul className="list-disc list-inside space-y-2">
						<li>
							Gain financial literacy by understanding your car ownership costs.
						</li>
						<li>Make informed decisions about vehicle purchases and usage.</li>
						<li>Plan your budget effectively with accurate cost insights.</li>
					</ul>
				</section>

				{/* How It Works Section */}
				<section id="how-it-works" className="space-y-4">
					<h2 className="text-3xl font-bold text-accent">How It Works</h2>
					<ol className="list-decimal list-inside space-y-2">
						<li>
							<strong>Create an Account:</strong> Sign up to start tracking your
							vehicle costs.
						</li>
						<li>
							<strong>Enter Vehicle Information:</strong> Go to the{" "}
							<a href="/calculator" className="text-primary underline">
								Calculator
							</a>{" "}
							page and input details about your vehicle.
						</li>
						<li>
							<strong>Review Costs:</strong> Visit the{" "}
							<a href="/dashboard" className="text-primary underline">
								Dashboard
							</a>{" "}
							to see a detailed breakdown of your vehicle&#39;s cost per mile.
						</li>
					</ol>
				</section>
			</div>
		</section>
	);
}
