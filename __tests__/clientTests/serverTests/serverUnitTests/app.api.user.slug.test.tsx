// README
// This is a test file for the server-side API route /api/user/slug
// Testing the GET operation to fetch a user by id

// This file is for UNIT tests. It tests API endpoint logic with dummy data, doesn't interact with an actual DB.
// See README in servertests/serverunit tests for more info.

// IMPORTANT: All backend tests must have this jest-environment flag at the top of the file, because their jest-environment is different from the one specified in our jest config (since it's different for client vs server tests)
/**
 * @jest-environment node
 */

import { GET } from "../../../../src/app/api/user/[slug]/route";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";

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
		const mockUser = {
			id: "1",
			username: "John Doe",
			email: "bob.smithjones@gmail.com",
		};

		// Mock the 'from' function to return the mock data when `from('users').select('*').eq('id', '1')` is called
		const mockFrom = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
			}),
		});

		// Mock the createClientSSROnly to return our mock 'from' method
		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });

		// Call the GET function
		const response = await GET({} as Request, {
			params: Promise.resolve({ slug: "1" }), // Correct params format
		});

		// Get the response data from NextResponse.json
		const responseData = await response.json();
		console.log("responseData:", responseData);

		// Expect the response data to match the mock user in an array (supabase returns data as an array)
		expect(responseData).toEqual([mockUser]);

		// Validate the 'from' method was called with the correct table name and 'select' was called with '*'
		expect(mockFrom).toHaveBeenCalledWith("users");
		expect(mockFrom().select).toHaveBeenCalledWith("*");
	});

	it("should throw error if user not found", async () => {
		const mockFrom = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({ data: [], error: null }),
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });

		const response = await GET({} as Request, {
			params: Promise.resolve({ slug: "3424" }),
		});

		const responseData = await response.json();

		expect(responseData).toEqual({ error: "User not found" });
		expect(mockFrom).toHaveBeenCalledWith("users");
		expect(mockFrom().select).toHaveBeenCalledWith("*");
	});
});
