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

	// If no data was deleted, return "User not found"
	if (!data || data.length === 0) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	// If we get here, it means the user was deleted successfully
	return NextResponse.json({ message: "User deleted successfully" });
}

// update user
// TODO: Test this
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const slug = (await params).slug;

	const supabase = await createClientSSROnly();

	const { data, error } = await supabase
		.from("users")
		.update({ username: "newUsername" })
		.eq("id", slug);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
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
