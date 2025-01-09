// basic nextjs route.ts with GET dummy to make sure it works

import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { NextApiRequest } from "next";
import { PostgrestError } from "@supabase/supabase-js";

// import { NextApiRequest, NextApiResponse } from "next";

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
	const isUserExistsInDB = await checkIfUserExistsInDB(id);
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

// TODO: Move to a util file
const checkIfUserExistsInDB = async (id: string): Promise<boolean> => {
	const supabase = await createClientSSROnly();
	const { data } = await supabase.from("users").select("*").eq("id", id);
	return data !== null && data.length > 0;
};
