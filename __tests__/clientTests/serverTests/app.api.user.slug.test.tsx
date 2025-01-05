/* eslint-disable @typescript-eslint/no-unused-vars */
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

// Mock the Supabase client
jest.mock("../../../supabaseUtilsCustom/server", () => ({
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

// describe GET api/user/id. It should return a user by id
// make a mock user object of type User

describe("GET /api/user/slug", () => {});

describe("sanity check", () => {
	it("should return true", () => {
		expect(true).toBe(true);
	});
});
