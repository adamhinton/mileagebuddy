// README:
// This is an API endpoint. Specifically, api/user/id. CRUD operations for a specific user go through this endpoint.

import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../../supabaseUtilsCustom/server";
import { PostgrestError } from "@supabase/supabase-js";

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

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const slug = (await params).slug;

	const supabase = await createClientSSROnly();

	const isUserExistsInDB = await checkIfUserExistsInDB(slug);
	if (!isUserExistsInDB) {
		return NextResponse.json({ message: "User not in DB" }, { status: 404 });
	}

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

	// if (!data || data.length === 0) {
	// 	return NextResponse.json({ error: "User not found" }, { status: 404 });
	// }

	return NextResponse.json({ message: "User deleted successfully" });
}

// Can update this to take in more than just id if needed
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params;

	try {
		const body = await request.json();

		const supabase = await createClientSSROnly();

		const isUserExistsInDB = await checkIfUserExistsInDB(slug);
		if (!isUserExistsInDB) {
			return NextResponse.json({ message: "User not in DB" }, { status: 404 });
		}

		// Explicitly type the response from Supabase
		const {
			data,
			error,
		}: { data: object[] | null; error: PostgrestError | null } = await supabase
			.from("users")
			.update(body)
			.eq("id", slug);

		// error from supabase
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(
			{ message: "User updated successfully" },
			{ status: 200 }
		);

		return NextResponse.json(data);
	} catch (error: unknown) {
		if (error !== null) {
			return NextResponse.json({ error: error }, { status: 500 });
		} else {
			// this should rarely occur
			return NextResponse.json(
				{ error: "Unknown error occurred" },
				{ status: 500 }
			);
		}
	}
}

// create user
// TODO: Oh, this can't go in user/slug because there's not a user to have a slug.
export async function POST(request: Request) {
	const supabase = await createClientSSROnly();

	const body = await request.json();

	const { username, email } = body;

	if (!username || !email) {
		return NextResponse.json(
			{ error: "Username and email are required" },
			{ status: 400 }
		);
	}

	const { data, error } = await supabase.from("users").insert({
		username,
		email,
	});

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}

const checkIfUserExistsInDB = async (id: string): Promise<boolean> => {
	const supabase = await createClientSSROnly();
	const { data } = await supabase.from("users").select("*").eq("id", id);
	return data !== null && data.length > 0;
};
