import { NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(request: Request) {
	return NextResponse.json("Hello world vehicles", { status: 200 });
}
