// README:
// These are currently deprecated since I moved towards only using google auth
// TODO: Delete this file if no use for it emerges soon

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClientSSROnly } from "../utils/server/supabase/server";

export async function login(formData: FormData) {
	const supabase = await createClientSSROnly();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(formData: FormData) {
	const supabase = await createClientSSROnly();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
}
