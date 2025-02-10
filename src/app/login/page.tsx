"use client";

import { createClientCSROnly } from "../utils/server/supabase/client";
import { login, signup } from "./actions";

export default function LoginPage() {
	console.log("this should be client");
	return (
		<div>
			{/* This div and the next one (g_id_signin) were auto generated by google to my specifications
				https://developers.google.com/identity/gsi/web/tools/configurator
			*/}
			<div
				id="g_id_onload"
				// Got this client id from my GCP Mileagebuddy project page.  It's under Google Auth Platform/Clients. https://console.cloud.google.com/auth/clients?project=mileagebuddy-449116
				// Note that it's ok to expose the client id; it's not a secret and users will see it in their url anyway
				data-client_id="220043080394-n7is08dpuk1iv2kbbif6isaq9l5d1lsn.apps.googleusercontent.com"
				data-context="signin"
				data-ux_mode="popup"
				data-callback="handleSignInWithGoogle"
				data-itp_support="true"
				// This wasn't in the code that google generated for me, but Supabase docs said to set this to true
				// https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client#google-pre-built
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

			{/* TODO: Supabase auth docs had this formatted like so, but maybe change this to whatever form style (react-hook-form etc) we end up using */}
			<form>
				<label htmlFor="email">Email:</label>
				<input id="email" name="email" type="email" required />
				<label htmlFor="password">Password:</label>
				<input id="password" name="password" type="password" required />
				<button formAction={login}>Log in</button>
				<button formAction={signup}>Sign up</button>
			</form>
		</div>
	);
}

/**DO NOT CHANGE THIS FUNCTION NAME
 *
 * My GCP project for google auth is specifically configured to look for the function by this name. If you need to change it, go to the GCP project and update the function name there as well
 * https://developers.google.com/identity/gsi/web/tools/configurator
 *
 * This function isn't called in our code, Google looks for it (must be in the global scope) and calls it when appropriate.
 */
globalThis.handleSignInWithGoogle = async function handleSignInWithGoogle(
	response
) {
	console.log("handleSignInWithGoogle starting");

	const supabase = createClientCSROnly();

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
