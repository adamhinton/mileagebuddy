// README
// I created this because the supabase auth docs said to
// https://supabase.com/docs/guides/auth/server-side/nextjs

import { redirect } from "next/navigation";
import { createClientSSROnly } from "../utils/server/supabase/server";

export default async function PrivatePage() {
	const supabase = await createClientSSROnly();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect("/login");
	}

	return <p>Hello {data.user.email}</p>;
}
