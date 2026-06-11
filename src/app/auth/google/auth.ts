export const GOOGLE_CLIENT_ID =
	process.env.GOOGLE_OAUTH_CLIENT_ID ??
	"220043080394-n7is08dpuk1iv2kbbif6isaq9l5d1lsn.apps.googleusercontent.com";

export const GOOGLE_OAUTH_STATE_COOKIE = "mileagebuddy_google_oauth_state";
export const GOOGLE_OAUTH_NEXT_COOKIE = "mileagebuddy_google_oauth_next";

export function getSafeNextPath(value: string | null) {
	if (!value || !value.startsWith("/") || value.startsWith("//")) {
		return "/dashboard";
	}

	return value;
}

export function isLocalSupabase() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

	if (!url) {
		return false;
	}

	try {
		const hostname = new URL(url).hostname;
		return hostname === "127.0.0.1" || hostname === "localhost";
	} catch {
		return false;
	}
}

export function getLocalGoogleRedirectUri() {
	return process.env.GOOGLE_OAUTH_REDIRECT_URI ?? "http://localhost:3000/";
}
