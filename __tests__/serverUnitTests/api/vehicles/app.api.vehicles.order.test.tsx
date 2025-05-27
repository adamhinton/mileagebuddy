// ____________________________________________________________________
// This is a test file for the server-side API route /api/vehicles/order
// It tests the PATCH endpoint that updates the display order of vehicles
// PATCH is the only endpoint in api/vehicles/order/route.ts
// _____________________________________________________________________

import { PATCH } from "@/app/api/vehicles/order/route";
import { type UpdateVehicleOrdersRequest } from "@/app/api/vehicles/order/utils/typesAndSchemas";
import { createClientSSROnly } from "@/app/utils/server/supabase/server";

// Have to set jest-environment manually on all backend tests because it's different from the client tests
// In the client tests it's jsdom, and since we have more client tests than server tests, jsdom is the default in jest.config.ts
/**
 * @jest-environment node
 */

jest.mock("@/app/utils/server/supabase/server", () => ({
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

describe("PATCH /api/vehicles/order", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const fakeUserUUID = "3cf4c88c-f6d4-4f03-ab98-15b7f374c246";

	const mockOrderUpdateRequest: UpdateVehicleOrdersRequest = {
		userid: fakeUserUUID,
		orderUpdates: [
			{ id: 1, order: 1 },
			{ id: 2, order: 2 },
			{ id: 3, order: 3 },
		],
	};

	it("Runs without crashing", async () => {
		// Basic mock of Supabase
		const mockRpc = jest.fn().mockResolvedValue({ error: null });
		const supabase = { rpc: mockRpc };
		(createClientSSROnly as jest.Mock).mockResolvedValue(supabase);

		// Mock request
		const request = {
			json: jest.fn().mockResolvedValue(mockOrderUpdateRequest),
		} as unknown as Request;

		// Just verify it doesn't throw
		await expect(PATCH(request)).resolves.not.toThrow();
	});

	it("Updates vehicle orders when valid request is provided", async () => {
		// Mock successful Supabase response
		const mockRpc = jest.fn().mockResolvedValue({ error: null });
		const supabase = { rpc: mockRpc };
		(createClientSSROnly as jest.Mock).mockResolvedValue(supabase);

		// Create request with valid data
		const request = {
			json: jest.fn().mockResolvedValue(mockOrderUpdateRequest),
		} as unknown as Request;

		const response = await PATCH(request);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ success: true });
	});

	it("Returns 400 error for invalid request body format", async () => {
		// Mock Supabase
		const mockRpc = jest.fn();
		const supabase = { rpc: mockRpc };
		(createClientSSROnly as jest.Mock).mockResolvedValue(supabase);

		// Invalid request - missing orderUpdates
		const invalidRequest = {
			json: jest.fn().mockResolvedValue({ userid: fakeUserUUID }),
		} as unknown as Request;

		const response = await PATCH(invalidRequest);

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({ error: "Invalid request body." });

		expect(mockRpc).not.toHaveBeenCalled();
	});

	it("Returns 500 error when database operation fails", async () => {
		// Mock Supabase to return an error
		const mockError = { message: "Database error" };
		const mockRpc = jest.fn().mockResolvedValue({ error: mockError });
		const supabase = { rpc: mockRpc };
		(createClientSSROnly as jest.Mock).mockResolvedValue(supabase);

		// Create request with valid data
		const request = {
			json: jest.fn().mockResolvedValue(mockOrderUpdateRequest),
		} as unknown as Request;

		const response = await PATCH(request);

		expect(response.status).toBe(500);
		expect(await response.json()).toEqual({
			error: "Failed to update vehicle orders.",
		});
	});

	it("Calls Supabase RPC with the correct parameters", async () => {
		// Mock Supabase
		const mockRpc = jest.fn().mockResolvedValue({ error: null });
		const supabase = { rpc: mockRpc };
		(createClientSSROnly as jest.Mock).mockResolvedValue(supabase);

		// Create request with valid data
		const request = {
			json: jest.fn().mockResolvedValue(mockOrderUpdateRequest),
		} as unknown as Request;

		await PATCH(request);

		// Verify RPC was called with correct parameters
		expect(mockRpc).toHaveBeenCalledWith("update_vehicles_order", {
			_userid: mockOrderUpdateRequest.userid,
			_vehicle_orders: mockOrderUpdateRequest.orderUpdates,
		});
	});

	it("Handles unexpected errors during request processing", async () => {
		// Mock Supabase (not needed for this test but included for consistency)
		const supabase = { rpc: jest.fn() };
		(createClientSSROnly as jest.Mock).mockResolvedValue(supabase);

		// Mock request that throws an error when json() is called
		const request = {
			json: jest.fn().mockImplementation(() => {
				throw new Error("JSON parsing error");
			}),
		} as unknown as Request;

		const response = await PATCH(request);

		expect(response.status).toBe(500);
		expect(await response.json()).toEqual({ error: "Internal server error." });
	});

	it("Validates UUID format for userid", async () => {
		const mockRpc = jest.fn();
		const supabase = { rpc: mockRpc };
		(createClientSSROnly as jest.Mock).mockResolvedValue(supabase);

		// Invalid request - invalid UUID format for userid
		const invalidRequest = {
			json: jest.fn().mockResolvedValue({
				userid: "not-a-valid-uuid",
				orderUpdates: [{ id: 1, order: 1 }],
			}),
		} as unknown as Request;

		// Call the PATCH function
		const response = await PATCH(invalidRequest);

		// Verify response
		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			error: "Invalid request body.",
		});
		expect(mockRpc).not.toHaveBeenCalled();
	});

	it("Handles empty orderUpdates array", async () => {
		// Mock Supabase response
		const mockRpc = jest.fn().mockResolvedValue({ error: null });
		const supabase = { rpc: mockRpc };
		(createClientSSROnly as jest.Mock).mockResolvedValue(supabase);

		// Request with empty orderUpdates array
		const emptyOrdersRequest = {
			json: jest.fn().mockResolvedValue({
				userid: fakeUserUUID,
				orderUpdates: [],
			}),
		} as unknown as Request;

		const response = await PATCH(emptyOrdersRequest);

		// Should be valid but do nothing
		expect(response.status).toBe(200);
		expect(mockRpc).toHaveBeenCalledWith("update_vehicles_order", {
			_userid: fakeUserUUID,
			_vehicle_orders: [],
		});
	});

	it("Validates order update items format", async () => {
		// Mock Supabase (not needed for this test)
		const mockRpc = jest.fn();
		const supabase = { rpc: mockRpc };
		(createClientSSROnly as jest.Mock).mockResolvedValue(supabase);

		// Invalid request - orderUpdates contains invalid items
		const invalidRequest = {
			json: jest.fn().mockResolvedValue({
				userid: fakeUserUUID,
				orderUpdates: [
					{ id: "should-be-number", order: 1 },
					{ id: 2, order: "should-be-number" },
				],
			}),
		} as unknown as Request;

		// Call the PATCH function
		const response = await PATCH(invalidRequest);

		// Verify response
		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			error: "Invalid request body.",
		});
		expect(mockRpc).not.toHaveBeenCalled();
	});
});
