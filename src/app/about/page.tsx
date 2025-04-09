// _____________________________________________________________________________
// This is the About page
// Includes a table of contents, app description, benefits, and a quick how-to guide
// _____________________________________________________________________________

"use client";

import TableOfContents from "./AboutPageComponents/TableOfContents";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AboutPage() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Ensure component is mounted before accessing theme
	useEffect(() => {
		setMounted(true);
	}, []);

	// Use the appropriate image based on the theme
	const dashboardImage =
		mounted && resolvedTheme === "dark"
			? "/images/dashboardExample-DarkMode.png"
			: "/images/dashboardExample-Lightmode.png";

	return (
		<main className="min-h-screen bg-background-base text-neutral-text p-6 sm:p-8 md:p-12">
			<div className="max-w-5xl mx-auto space-y-12">
				{/* Table of Contents */}
				<TableOfContents />

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

					{/* Dashboard Screenshot */}
					<div className="mt-6 mb-8">
						<div className="overflow-hidden rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 max-w-3xl mx-auto">
							{mounted && (
								<Image
									src={dashboardImage}
									alt="MileageBuddy Dashboard Example"
									width={600}
									height={338}
									className="w-full h-auto object-contain"
									priority
								/>
							)}
						</div>
						<p className="text-sm text-center mt-2 text-neutral-500 dark:text-neutral-400">
							Track your vehicles and their calculated costs per mile in one
							place
						</p>
					</div>
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
		</main>
	);
}
