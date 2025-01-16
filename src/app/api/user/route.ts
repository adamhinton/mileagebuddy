// README
// basic nextjs route.ts with CRUD endpoints for the users table
// I didn't build out a utils file because this endpoint is relatively simple. But will make utils if it gets more complex
// TODO: Probably delete public.users and just use the supabase auth.users built in table. But can still use this same endpoint

import { NextRequest, NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { Tables } from "../../../../database.types";

// TODO: Get user's vehicles too

// import { NextApiRequest, NextApiResponse } from "next";

// TODO: User data validation. Middleware?

// TODO: Utils such as getUserByID etc

// Gets a user with query parameters by id or email
// Ex GET api/users?id=2348 or GET api/users?email=bob@bob.com or GET api/users?email=bob_donaldson@gmail.com
export async function GET(
	request: NextRequest
	// This return type is a fancy way to say it returns a User or an error
): Promise<
	NextResponse<Tables<"users">[] | null> | NextResponse<{ error: string }>
> {
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

	const GetUsersQuery = supabase.from("users").select("*");

	if (id) {
		GetUsersQuery.eq("id", Number(id));
	}

	if (email) {
		GetUsersQuery.eq("email", email);
	}

	const {
		data,
		error,
	}: { data: Tables<"users">[] | null; error: PostgrestError | null } =
		await GetUsersQuery;

	if (error || !data || !data.length) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	return NextResponse.json(data);
}

// Must have an id attached as query parameter to the API endpoint call
// for example, PUT /api/users?id=2348
// Only takes ID
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

	// TODO: This may be unnecessary
	const isUserExistsInDB = await checkIfUserExistsInDB("id", id, supabase);
	if (!isUserExistsInDB) {
		return NextResponse.json({ message: "User not in DB" }, { status: 404 });
	}

	if (!body.email && body.isDarkMode === undefined) {
		return NextResponse.json(
			{
				error: "User data to update is required",
			},
			{ status: 400 }
		);
	}
	const {
		data,
		error,
	}: { data: Tables<"users">[] | null; error: PostgrestError | null } =
		await supabase.from("users").update(body).eq("id", Number(id));

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(
		{ message: "User updated successfully", data: data },
		{ status: 200 }
	);
}

// Must have an id attached as query parameter to the API endpoint call
// for example, DELETE /api/users?id=2348
// Only takes ID
// NOTE that this will (should) delete all associated vehicle data too (ON DELETE CASCADE)
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
	}: { data: Tables<"users">[] | null; error: PostgrestError | null } =
		await supabase.from("users").delete().eq("id", Number(id));

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
		return NextResponse.json(
			{
				error: "Email required",
			},
			{ status: 400 }
		);
	}

	// TODO: Test this more thoroughly
	const isUserExistsInDB = await checkIfUserExistsInDB(
		"email",
		body.email,
		supabase
	);

	if (isUserExistsInDB) {
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
	}: { data: Tables<"users">[] | null; error: PostgrestError | null } =
		await supabase
			.from("users")
			.insert(body)
			// This retrieves the newly created user's data
			.select();

	if (error) {
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
