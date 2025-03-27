"use client";

import Link from "next/link";

const ErrorPage = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<h1 className="text-4xl font-bold text-red-600">Error</h1>
			<p className="mt-4 text-lg text-gray-700">
				An error occurred while processing your request.
			</p>
			<Link href="/dashboard" className="mt-6 text-blue-500 hover:underline">
				Go back to home
			</Link>
		</div>
	);
};

export default ErrorPage;
