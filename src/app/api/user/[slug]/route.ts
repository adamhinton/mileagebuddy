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
// export async function PUT(
// 	request: Request,
// 	{ params }: { params: Promise<{ slug: string }> }
// ) {
// 	console.log("PUT running");
// 	const slug = (await params).slug;
// 	console.log("PUT request.body:", request.body);

// 	const supabase = await createClientSSROnly();

// 	const { data, error } = (await supabase
// 		.from("users")
// 		.update(request.body)
// 		.eq("id", slug)) as {
// 		data: object[] | null;
// 		error: { message: string } | null;
// 	};

// 	if (error) {
// 		return NextResponse.json({ error: error.message }, { status: 500 });
// 	}

// 	console.log("error in PUT:", error);
// 	console.log("data in PUT:", data);

// 	if (!data || data.length === 0) {
// 		return NextResponse.json({ error: "User not found" }, { status: 404 });
// 	}

// 	return NextResponse.json(data);
// }

// This version successfully updates user but still returns an error to frontend
// export async function PUT(
// 	request: Request,
// 	{ params }: { params: Promise<{ slug: string }> }
// ) {
// 	const { slug } = await params; // Await to get the slug properly

// 	try {
// 		const body = await request.json();

// 		const supabase = await createClientSSROnly();

// 		const { data, error } = (await supabase
// 			.from("users")
// 			.update(body)
// 			.eq("id", slug)) as {
// 			data: object[] | null;
// 			error: { message: string } | null;
// 		};

// 		console.log("data in PUT:", data);
// 		console.log("error in PUT:", error);

// 		if (error) {
// 			return NextResponse.json({ error: error.message }, { status: 500 });
// 		}

// 		if (!data || data.length === 0) {
// 			console.log("PUT !data || data.length === 0");
// 			return NextResponse.json({ error: "User not found" }, { status: 404 });
// 		}

// 		return NextResponse.json(data);
// 	} catch (error) {
// 		console.log("catch path");
// 		return NextResponse.json({ error: error }, { status: 500 });
// 	}
// }

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params;

	try {
		const body = await request.json();

		const supabase = await createClientSSROnly();

		// Explicitly type the response from Supabase
		const {
			data,
			error,
		}: { data: object[] | null; error: PostgrestError | null } = await supabase
			.from("users")
			.update(body)
			.eq("id", slug);

		console.log("data in PUT:", data);
		console.log("error in PUT:", error);

		// If there's an error from Supabase
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// If no rows were updated, it means no changes were made (but the user might exist)
		if (data === null) {
			console.log("PUT: No rows updated, user may still exist.");
			return NextResponse.json(
				{ message: "User updated successfully (no change in data)" },
				{ status: 200 }
			);
		}

		return NextResponse.json(data);
	} catch (error: unknown) {
		// Safely check if the error is an instance of Error
		if (error !== null) {
			return NextResponse.json({ error: error }, { status: 500 });
		} else {
			// Handle non-Error cases (this should rarely occur)
			console.log("catch path: unknown error", error);
			return NextResponse.json(
				{ error: "Unknown error occurred" },
				{ status: 500 }
			);
		}
	}
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
