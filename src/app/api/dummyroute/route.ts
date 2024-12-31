// basic nextjs route.ts with GET dummy to make sure it works

// import { NextApiRequest, NextApiResponse } from "next";

export async function GET() {
	return Response.json({ message: "Hello World" });
}
