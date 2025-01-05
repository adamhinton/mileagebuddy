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
// TODO: Test this
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const slug = (await params).slug;

	// Parse the request body for the fields to update
	const updates = await request.json();

	const supabase = await createClientSSROnly();

	// Perform the update
	const { data, error } = (await supabase
		.from("users")
		.update(updates) // Dynamically using the fields in the request body
		.eq("id", slug)) as {
		data: object[] | null;
		error: { message: string } | null;
	};

	// Handle general errors from Supabase
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// If no rows were updated, it means the user was not found
	if (!data || data.length === 0) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	// Return the updated data if the user was found and updated successfully
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
