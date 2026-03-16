"use client";

// AUTH TODO:
// Work darkmode in to auth user data

import Script from "next/script";
import { useAppSelector } from "@/redux/hooks";
import { createClientCSROnly } from "../utils/server/supabase/client";

// Did this for google signin stuff
declare global {
	interface Window {
		handleSignInWithGoogle: (response: { credential: string }) => Promise<void>;
	}
}

// Google's auth API expects this function to be in the global scope
// DO NOT CHANGE THIS FUNCTION NAME, ITS NAME IS REFERENCED IN THE GOOGLE GSI SCRIPT
// Google's API calls this function when the user signs in
window.handleSignInWithGoogle =
	async function handleSignInWithGoogle(response: { credential: string }) {
		const supabase = createClientCSROnly();

		const { error } = await supabase.auth.signInWithIdToken({
			provider: "google",
			token: response.credential,
		});

		if (error) {
			console.error("Error signing in with Google:", error.message);
		} else {
			console.log("Successfully signed in with Google");
		}
	};

export default function LoginPage() {
	const loggedInUser = useAppSelector((state) => state.user.value);
	const isLoggedIn = !!loggedInUser?.id;

	return (
		<main className="min-h-screen flex flex-col justify-center items-center p-4 transition-colors duration-200">
			<Script
				src="https://accounts.google.com/gsi/client"
				strategy="afterInteractive"
			/>

			{isLoggedIn ? (
				<>
					<h1>Welcome, {loggedInUser?.email}!</h1>
					<button
						onClick={async () => {
							const supabase = createClientCSROnly();
							const { error } = await supabase.auth.signOut();
							if (error) {
								console.error("Error logging out:", error.message);
							}
						}}
						className="mt-6 w-full max-w-md bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
						aria-label="Log out"
					>
						Log Out
					</button>
				</>
			) : (
				<div className="rounded-lg shadow-lg p-8 w-full max-w-md mx-auto transition-colors duration-200">
					<h1
						className="text-2xl md:text-3xl font-bold mb-6 text-center"
						aria-label="Sign in with Google"
					>
						Sign in with Google
					</h1>

					<div
						className="space-y-4 flex justify-center"
						role="region"
						aria-label="Google sign in options"
					>
						<div
							id="g_id_onload"
							data-client_id="220043080394-n7is08dpuk1iv2kbbif6isaq9l5d1lsn.apps.googleusercontent.com"
							data-context="signin"
							data-ux_mode="popup"
							data-callback="handleSignInWithGoogle"
							data-auto_prompt="false"
						/>
						<div
							className="g_id_signin"
							data-type="standard"
							data-shape="rectangular"
							data-theme="outline"
							data-text="sign_in_with"
							data-size="large"
							data-logo_alignment="left"
							data-width="320"
						/>
					</div>
				</div>
			)}
		</main>
	);
}
