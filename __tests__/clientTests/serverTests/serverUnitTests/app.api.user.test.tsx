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

// similar tests to GET. Update user's email and username. Return error on invalid ID. Structured similarly to above test
describe("PUT /api/user", () => {});
