// README
// This is a test file for the server-side API route /api/user/slug
// Testing the GET operation to fetch a user by id

// This file is for UNIT tests. It tests API endpoint logic with dummy data, doesn't interact with an actual DB.
// See README in servertests/serverunit tests for more info.

// IMPORTANT: All backend tests must have this jest-environment flag at the top of the file, because their jest-environment is different from the one specified in our jest config (since it's different for client vs server tests)
/**
 * @jest-environment node
 */

import { GET, PUT } from "@/app/api/user/route";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { NextApiRequest } from "next";

// Mock the Supabase client
jest.mock("../../../../supabaseUtilsCustom/server", () => ({
	createClientSSROnly: jest.fn(),
}));

jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn((data, options) => ({
			json: jest.fn().mockResolvedValue(data),
			...options,
		})),
	},
}));

describe("GET /api/user", () => {
	let mockDBCalls: jest.Mock;
	let mockUser: { id: string; username: string; email: string };

	beforeEach(() => {
		mockUser = {
			id: "1",
			username: "JohnDoe",
			email: "john@example.com",
		};

		mockDBCalls = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: [mockUser], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });
	});

	it("should return a user by id if id exists", async () => {
		const request = {
			url: "http://localhost:3000/api/user?id=1",
		} as NextApiRequest;

		const response = await GET(request);
		const responseData = await response.json();

		expect(responseData).toEqual([mockUser]);
		expect(mockDBCalls).toHaveBeenCalledWith("users");
		expect(mockDBCalls().select).toHaveBeenCalledWith("*");
		expect(mockDBCalls().eq).toHaveBeenCalledWith("id", "1");
	});

	it("should return a user by email if email exists", async () => {
		const request = {
			url: "http://localhost:3000/api/user?email=john@example.com",
		} as NextApiRequest;

		const response = await GET(request);
		const responseData = await response.json();

		expect(responseData).toEqual([mockUser]);
		expect(mockDBCalls).toHaveBeenCalledWith("users");
		expect(mockDBCalls().select).toHaveBeenCalledWith("*");
		expect(mockDBCalls().eq).toHaveBeenCalledWith("email", "john@example.com");
	});

	it("should return a user by username if username exists", async () => {
		const request = {
			url: "http://localhost:3000/api/user?username=JohnDoe",
		} as NextApiRequest;

		const response = await GET(request);
		const responseData = await response.json();

		expect(responseData).toEqual([mockUser]);
		expect(mockDBCalls).toHaveBeenCalledWith("users");
		expect(mockDBCalls().select).toHaveBeenCalledWith("*");
		expect(mockDBCalls().eq).toHaveBeenCalledWith("username", "JohnDoe");
	});

	it("should return an error when user is not found", async () => {
		mockDBCalls = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: [], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

		const request = {
			url: "http://localhost:3000/api/user?id=999",
		} as NextApiRequest;

		const response = await GET(request);
		const responseData = await response.json();

		expect(responseData).toEqual({ error: "User not found" });
		expect(response.status).toBe(404);
	});

	it("should return an error when no query parameter is provided", async () => {
		const request = {
			url: "http://localhost:3000/api/user",
		} as NextApiRequest;

		const response = await GET(request);
		const responseData = await response.json();

		expect(responseData).toEqual({
			error:
				"At least one query parameter (id, email, or username) is required.",
		});
		expect(response.status).toBe(400);
	});
});

describe("PUT /api/user", () => {
	// let mockDBCalls: jest.Mock;
	// let mockUpdate: jest.Mock;
	// let mockUser: { id: string; username: string; email: string };

	// beforeEach(() => {
	// 	mockUser = {
	// 		id: "1",
	// 		username: "JohnDoe",
	// 		email: "john@example.com",
	// 	};

	// 	mockDBCalls = jest.fn().mockImplementation(() => {
	// 		return {
	// 			select: jest.fn().mockImplementation(() => {
	// 				return {
	// 					eq: jest.fn().mockImplementation(() => {
	// 						return {
	// 							then: jest.fn().mockImplementation((callback) => {
	// 								return Promise.resolve(
	// 									callback({ data: [mockUser], error: null })
	// 								);
	// 							}),
	// 						};
	// 					}),
	// 				};
	// 			}),
	// 			update: jest.fn().mockImplementation(() => {
	// 				return {
	// 					eq: jest.fn().mockImplementation(() => {
	// 						return {
	// 							then: jest.fn().mockImplementation((callback) => {
	// 								return Promise.resolve(
	// 									callback({ data: [mockUser], error: null })
	// 								);
	// 							}),
	// 						};
	// 					}),
	// 				};
	// 			}),
	// 		};
	// 	});

	// 	(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });
	// });

	// passes
	it.only("should update the user when valid data is provided", async () => {
		const mockUser = {
			id: "1",
			username: "John Doe",
			email: "john.doe@gmail.com",
		};

		const updatedUser = {
			id: "1",
			username: "John Updated",
			email: "john.updated@gmail.com",
		};

		const mockDBCalls = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
			}),
			update: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({ data: [updatedUser], error: null }),
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({
			from: mockDBCalls,
		});

		const request = {
			url: "http://localhost:3000/api/user?id=1",
			json: jest.fn().mockResolvedValue({
				username: "JaneDoe",
				email: "jane@example.com",
			}),
		};

		const response = await PUT({
			...request,
			query: {},
			cookies: {},
			body: {},
			env: {},
		} as unknown as NextApiRequest);
		const responseData = await response.json();

		expect(responseData).toEqual({
			message: "User updated successfully",
		});
		expect(mockDBCalls().update().eq).toHaveBeenCalledWith("id", "1");
		expect(mockDBCalls().update().eq).toHaveBeenCalledTimes(1);
	});

	// passes
	it.only("should return an error if no ID is provided", async () => {
		const userWithoutId = {
			username: "JaneDoe",
			email: "jane@example.com",
		};

		const mockDBCalls = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({ data: [userWithoutId], error: null }),
			}),
			update: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({ data: [userWithoutId], error: null }),
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({
			from: mockDBCalls,
		});

		const request = {
			url: "http://localhost:3000/api/user",
			json: jest.fn().mockResolvedValue(userWithoutId),
		};

		const response = await PUT({
			...request,
			query: {},
			cookies: {},
			body: {},
			env: {},
		} as unknown as NextApiRequest);
		const responseData = await response.json();

		expect(responseData).toEqual({
			error: "User ID is required. Must format like so: /api/users?id=2348",
		});
		expect(response.status).toBe(400);
	});

	// passes
	it.only("should return an error if the user doesn't exist in the database", async () => {
		const mockDBCalls = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({ data: [], error: null }),
			}),
			update: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({ data: [], error: null }),
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

		const request = {
			url: "http://localhost:3000/api/user?id=999",
			json: jest.fn().mockResolvedValue({
				username: "JaneDoe",
				email: "jane@example.com",
			}),
		};

		const response = await PUT({
			...request,
			query: {},
			cookies: {},
			body: {},
			env: {},
		} as unknown as NextApiRequest);
		const responseData = await response.json();

		expect(responseData).toEqual({ message: "User not in DB" });
		expect(response.status).toBe(404);
	});

	it("should return an error if no user data is provided", async () => {
		const request = {
			url: "http://localhost:3000/api/user?id=1",
			json: jest.fn().mockResolvedValue({}),
		};

		const response = await PUT({
			...request,
			query: {},
			cookies: {},
			body: {},
			env: {},
		} as unknown as NextApiRequest);
		const responseData = await response.json();

		expect(responseData).toEqual({
			error: "User data to update is required",
		});
		expect(response.status).toBe(400);
	});

	it("should return a server error if update fails", async () => {
		(mockUpdate as jest.Mock).mockReturnValueOnce({
			error: { message: "Database error" },
		});

		const request = {
			url: "http://localhost:3000/api/user?id=1",
			json: jest.fn().mockResolvedValue({
				username: "JaneDoe",
				email: "jane@example.com",
			}),
		};

		const response = await PUT({
			...request,
			query: {},
			cookies: {},
			body: {},
			env: {},
		} as unknown as NextApiRequest);
		const responseData = await response.json();

		expect(responseData).toEqual({ error: "Database error" });
		expect(response.status).toBe(500);
	});
});
