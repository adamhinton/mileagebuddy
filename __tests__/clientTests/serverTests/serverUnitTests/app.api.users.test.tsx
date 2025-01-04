// README
// This file is for UNIT tests. It tests API endpoint logic with dummy data, doesn't interact with an actual DB.
//  See README in servertests/serverunit tests for more info.

// IMPORTANT: All backend tests must have this at the top of the file, because their jest-environment is different from the one specified in our jest config (since it's different for client vs server tests)
/**
 * @jest-environment node
 */

import { GET } from "../../../../src/app/api/user/route";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server"; // Adjust path as well

// Mock the Supabase client
jest.mock("../../../../supabaseUtilsCustom/server", () => ({
	createClientSSROnly: jest.fn(),
}));

// Mock NextResponse
jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn().mockReturnValue({
			json: jest.fn().mockResolvedValue({}),
		}),
	},
}));

describe("GET /api/user", () => {
	it("should return a list of users and format the response correctly", async () => {
		// Mock response data for the 'users' table
		const mockUsers = [
			{ id: 1, name: "John Doe" },
			{ id: 2, name: "Jane Smith" },
		];

		// Mock the Supabase client to return the mock data when `from('users').select('*')` is called
		const mockFrom = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue({ data: mockUsers, error: null }),
		});

		// Use the mocked client in place of the real one
		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });

		const response = await GET();

		const responseData = await response.json();

		expect(responseData).toEqual(mockUsers);

		// Validate the Supabase client is called correctly
		expect(mockFrom).toHaveBeenCalledWith("users");
		expect(mockFrom().select).toHaveBeenCalledWith("*");
	});
});
