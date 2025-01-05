// README:
// This is an API endpoint. Specifically, api/user/id. CRUD operations for a specific user go through this endpoint.

import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../../supabaseUtilsCustom/server";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	/**
	 * Slug is the requested user ID
	 */
	const slug = (await params).slug;

	const supabase = await createClientSSROnly();

	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", slug);
	console.log("data in GET:", data);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}
