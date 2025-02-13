"use client";

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
// @ts-expect-error
globalThis.handleSignInWithGoogle = async function handleSignInWithGoogle(
	response
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
