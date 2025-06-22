// _____________________________________________________________________________
// This is a test file for the Trips API endpoint
// api/trips
// Route found at src/app/api/trips/route.ts

import { DELETE, GET, PATCH, POST } from "@/app/api/trips/route";
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
		tripOptions: [],
	},
	// Trip 2: Long distance, with TripOptions
	{
		name: "Cross-Country Road Trip",
		destination: "New York, NY",
		origin: "Los Angeles, CA",
		notes: "Epic road trip across the country.",
		tripType: "LONG_DISTANCE",
		roundTripDrivingDistanceMiles: 3000,
		tripsOrder: 2,
		departureDate: new Date(),
		localDrivingDistanceMiles: 100,
		tripOptions: [],
	},
];

describe("GET /api/trips", () => {
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

	it("Should return an array with one trip when called with /trips?userid=x&tripid=y", async () => {
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

	it("Should return an empty array if no trips are found for the user", async () => {
		const mockSupabase: jest.Mock = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: [], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({
			from: mockSupabase,
		});

		const request = {
			url: "http://localhost:3000/api/trips?userid=9999",
		} as unknown as NextRequest;

		const response = await GET(request);
		const responseData = (await response.json()) as unknown as Trip[];

		expect(responseData).toEqual([]);
	});

	it("Should return an error if user id not provided", async () => {
		const mockSupabase: jest.Mock = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: [], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockSupabase });

		const request = {
			url: "http://localhost:3000/api/trips",
		} as NextRequest;

		const response = await GET({
			...request,
			query: {},
			cookies: {},
			body: {},
			env: {},
		} as unknown as NextRequest);
		const responseData = await response.json();

		expect(responseData).toEqual({
			error:
				"userid is required. Must be formatted like: /api/trips?userid=2348. Or, optionally, api/trips?userid=1234&tripid=2348",
		});
	});
});

// TODO: More Trips POST tests when we have validation in place. One of tehse tests has already been written, but is skipped.
describe("POST /api/trips", () => {
	it("Should create a Trip then return the created trip", async () => {
		const mockInsertTrip = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			single: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: mockTrips[0], error: null }));
			}),
		});

		const mockSupabase = {
			from: jest.fn().mockReturnValue({
				insert: mockInsertTrip,
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
			}),
		};

		(createClientSSROnly as jest.Mock).mockReturnValue(mockSupabase);

		const request = {
			json: jest.fn().mockResolvedValue(mockTrips[0]),
			url: "http://localhost:3000/api/trips",
			method: "POST",
			body: mockTrips[0],
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await POST(request);
		const responseData = await response.json();

		const createdTrip = mockTrips[0];
		expect(responseData).toEqual(createdTrip);
	});

	// TODO STRETCH: tests for POST with missing fields

	it("Should insert short distance trip without errors", async () => {
		const mockInsertTrip = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			single: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: mockTrips[0], error: null }));
			}),
		});

		const mockSupabase = {
			from: jest.fn().mockReturnValue({
				insert: mockInsertTrip,
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
			}),
		};

		(createClientSSROnly as jest.Mock).mockReturnValue(mockSupabase);

		const request = {
			json: jest.fn().mockResolvedValue(mockTrips[0]),
			url: "http://localhost:3000/api/trips",
			method: "POST",
			body: mockTrips[0],
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await POST(request);
		const responseData = await response.json();

		expect(responseData).toEqual(mockTrips[0]);
	});

	it("Should insert a long distance trip without errors", async () => {
		const longDistanceTrip: Trip = {
			name: "Cross-Country Road Trip",
			destination: "New York, NY",
			origin: "Los Angeles, CA",
			notes: "Epic road trip across the country.",
			tripType: "LONG_DISTANCE",
			roundTripDrivingDistanceMiles: 3000,
			tripsOrder: 1,
			departureDate: new Date(),
			localDrivingDistanceMiles: 100,
		};

		const mockInsertTrip = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			single: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(
					callback({ data: longDistanceTrip, error: null })
				);
			}),
		});

		const mockSupabase = {
			from: jest.fn().mockReturnValue({
				insert: mockInsertTrip,
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
			}),
		};

		(createClientSSROnly as jest.Mock).mockReturnValue(mockSupabase);

		const request = {
			json: jest.fn().mockResolvedValue(longDistanceTrip),
			url: "http://localhost:3000/api/trips",
			method: "POST",
			body: longDistanceTrip,
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await POST(request);
		const responseData = await response.json();

		expect(responseData).toEqual(longDistanceTrip);
		expect(mockInsertTrip).toHaveBeenCalledWith([longDistanceTrip]);
	});

	// Unskip this when we have validation in place
	it.skip("Should reject POST request with 400 if trip data is invalid", async () => {
		const invalidTrip = {
			name: "Invalid Trip",
			destination: "Nowhere",
			origin: "Somewhere",
			notes: "This trip has no tripType.",
			// Missing tripType, which is required
			roundTripDrivingDistanceMiles: 50,
			tripsOrder: 1,
		};

		const request = {
			json: jest.fn().mockResolvedValue(invalidTrip),
			url: "http://localhost:3000/api/trips",
			method: "POST",
			body: invalidTrip,
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await POST(request);
		expect(response.status).toBe(400);
		const responseData = await response.json();
		expect(responseData.error).toBe("Invalid trip data provided");
	});
});

// TODO more PATCH tests when we have validation in place
describe("PATCH /api/trips", () => {
	it("Should update existing short distance Trip by id and return the updated trip", async () => {
		const updatedTrip: Trip = {
			...mockTrips[0],
			name: "Updated Weekend Getaway to Napa",
			notes: "Updated notes for the trip.",
		};

		const mockUpdateTrip = jest.fn().mockReturnValue({
			eq: jest.fn().mockReturnThis(),
			select: jest.fn().mockReturnThis(),
			single: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: updatedTrip, error: null }));
			}),
		});

		const mockSupabase = {
			from: jest.fn().mockReturnValue({
				update: mockUpdateTrip,
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
			}),
		};

		(createClientSSROnly as jest.Mock).mockReturnValue(mockSupabase);

		const request = {
			json: jest.fn().mockResolvedValue(updatedTrip),
			url: "http://localhost:3000/api/trips?userid=1&tripid=1",
			method: "PATCH",
			body: updatedTrip,
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await PATCH(request);
		const responseData = await response.json();

		expect(responseData).toEqual(updatedTrip);
		expect(mockUpdateTrip).toHaveBeenCalledWith(updatedTrip);
	});

	it("Should update existing long distance Trip by id and return the updated trip", async () => {
		const updatedTrip: Trip = {
			...mockTrips[1],
			name: "Updated Cross-Country Road Trip",
			notes: "Updated notes for the long distance trip.",
		};

		const mockUpdateTrip = jest.fn().mockReturnValue({
			eq: jest.fn().mockReturnThis(),
			select: jest.fn().mockReturnThis(),
			single: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: updatedTrip, error: null }));
			}),
		});

		const mockSupabase = {
			from: jest.fn().mockReturnValue({
				update: mockUpdateTrip,
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
			}),
		};

		(createClientSSROnly as jest.Mock).mockReturnValue(mockSupabase);

		const request = {
			json: jest.fn().mockResolvedValue(updatedTrip),
			url: "http://localhost:3000/api/trips?userid=1&tripid=2",
			method: "PATCH",
			body: updatedTrip,
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await PATCH(request);
		const responseData = await response.json();

		expect(responseData).toEqual(updatedTrip);
		expect(mockUpdateTrip).toHaveBeenCalledWith(updatedTrip);
	});

	it("Should return 404 if trip with given id does not exist", async () => {
		const mockUpdateTrip = jest.fn().mockReturnValue({
			eq: jest.fn().mockReturnThis(),
			select: jest.fn().mockReturnThis(),
			single: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: null, error: null }));
			}),
		});

		const mockSupabase = {
			from: jest.fn().mockReturnValue({
				update: mockUpdateTrip,
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
			}),
		};

		(createClientSSROnly as jest.Mock).mockReturnValue(mockSupabase);

		const request = {
			json: jest.fn().mockResolvedValue(mockTrips[0]),
			url: "http://localhost:3000/api/trips?userid=1&tripid=9999",
			method: "PATCH",
			body: mockTrips[0],
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await PATCH(request);
		expect(response.status).toBe(404);
		const responseData = await response.json();
		expect(responseData.error).toBe("Trip with id 9999 not found");
	});

	// Reinstate this test when we have validation in place
	it.skip("Should return 400 if trip data is invalid", async () => {
		const invalidTrip = {
			name: "Invalid Trip",
			destination: "Nowhere",
			origin: "Somewhere",
			notes: "This trip has no tripType.",
			// Missing tripType, which is required
			roundTripDrivingDistanceMiles: 50,
			tripsOrder: 1,
		};

		const request = {
			json: jest.fn().mockResolvedValue(invalidTrip),
			url: "http://localhost:3000/api/trips?userid=1&tripid=1",
			method: "PATCH",
			body: invalidTrip,
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await PATCH(request);
		expect(response.status).toBe(400);
		const responseData = await response.json();
		expect(responseData.error).toBe("Invalid trip data provided");
	});

	it("Should throw error if trip id is missing", async () => {
		const request = {
			json: jest.fn().mockResolvedValue(mockTrips[0]),
			url: "http://localhost:3000/api/trips",
			method: "PATCH",
			body: mockTrips[0],
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await PATCH(request);
		console.log("response:", response);
		const responseData = await response.json();
		expect(responseData.status).toBe(400);
		console.log("responseData:", responseData);
		expect(responseData.error).toBe(
			"tripid is required. Must be formatted like: /api/trips?tripid=2348"
		);
	});
});

describe("DELETE /api/trips", () => {
	it("Should delete a trip by id and return the deleted trip", async () => {
		const mockDeleteTrip = jest.fn().mockReturnValue({
			eq: jest.fn().mockReturnThis(),
			select: jest.fn().mockReturnThis(),
			single: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: mockTrips[0], error: null }));
			}),
		});
		const mockSupabase = {
			from: jest.fn().mockReturnValue({
				delete: mockDeleteTrip,
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
			}),
		};

		(createClientSSROnly as jest.Mock).mockReturnValue(mockSupabase);

		const request = {
			url: "http://localhost:3000/api/trips?tripid=1",
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await DELETE(request);
		const responseData = await response.json();

		expect(responseData).toEqual({
			message: "Trip with id 1 deleted successfully",
		});
	});

	it("Should reject calls without a tripid", async () => {
		const request = {
			url: "http://localhost:3000/api/trips",
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await DELETE(request);
		const responseData = await response.json();

		expect(response.status).toBe(400);
		expect(responseData.error).toBe(
			"tripid is required. Must be formatted like: /api/trips?tripid=2348"
		);
	});

	it("Should throw 404 if trip with given id does not exist", async () => {
		const mockDeleteTrip = jest.fn().mockReturnValue({
			eq: jest.fn().mockReturnThis(),
			select: jest.fn().mockReturnThis(),
			single: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: null, error: null }));
			}),
		});

		const mockSupabase = {
			from: jest.fn().mockReturnValue({
				delete: mockDeleteTrip,
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
			}),
		};

		(createClientSSROnly as jest.Mock).mockReturnValue(mockSupabase);

		const request = {
			url: "http://localhost:3000/api/trips?tripid=9999",
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await DELETE(request);
		expect(response.status).toBe(404);
		const responseData = await response.json();
		expect(responseData.error).toBe("Trip with id 9999 not found");
	});
});
