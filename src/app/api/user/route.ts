// basic nextjs route.ts with GET dummy to make sure it works

import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";

// import { NextApiRequest, NextApiResponse } from "next";

export async function GET() {
	const supabase = await createClientSSROnly();
	const users = await supabase.from("users").select("*");
	console.log("users in users/route.ts:", users);
	return Response.json(users);
}
