// ____________________________________________________________________________________________
// This is what shows when user has no saved Vehicles in /dashboard
// _____________________________________________________________________________________________

/**What shows when user has no saved Vehicles */
export const EmptyDashboardState = () => {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 bg-background-elevated rounded-lg shadow-sm border border-primary-50">
			<svg
				className="w-20 h-20 text-primary-100 mb-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
				/>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
				/>
			</svg>
			<h2 className="text-xl font-bold mb-2">No vehicles yet</h2>
			<p className="text-neutral-text text-center mb-6 max-w-md">
				Add your first vehicle to calculate its true cost per mile.
			</p>
			<a href="/calculator" className="nav-link-primary flex items-center">
				<svg
					className="w-5 h-5 mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Add Vehicle
			</a>
		</div>
	);
};

export default EmptyDashboardState;
