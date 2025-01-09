/* eslint-disable @typescript-eslint/no-unused-vars */
// basic nextjs route.ts with GET dummy to make sure it works

import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { NextApiRequest } from "next";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

// import { NextApiRequest, NextApiResponse } from "next";

// TODO: User data validation. Middleware?

// TODO: Utils such as getUserByID etc

// Gets a user with query parameters by id, email or username
// Ex GET api/users?id=2348 or GET api/users?email=bob@bob.com or GET api/users?username=bob_donaldson
export async function GET(request: NextApiRequest) {
	const url = new URL(request.url!);
	const supabase = await createClientSSROnly();

	const id = url.searchParams.get("id");
	const email = url.searchParams.get("email");
	const username = url.searchParams.get("username");

	if (!id && !email && !username) {
		return NextResponse.json(
			{
				error:
					"At least one query parameter (id, email, or username) is required.",
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

	if (username) {
		query.eq("username", username);
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
export async function PUT(request: NextApiRequest) {
	const url = new URL(request.url!);
	const supabase = await createClientSSROnly();

	// @ts-expect-error This is a workaround to make the function work with NextApiRequest, not Request
	// TODO: Fix this, TS says json() property doesn't exist because it's only a property on Request, not on NextApiRequst. Need to change function param type to Request
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

	if (!body.username && !body.email) {
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
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(
		{ message: "User updated successfully" },
		{ status: 200 }
	);
}

// Must have an id attached as query parameter to the API endpoint call
// for example, DELETE /api/users?id=2348
// Only takes ID
// TODO: Make this param a Request, not a NextApiRequest
export async function DELETE(request: NextApiRequest) {
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
		{ message: "User deleted successfully" },
		{ status: 200 }
	);
}

// TODO: Make this param a Request, not a NextApiRequest
export async function POST(request: NextApiRequest) {
	console.log("Starting POST");
	const url = new URL(request.url!);
	const supabase = await createClientSSROnly();

	// @ts-expect-error This is a workaround to make the function work with NextApiRequest, not Request
	// TODO: Fix this, TS says json() property doesn't exist because it's only a property on Request, not on NextApiRequst. Need to change function param type to Request
	const body = await request.json();

	console.log("body in POST:", body);

	if (!body.username || !body.email) {
		return NextResponse.json(
			{
				error: "Email and username required",
			},
			{ status: 400 }
		);
	}

	// TODO: Test this more thoroughly
	const isUserExistsInDB =
		(await checkIfUserExistsInDB("email", body.email, supabase)) ||
		(await checkIfUserExistsInDB("username", body.username, supabase));

	console.log("isUserExistsInDB:", isUserExistsInDB);

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
	}: { data: object[] | null; error: PostgrestError | null } = await supabase
		.from("users")
		.insert(body)
		// This retrieves the newly created user's data
		.select();

	if (error) {
		console.log("should be error 500 now");
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	console.log("data in POST:", data);

	// return NextResponse.json(
	// 	{
	// 		message: "User created successfully",
	// 	},
	// 	{ status: 201 }
	// );

	// return successful 201 including all the new user's data
	return NextResponse.json(data, { status: 201 });
}

type IDOrEmailOrUsername = "id" | "email" | "username";

// TODO: Move to a util file
// First param is what kind of identifier we're looking up by (email or username or id), second is the identifier itself (ex. "bob.bobsmith@gmail.com")
const checkIfUserExistsInDB = async (
	identifierType: IDOrEmailOrUsername,
	identifier: string,
	supabase: SupabaseClient
): Promise<boolean> => {
	const { data } = await supabase
		.from("users")
		.select("*")
		.eq(identifierType, identifier);
	return data !== null && data.length > 0;
};
