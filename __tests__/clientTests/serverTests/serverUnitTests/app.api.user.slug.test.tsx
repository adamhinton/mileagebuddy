// README
// this is, obviously, a test file for the server-side API route /api/user/slug
// testing CRUD operations for a user by id

// This file is for UNIT tests. It tests API endpoint logic with dummy data, doesn't interact with an actual DB.
//  See README in servertests/serverunit tests for more info.

// IMPORTANT: All backend tests must have this jest-environment flag at the top of the file, because their jest-environment is different from the one specified in our jest config (since it's different for client vs server tests)
/**
 * @jest-environment node
 */

import { User } from "@/zod/schemas/UserSchema";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { GET } from "@/app/api/user/[slug]/route";

// Mock the Supabase client
jest.mock("../../../../supabaseUtilsCustom/server", () => ({
	createClientSSROnly: jest.fn(),
}));

// Mock NextResponse
jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn((data) => ({
			json: jest.fn().mockResolvedValue(data), // This ensures the mock returns the passed data
		})),
	},
}));

describe("GET /api/user/slug", () => {
	it("should return a user by id", async () => {
		const mockUser: User = {
			id: "1",
			username: "John Doe",
			email: "bob.smithjones@gmail.com",
		};

		// Mock the Supabase client to return the mock data
		const mockFrom = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue({ data: mockUsers, error: null }),
		});

		// Use the mocked client in place of the real one
		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });

		// Call the GET function
		const response = await GET(
			// not sure I can get away with this request
			{} as Request,
			{ params: Promise.resolve({ slug: "1" }) }
		);

		const responseData = await response.json();
		console.log("responseData:", responseData);

		expect(responseData).toEqual(mockUser);

		// Validate the Supabase client is called correctly
		expect(mockFrom).toHaveBeenCalledWith("user");
		expect(mockFrom().select).toHaveBeenCalledWith("*");
	});
});

describe("sanity check", () => {
	it("should return true", () => {
		expect(true).toBe(true);
	});
});
