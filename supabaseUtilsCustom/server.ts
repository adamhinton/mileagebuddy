// README:
// To access Supabase you need to create a "client" in the browser or server
// The process is different in SSR components vs client components
// This util creates a Client for your server component
// You can make a new client in each file, that's totally fine

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../database.types";

/**
 * THIS ONLY WORKS IN SERVER COMPONENTS
 * THERE'S A DIFFERENT PROCESS IN CLIENT COMPONENTS, REFERENCE DOCS IF THERE'S NOT ALREADY A UTIL FOR THAT
 * This creates a Supabase client, you use it to interact with db
 * These are lightweight so it's fine to generate loads of them
 */
export async function createClientSSROnly() {
	const cookieStore = await cookies();
	const isDev = process.env.NODE_ENV === "development";

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			global: {
				headers: {
					// This only adds the authorization header if we're in development
					// It's not needed in prod and would actively sabotage our prod API calls
					...(isDev && { authorization: process.env.NEXT_JWT_SECRET! }),
				},
			},
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch (error) {
						console.error("Error setting cookies:", error);
					}
				},
			},
		}
	);
}
