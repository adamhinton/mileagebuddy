// README
// This is a test file for the server-side API route /api/user/slug
// Testing the GET operation to fetch a user by id

// This file is for UNIT tests. It tests API endpoint logic with dummy data, doesn't interact with an actual DB.
// See README in servertests/serverunit tests for more info.

// IMPORTANT: All backend tests must have this jest-environment flag at the top of the file, because their jest-environment is different from the one specified in our jest config (since it's different for client vs server tests)
/**
 * @jest-environment node
 */

// import { GET } from "@/app/api/user/route";
// import { GET } from "@/app/api/user/route";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { GET } from "@/app/api/user/route";
// import { NextApiRequest } from "next";
import httpMocks from "node-mocks-http";

// Mock the Supabase client
jest.mock("../../../../supabaseUtilsCustom/server", () => ({
	createClientSSROnly: jest.fn(),
}));

jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn((data) => ({
			json: jest.fn().mockResolvedValue(data),
		})),
	},
}));

describe("GET /api/user", () => {
	it("should return a user by id if id exists", async () => {
		const mockUser = {
			id: "1",
			username: "John Doe",
			email: "bob.smithjones@gmail.com",
		};

		const mockFrom = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });

		// Mock request with query params
		const request = httpMocks.createRequest({
			method: "GET",
			url: "localhost:3000/api/user?id=1",
		});

		// Create a mock response object
		const response = httpMocks.createResponse();

		// Call the handler
		await GET(request);

		// Extract the response data from the mocked response
		const responseData = response._getData();
		console.log("responseData in test GET:", responseData);

		// Assert the correct user is returned
		expect(responseData).toEqual([mockUser]);

		// Ensure the database query was made with correct parameters
		expect(mockFrom).toHaveBeenCalledWith("users");
		expect(mockFrom().select).toHaveBeenCalledWith("*");
		expect(mockFrom().select().eq).toHaveBeenCalledWith("id", "1");
	});

	// it("should return a user by email", async () => {
	// 	const mockUser = {
	// 		id: "1",
	// 		username: "John Doe",
	// 		email: "bob.smithjones@gmail.com",
	// 	};

	// 	const mockFrom = jest.fn().mockReturnValue({
	// 		select: jest.fn().mockReturnValue({
	// 			eq: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
	// 		}),
	// 	});

	// 	(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });

	// 	// Mock request with query params
	// 	const request = httpMocks.createRequest<NextApiRequest>({
	// 		method: "GET",
	// 		url: "/api/user?email=bob.smithjones@gmail.com",
	// 	});

	// 	const response = httpMocks.createResponse();

	// 	await GET(request);

	// 	const responseData = response._getData();
	// 	expect(responseData).toEqual([mockUser]);

	// 	expect(mockFrom).toHaveBeenCalledWith("users");
	// 	expect(mockFrom().select).toHaveBeenCalledWith("*");
	// });

	// it("should return a user by username", async () => {
	// 	const mockUser = {
	// 		id: "1",
	// 		username: "John Doe",
	// 		email: "bob.smithjones@gmail.com",
	// 	};

	// 	const mockFrom = jest.fn().mockReturnValue({
	// 		select: jest.fn().mockReturnValue({
	// 			eq: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
	// 		}),
	// 	});

	// 	(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });

	// 	// Mock request with query params
	// 	const request = httpMocks.createRequest({
	// 		method: "GET",
	// 		url: "/api/user?username=John Doe", // New query param for username
	// 	});

	// 	const response = httpMocks.createResponse();

	// 	await GET(request);

	// 	const responseData = response._getData();
	// 	expect(responseData).toEqual([mockUser]);

	// 	expect(mockFrom).toHaveBeenCalledWith("users");
	// 	expect(mockFrom().select).toHaveBeenCalledWith("*");
	// });

	// it("should throw error if user not found", async () => {
	// 	const mockFrom = jest.fn().mockReturnValue({
	// 		select: jest.fn().mockReturnValue({
	// 			eq: jest.fn().mockResolvedValue({ data: [], error: null }),
	// 		}),
	// 	});

	// 	(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });

	// 	// Mock request with query params for a non-existent user
	// 	const request = httpMocks.createRequest({
	// 		method: "GET",
	// 		url: "/api/user?id=3424", // Invalid user ID
	// 	});

	// 	const response = httpMocks.createResponse();

	// 	await GET(request);

	// 	const responseData = response._getData();
	// 	expect(responseData).toEqual({ error: "User not found" });

	// 	expect(mockFrom).toHaveBeenCalledWith("users");
	// 	expect(mockFrom().select).toHaveBeenCalledWith("*");
	// });
});
