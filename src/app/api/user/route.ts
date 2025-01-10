// basic nextjs route.ts with GET dummy to make sure it works

import { NextRequest, NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

// import { NextApiRequest, NextApiResponse } from "next";

// TODO: User data validation. Middleware?

// TODO: Utils such as getUserByID etc

// Gets a user with query parameters by id or email
// Ex GET api/users?id=2348 or GET api/users?email=bob@bob.com or GET api/users?email=bob_donaldson@gmail.com
export async function GET(request: NextRequest) {
	const url = new URL(request.url!);
	const supabase = await createClientSSROnly();

	const id = url.searchParams.get("id");
	const email = url.searchParams.get("email");

	if (!id && !email) {
		return NextResponse.json(
			{
				error: "At least one query parameter (id or email) is required.",
			},
			{ status: 400 }
		);
	}

	const query = supabase.from("users").select("*");

	if (id) {
		query.eq("id", id);
	}

	if (email) {
		query.eq("email", email);
	}

	const { data, error } = await query;

	if (error || !data || !data.length) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	return NextResponse.json(data);
}

// Must have an id attached as query parameter to the API endpoint call
// for example, PUT /api/users?id=2348
// Only takes ID
// TODO: Make this param a Request, not a NextApiRequest
export async function PUT(request: NextRequest) {
	const url = new URL(request.url!);
	const supabase = await createClientSSROnly();

	const body = await request.json();

	const id = url.searchParams.get("id");

	if (!id) {
		return NextResponse.json(
			{
				error: "User ID is required. Must format like so: /api/users?id=2348",
			},
			{ status: 400 }
		);
	}

	console.log("body:", body);

	// TODO: This may be unnecessary
	const isUserExistsInDB = await checkIfUserExistsInDB("id", id, supabase);
	if (!isUserExistsInDB) {
		return NextResponse.json({ message: "User not in DB" }, { status: 404 });
	}

	console.log("body.email:", body.email);
	console.log("body.isdarkmode:", body.isdarkmode);

	if (!body.email && body.isdarkmode === undefined) {
		console.log("blah blah blah");
		return NextResponse.json(
			{
				error: "User data to update is required",
			},
			{ status: 400 }
		);
	}
	const {
		// data,
		error,
	}: { data: object[] | null; error: PostgrestError | null } = await supabase
		.from("users")
		.update(body)
		.eq("id", id);

	if (error) {
		console.log("error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(
		{ message: "User updated successfully", data: body },
		{ status: 200 }
	);
}

// Must have an id attached as query parameter to the API endpoint call
// for example, DELETE /api/users?id=2348
// Only takes ID
// TODO: Make this param a Request, not a NextApiRequest
export async function DELETE(request: NextRequest) {
	const url = new URL(request.url!);
	const supabase = await createClientSSROnly();
	const id = url.searchParams.get("id");

	if (!id) {
		return NextResponse.json(
			{
				error: "User ID is required. Must format like so: /api/users?id=2348",
			},
			{ status: 400 }
		);
	}

	// TODO: This may be unnecessary
	const isUserExistsInDB = await checkIfUserExistsInDB("id", id, supabase);
	if (!isUserExistsInDB) {
		return NextResponse.json({ message: "User not in DB" }, { status: 404 });
	}

	const {
		data,
		error,
	}: { data: object[] | null; error: PostgrestError | null } = await supabase
		.from("users")
		.delete()
		.eq("id", id);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(
		{ message: "User deleted successfully", data: data },
		{ status: 200 }
	);
}

// Returns newly created User object
export async function POST(request: NextRequest) {
	const supabase = await createClientSSROnly();

	const body = await request.json();

	if (!body.email) {
		console.log("no body.email");
		return NextResponse.json(
			{
				error: "Email  required",
			},
			{ status: 400 }
		);
	}

	console.log("body:", body);

	// TODO: Test this more thoroughly
	const isUserExistsInDB = await checkIfUserExistsInDB(
		"email",
		body.email,
		supabase
	);

	if (isUserExistsInDB) {
		console.log("isUserExistsInDB:", isUserExistsInDB);
		return NextResponse.json(
			{
				error: "User already in DB",
			},
			{ status: 400 }
		);
	}

	const {
		data,
		error,
	}: { data: object[] | null; error: PostgrestError | null } = await supabase
		.from("users")
		.insert(body)
		// This retrieves the newly created user's data
		.select();

	if (error) {
		console.log("error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data, { status: 201 });
}

type IDOrEmail = "id" | "email";

// TODO: Move to a util file
// First param is what kind of identifier we're looking up by (email or id), second is the identifier itself (ex. "bob.bobsmith@gmail.com")
const checkIfUserExistsInDB = async (
	identifierType: IDOrEmail,
	identifier: string,
	supabase: SupabaseClient
): Promise<boolean> => {
	const { data } = await supabase
		.from("users")
		.select("*")
		.eq(identifierType, identifier);
	return data !== null && data.length > 0;
};
