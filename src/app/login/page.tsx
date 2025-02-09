import { login, signup } from "./actions";

export default function LoginPage() {
	return (
		<div>
			<div
				id="g_id_onload"
				data-client_id="220043080394"
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
