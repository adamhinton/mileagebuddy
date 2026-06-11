import { createServerClient } from "@supabase/ssr";
import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
	getLocalGoogleRedirectUri,
	getSafeNextPath,
	GOOGLE_CLIENT_ID,
	GOOGLE_OAUTH_NEXT_COOKIE,
	GOOGLE_OAUTH_STATE_COOKIE,
	isLocalSupabase,
} from "../auth";

type GoogleTokenResponse = {
	id_token?: string;
	error?: string;
};

export async function GET(request: NextRequest) {
	if (!isLocalSupabase()) {
		return NextResponse.redirect(new URL("/error", request.url));
	}

	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const state = requestUrl.searchParams.get("state");
	const expectedState = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
	const next = getSafeNextPath(
		request.cookies.get(GOOGLE_OAUTH_NEXT_COOKIE)?.value ?? null,
	);

	if (!code || !state || !expectedState || !statesMatch(state, expectedState)) {
		console.error("Google OAuth callback had an invalid or missing state");
		return clearOAuthCookies(
			NextResponse.redirect(new URL("/error", request.url)),
		);
	}

	const clientSecret = process.env.GOOGLE_OAUTH_SECRET;

	if (!clientSecret) {
		console.error("Google OAuth is missing GOOGLE_OAUTH_SECRET");
		return clearOAuthCookies(
			NextResponse.redirect(new URL("/error", request.url)),
		);
	}

	try {
		const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_id: GOOGLE_CLIENT_ID,
				client_secret: clientSecret,
				code,
				grant_type: "authorization_code",
				redirect_uri: getLocalGoogleRedirectUri(),
			}),
			cache: "no-store",
		});
		const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

		if (!tokenResponse.ok || !tokenData.id_token) {
			console.error(
				"Google OAuth code exchange failed:",
				tokenData.error ?? `HTTP ${tokenResponse.status}`,
			);
			return clearOAuthCookies(
				NextResponse.redirect(new URL("/error", request.url)),
			);
		}

		const response = NextResponse.redirect(new URL(next, request.url));
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
							response.cookies.set(name, value, options);
						});
					},
				},
			},
		);
		const { error } = await supabase.auth.signInWithIdToken({
			provider: "google",
			token: tokenData.id_token,
		});

		if (error) {
			console.error(
				"Error creating Supabase session from Google ID token:",
				error.message,
			);
			return clearOAuthCookies(
				NextResponse.redirect(new URL("/error", request.url)),
			);
		}

		return clearOAuthCookies(response);
	} catch (error) {
		console.error(
			"Google OAuth callback failed:",
			error instanceof Error ? error.message : "Unknown error",
		);
		return clearOAuthCookies(
			NextResponse.redirect(new URL("/error", request.url)),
		);
	}
}

function statesMatch(actual: string, expected: string) {
	const actualBuffer = Buffer.from(actual);
	const expectedBuffer = Buffer.from(expected);

	return (
		actualBuffer.length === expectedBuffer.length &&
		timingSafeEqual(actualBuffer, expectedBuffer)
	);
}

function clearOAuthCookies(response: NextResponse) {
	response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
	response.cookies.delete(GOOGLE_OAUTH_NEXT_COOKIE);
	return response;
}
