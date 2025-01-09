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
	let mockFrom: jest.Mock;
	let mockUser: { id: string; username: string; email: string };

	beforeEach(() => {
		mockUser = {
			id: "1",
			username: "JohnDoe",
			email: "john@example.com",
		};

		mockFrom = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: [mockUser], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });
	});

	it("should return a user by id if id exists", async () => {
		const request = {
			url: "http://localhost:3000/api/user?id=1",
		} as NextApiRequest;

		const response = await GET(request);
		const responseData = await response.json();

		expect(responseData).toEqual([mockUser]);
		expect(mockFrom).toHaveBeenCalledWith("users");
		expect(mockFrom().select).toHaveBeenCalledWith("*");
		expect(mockFrom().eq).toHaveBeenCalledWith("id", "1");
	});

	it("should return a user by email if email exists", async () => {
		const request = {
			url: "http://localhost:3000/api/user?email=john@example.com",
		} as NextApiRequest;

		const response = await GET(request);
		const responseData = await response.json();

		expect(responseData).toEqual([mockUser]);
		expect(mockFrom).toHaveBeenCalledWith("users");
		expect(mockFrom().select).toHaveBeenCalledWith("*");
		expect(mockFrom().eq).toHaveBeenCalledWith("email", "john@example.com");
	});

	it("should return a user by username if username exists", async () => {
		const request = {
			url: "http://localhost:3000/api/user?username=JohnDoe",
		} as NextApiRequest;

		const response = await GET(request);
		const responseData = await response.json();

		expect(responseData).toEqual([mockUser]);
		expect(mockFrom).toHaveBeenCalledWith("users");
		expect(mockFrom().select).toHaveBeenCalledWith("*");
		expect(mockFrom().eq).toHaveBeenCalledWith("username", "JohnDoe");
	});

	it("should return an error when user is not found", async () => {
		mockFrom = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: [], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });

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
	// let mockFrom: jest.Mock;
	// let mockUpdate: jest.Mock;
	// let mockUser: { id: string; username: string; email: string };

	// beforeEach(() => {
	// 	mockUser = {
	// 		id: "1",
	// 		username: "JohnDoe",
	// 		email: "john@example.com",
	// 	};

	// 	mockFrom = jest.fn().mockImplementation(() => {
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

	// 	(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });
	// });

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

		const mockFrom = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
			}),
			update: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({ data: [updatedUser], error: null }),
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({
			from: mockFrom,
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
		expect(mockFrom().update().eq).toHaveBeenCalledWith("id", "1");
		expect(mockFrom().update().eq).toHaveBeenCalledTimes(1);
	});

	it("should return an error if no ID is provided", async () => {
		const request = {
			url: "http://localhost:3000/api/user",
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
			error: "User ID is required. Must format like so: /api/users?id=2348",
		});
		expect(response.status).toBe(400);
	});

	it("should return an error if the user doesn't exist in the database", async () => {
		(mockUpdate as jest.Mock).mockReturnValueOnce({
			error: null,
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({
			from: jest.fn().mockReturnValue({
				update: mockUpdate,
				eq: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				then: jest.fn().mockResolvedValue({
					data: [],
					error: null,
				}),
			}),
		});

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
