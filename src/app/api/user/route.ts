// basic nextjs route.ts with GET dummy to make sure it works

import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { NextApiRequest } from "next";

// import { NextApiRequest, NextApiResponse } from "next";

// TODO: Utils such as getUserByID etc

// Gets a user with query parameters by id, email or username
// Ex GET api/users?id=2348 or GET api/users?email=bob@bob.com or GET api/users?username=bob_donaldson
export async function GET(request: NextApiRequest) {
	console.log("request.url in GET:", request.url);

	const url = new URL(request.url!);
	const supabase = await createClientSSROnly();

	const id = url.searchParams.get("id");
	const email = url.searchParams.get("email");
	const username = url.searchParams.get("username");

	console.log("id in GET route.ts:", id);

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
	console.log("data in new GET:", data);

	if (error || !data || !data.length) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	return NextResponse.json(data);
}
