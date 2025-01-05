// basic nextjs route.ts with GET dummy to make sure it works

import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";

// import { NextApiRequest, NextApiResponse } from "next";

export async function GET() {
	console.log("blah blah blah");
	const supabase = await createClientSSROnly();

	const { data, error } = await supabase.from("users").select("*");

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}
