// _____________________________________________________________________________
// This is a test file for the Trips API endpoint
// api/trips
// Route found at src/app/api/trips/route.ts

import { GET } from "@/app/api/trips/route";
import { createClientSSROnly } from "@/app/utils/server/supabase/server";
import { Trip } from "@/app/zod/schemas/trips/TripSchemas/BaseTripSchemas";
import { NextRequest } from "next/server";

// This file is for UNIT tests. It tests API endpoint logic with dummy data, doesn't interact with an actual DB.
// See README in servertests/serverunit tests for more info.
// _____________________________________________________________________________

// Have to set jest-environment manually on all backend tests because it's different from the client tests
// In the client tests it's jsdom, and since we have more client tests than server tests, jsdom is the default in jest.config.ts
/**
 * @jest-environment node
 */

jest.mock("../../../../../src/app/utils/server/supabase/server", () => ({
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

describe("GET /api/trips", () => {
	const mockTrips: Trip[] = [
		// Trip 1: Short distance, no TripOptions
		{
			name: "Weekend Getaway to Napa",
			destination: "Napa Valley, CA",
			origin: "San Francisco, CA",
			notes: "Wine tasting trip with friends.",
			tripType: "SHORT_DISTANCE",
			roundTripDrivingDistanceMiles: 100,
			tripsOrder: 1,
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();

		const mockSupabaseClient = {
			from: jest.fn().mockReturnValue({
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockResolvedValue({
					data: mockTrips,
					error: null,
				}),
			}),
		};

		// Mock supabase client
		(createClientSSROnly as jest.Mock).mockResolvedValue(mockSupabaseClient);
	});

	it("Should return a list of trips by user id", async () => {
		const request = {
			url: "http://localhost:3000/api/trips?userid=1",
		} as unknown as NextRequest;

		const response = await GET(request);
		const responseData = (await response.json()) as unknown as Trip[];

		expect(responseData).toEqual(mockTrips);
	});

	it("Should return an array with one trip when called with /tripss?userid=x&tripid=y", async () => {
		const mockSupabase: jest.Mock = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: [mockTrips[0]], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({
			from: mockSupabase,
		});

		const response = await GET({
			url: "http://localhost:3000/api/trips?userid=1&tripid=1",
			query: {},
			cookies: {},
			body: {},
			env: {},
		} as unknown as NextRequest);

		const responseData = (await response.json()) as unknown as Trip[];

		expect(responseData).toHaveLength(1);
		expect(responseData[0]).toEqual(mockTrips[0]);
		expect(mockSupabase).toHaveBeenCalledWith("trips");
		expect(mockSupabase().select).toHaveBeenCalledWith("*");
		expect(mockSupabase().eq).toHaveBeenCalledWith("id", 1);
	});

	it("Throws 404 error if provided tripid does not exist", async () => {
		const mockSupabase: jest.Mock = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				// If it returns an empty array (data:[]), it means the trip was not found
				return Promise.resolve(callback({ data: [], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({
			from: mockSupabase,
		});

		const request = {
			url: "http://localhost:3000/api/trips?userid=1&tripid=9999",
		} as unknown as NextRequest;
		const response = await GET(request);
		const responseData = (await response.json()) as unknown as {
			error: string;
		};
		console.log("responseData:", responseData);
		expect(response.status).toBe(404);
		expect(responseData.error).toBe("Trip with id 9999 not found");
	});
});
