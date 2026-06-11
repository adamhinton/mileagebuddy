import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import {
	getLocalGoogleRedirectUri,
	getSafeNextPath,
	GOOGLE_CLIENT_ID,
	GOOGLE_OAUTH_NEXT_COOKIE,
	GOOGLE_OAUTH_STATE_COOKIE,
	isLocalSupabase,
} from "../auth";

const OAUTH_COOKIE_MAX_AGE_SECONDS = 10 * 60;

export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url);
	const next = getSafeNextPath(requestUrl.searchParams.get("next"));

	if (!isLocalSupabase()) {
		return startHostedSupabaseOAuth(request, next);
	}

	const redirectUri = getLocalGoogleRedirectUri();
	const redirectUrl = new URL(redirectUri);

	// OAuth state cookies are host-only. Canonicalize local development onto the
	// same localhost origin Google redirects back to before setting the cookie.
	if (requestUrl.host !== redirectUrl.host) {
		const canonicalStartUrl = new URL("/auth/google/start", redirectUrl);
		canonicalStartUrl.searchParams.set("next", next);
		return NextResponse.redirect(canonicalStartUrl);
	}

	const clientSecret = process.env.GOOGLE_OAUTH_SECRET;

	if (!clientSecret) {
		console.error("Google OAuth is missing GOOGLE_OAUTH_SECRET");
		return NextResponse.redirect(new URL("/error", request.url));
	}

	const state = crypto.randomUUID();
	const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
	googleUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
	googleUrl.searchParams.set("redirect_uri", redirectUri);
	googleUrl.searchParams.set("response_type", "code");
	googleUrl.searchParams.set("scope", "openid email profile");
	googleUrl.searchParams.set("state", state);
	googleUrl.searchParams.set("prompt", "select_account");

	const response = NextResponse.redirect(googleUrl);
	const secure = redirectUrl.protocol === "https:";
	const cookieOptions = {
		httpOnly: true,
		maxAge: OAUTH_COOKIE_MAX_AGE_SECONDS,
		path: "/",
		sameSite: "lax" as const,
		secure,
	};

	response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, cookieOptions);
	response.cookies.set(GOOGLE_OAUTH_NEXT_COOKIE, next, cookieOptions);

	return response;
}

async function startHostedSupabaseOAuth(request: NextRequest, next: string) {
	const cookieResponse = NextResponse.next();

	try {
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					getAll() {
						return request.cookies.getAll();
					},
					setAll(cookiesToSet) {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieResponse.cookies.set(name, value, options);
						});
					},
				},
			},
		);
		const callbackUrl = new URL("/auth/callback", request.url);
		callbackUrl.searchParams.set("next", next);

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: callbackUrl.toString(),
				skipBrowserRedirect: true,
			},
		});

		if (error || !data.url) {
			console.error(
				"Error starting hosted Google OAuth:",
				error?.message ?? "No authorization URL returned",
			);
			return NextResponse.redirect(new URL("/error", request.url));
		}

		const response = NextResponse.redirect(data.url);
		cookieResponse.cookies.getAll().forEach((cookie) => {
			response.cookies.set(cookie);
		});
		return response;
	} catch (error) {
		console.error(
			"Error starting hosted Google OAuth:",
			error instanceof Error ? error.message : "Unknown error",
		);
		return NextResponse.redirect(new URL("/error", request.url));
	}
}
