// README:
// To access Supabase you need to create a "client" in the browser or server
// The process is different in SSR components vs client components
// This util creates a Client for your server component
// You can make a new client in each file, that's totally fine

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * THIS ONLY WORKS IN SERVER COMPONENTS
 * THERE'S A DIFFERENT PROCESS IN CLIENT COMPONENTS, REFERENCE DOCS IF THERE'S NOT ALREADY A UTIL FOR THAT
 */
export async function createClientSSROnly() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		}
	);
}
