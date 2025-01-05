// README:
// This is an API endpoint. Specifically, api/user/id. CRUD operations for a specific user go through this endpoint.

import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../../supabaseUtilsCustom/server";

// get user by id
// Tested, works
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

	if (error || !data.length) {
		return NextResponse.json({ error: "User not found" }, { status: 500 });
	}

	return NextResponse.json(data);
}

// delete user by id
// Tested, works
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const slug = (await params).slug;

	const supabase = await createClientSSROnly();

	const { data, error } = (await supabase
		.from("users")
		.delete()
		.eq("id", slug)) as {
		data: object[] | null;
		error: { message: string } | null;
	};

	console.log("data in DELETE:", data);
	console.log("error in DELETE:", error);

	// General error handling for Supabase API
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	if (!data || data.length === 0) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	// If we get here, it means the user was deleted successfully
	return NextResponse.json({ message: "User deleted successfully" });
}

// update user
// put without `any` type, without 	`request.json()` (that function doesn't exist), with error handling for general supabase error and user not found error
// Make sure to update any user field, not just id. But id is required so we can look up user. This looks up user by id
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const slug = (await params).slug;

	const supabase = await createClientSSROnly();

	const { data, error } = (await supabase
		.from("users")
		.update(request.body)
		.eq("id", slug)) as {
		data: object[] | null;
		error: { message: string } | null;
	};

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	if (!data || data.length === 0) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	return NextResponse.json(data);
}

// create user
// TODO: Test this
export async function POST(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const slug = (await params).slug;

	const supabase = await createClientSSROnly();

	const { data, error } = await supabase.from("users").insert({ id: slug });

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}
