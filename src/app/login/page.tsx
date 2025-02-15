// README
// This is the source of truth for auth in this application (obviously)
// At this time we are only using Google Sign-In for authentication, no passwords or anything
// User will also be able to save vehicles locally (localhost) without an account

"use client";

// AUTH TODO:

// Users table:
// Delete old users table
// Hook up any relevant endpoints to new users table

// Vehicles table TODO:
// Hook up new user id to vehicles
// Nothing needs done in vehicle sub-objects

// Auth UI TODO:
// Update flow:
// Flow when loading page and already logged in
// Flow when loading page not logged in
// Where to put signin/ log out buttons etc

// State/Authwatcher TODO (related to Auth UI todo):
// Figure out how to call functions on signup

import { useState, useEffect } from "react";
import { createClientCSROnly } from "../utils/server/supabase/client";

export default function LoginPage() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		// Dynamically load the Google GSI scriptNo
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	return (
		<main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md mx-auto transition-colors duration-200">
				<h1
					className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white"
					aria-label="Sign in with Google"
				>
					Sign in with Google
				</h1>
				{isMounted && (
					<div
						className="space-y-4"
						role="region"
						aria-label="Google sign in options"
					>
						{/* Google GSI auto-generated div */}
						<div
							id="g_id_onload"
							data-client_id="220043080394-n7is08dpuk1iv2kbbif6isaq9l5d1lsn.apps.googleusercontent.com"
							data-context="signin"
							data-ux_mode="popup"
							data-callback="handleSignInWithGoogle"
							data-itp_support="true"
							data-use_fedcm_for_prompt="true"
						></div>
						<div
							className="g_id_signin"
							data-type="standard"
							data-shape="rectangular"
							data-theme="outline"
							data-text="signin_with"
							data-size="large"
							data-logo_alignment="left"
						></div>
					</div>
				)}

				{/* Test sign-out button */}
				<button
					onClick={async () => {
						const supabase = createClientCSROnly();
						await supabase.auth
							.signOut()
							.then(() => {
								console.log("Logged out");
							})
							.catch((error) => {
								console.error("Error logging out:", error.message);
							});
					}}
					className="mt-6 w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
					aria-label="Log out"
				>
					Log Out (Test)
				</button>
			</div>
		</main>
	);
}

// Google's auth API expects this function to be in the global scope
// DO NOT CHANGE THIS FUNCTION NAME, ITS NAME IS REFERENCED IN THE GOOGLE GSI SCRIPT
// Google's API calls this function when the user signs in
// @ts-expect-error - wasn't sure what to type this, Google's docs didn't specify
globalThis.handleSignInWithGoogle = async function handleSignInWithGoogle(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	response: any
) {
	console.log("handleSignInWithGoogle starting");
	console.log(
		"handleSignInWithGoogle response PARAMETER, not return item:",
		response
	);

	const supabase = createClientCSROnly();

	// Retrieve signed in user info
	const signedInUser = await supabase.auth.getUser();
	console.log("signedInUser:", signedInUser);

	const { data, error } = await supabase.auth.signInWithIdToken({
		provider: "google",
		token: response.credential,
	});

	if (error) {
		console.error("Error signing in with Google:", error.message);
	} else {
		console.log("Successfully signed in with Google:", data);
	}
};
