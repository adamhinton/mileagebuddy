// README
// This creates a Supabase client for the CLIENT, you use it to interact with the DB from the CLIENT
// This can only run on the CLIENT, see utils/supabase/server.ts for the server version
// TODO: This might need headers or something in dev

import { createBrowserClient } from "@supabase/ssr";

/**Supabase names this createClient() in their docs, I renamed it for clarity
 *
 * And I definitely won't regret that later when copying from their docs
 */
export function createClientCSROnly() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}
