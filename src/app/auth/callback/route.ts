import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const requestedNext = requestUrl.searchParams.get("next");
	const next =
		requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
			? requestedNext
			: "/dashboard";
	const response = NextResponse.next();

	if (code) {
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

		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			const redirectResponse = NextResponse.redirect(
				new URL(next, request.url),
			);
			response.cookies.getAll().forEach((cookie) => {
				redirectResponse.cookies.set(cookie);
			});
			return redirectResponse;
		}

		console.error("Error exchanging OAuth code for session:", error.message);
	}

	return NextResponse.redirect(new URL("/error", request.url));
}
