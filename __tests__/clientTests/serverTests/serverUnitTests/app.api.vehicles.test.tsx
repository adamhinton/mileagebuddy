/* eslint-disable @typescript-eslint/no-unused-vars */
// README
// This is a test file for the server-side API route /api/vehicles

import { Vehicle, Vehicles } from "@/utils/server/types/GetVehicleTypes";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { NextRequest } from "next/server";
import { DELETE, GET, POST } from "@/app/api/vehicles/route";
import { stringForJoiningVehicleTables } from "@/utils/server/queries/GetVehiclesQueries";

// This file is for UNIT tests. It tests API endpoint logic with dummy data, doesn't interact with an actual DB.
// See README in servertests/serverunit tests for more info.

// IMPORTANT: All backend tests must have this jest-environment flag at the top of the file, because their jest-environment is different from the one specified in our jest config (since it's different for client vs server tests)
/**
 * @jest-environment node
 */

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

describe("GET /api/vehicles", () => {
	beforeEach(() => {});

	const mockVehicles: Vehicles = [
		{
			type: "gas",
			userid: 1,
			id: 1,
			vehiclesOrder: 1,
			vehicleData: {
				vehicleID: 1,
				vehicleName: "Tesla Model 3",
				year: 2020,
				make: "Tesla",
				model: "Model 3",
				trim: "Base",
				highwayMPG: 35.5,
			},
			gasVehicleData: {
				vehicleID: 1,
				gasCostPerGallon: 3.5,
				milesPerGallonHighway: 35.5,
				milesPerGallonCity: 35.5,
			},
			purchaseAndSales: {
				vehicleID: 1,
				yearPurchased: 2020,
				purchasePrice: 22000.0,
				downPaymentAmount: 2000.0,
				willSellCarAfterYears: 5,
				milesBoughtAt: 10000,
				willSellCarAtMiles: 80000,
				willSellCarAtPrice: 12000.0,
			},
			usage: {
				vehicleID: 1,
				averageDailyMiles: 100,
				weeksPerYear: 52,
				percentHighway: 0.5,
				extraDistanceMiles: 0,
				extraDistancePercentHighway: 0,
			},
			fixedCosts: {
				vehicleID: 1,
				yearlyInsuranceCost: 1000.0,
				yearlyRegistrationCost: 100.0,
				yearlyTaxes: 100.0,
				monthlyLoanPayment: 300.0,
				monthlyWarrantyCost: 30.0,
				inspectionCost: 100.0,
				otherYearlyCosts: 300.0,
			},
			yearlyMaintenanceCosts: {
				vehicleID: 1,
				oilChanges: 100.0,
				tires: 200.0,
				batteries: 300.0,
				brakes: 100.0,
				other: 100.0,
				depreciation: 800.0,
			},
			variableCosts: {
				vehicleID: 1,
				monthlyParkingCosts: 100.0,
				monthlyTolls: 50.0,
				monthlyCarWashCost: 20.0,
				monthlyMiscellaneousCosts: 50.0,
				monthlyCostDeductions: 80.0,
			},
			electricVehicleData: null,
		},
	];

	it("Should return a list of vehicles by user id", async () => {
		const mockDBCalls: jest.Mock = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: mockVehicles, error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

		const request = {
			url: "http://localhost:3000/api/vehicles?userid=1",
		} as NextRequest;

		const response = await GET({
			...request,
			query: {},
			cookies: {},
			body: {},
			env: {},
		} as unknown as NextRequest);

		const responseData = await response.json();

		expect(responseData).toEqual(mockVehicles);
		expect(mockDBCalls).toHaveBeenCalledWith("vehicles");
		expect(mockDBCalls().select).toHaveBeenCalledWith(
			stringForJoiningVehicleTables
		);
		expect(mockDBCalls().eq).toHaveBeenCalledWith("userid", 1);
	});

	it("Should return an array with one vehicle when called with /vehicles?userid=x&vehicleid=y", async () => {
		const mockDBCalls: jest.Mock = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(
					callback({ data: [mockVehicles[0]], error: null })
				);
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

		const request = {
			url: "http://localhost:3000/api/vehicles?userid=1&vehicleid=1",
		} as NextRequest;

		const response = await GET({
			...request,
			query: {},
			cookies: {},
			body: {},
			env: {},
		} as unknown as NextRequest);

		const responseData = await response.json();

		expect(responseData).toEqual([mockVehicles[0]]);
		expect(mockDBCalls).toHaveBeenCalledWith("vehicles");
		expect(mockDBCalls().select).toHaveBeenCalledWith(
			stringForJoiningVehicleTables
		);
		expect(mockDBCalls().eq).toHaveBeenCalledWith("id", 1);
	});

	it("Should return an error on invalid user id", async () => {
		const mockDBCalls: jest.Mock = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: [], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

		const request = {
			url: "http://localhost:3000/api/vehicles",
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
				"userid is required. Must be formatted like: /api/vehicles?userid=2348. Or, optionally, api/vehicles?userid=1234&vehicleid=2348",
		});
	});

	it("Should return an error on invalid vehicle id", async () => {
		const mockDBCalls: jest.Mock = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: [], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

		const request = {
			url: "http://localhost:3000/api/vehicles?userid=1&vehicleid=2348",
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
			error: "Vehicle with id 2348 not found for user with id 1",
		});
	});

	it("Should return empty array if no vehicles found for specified user id", async () => {
		const mockDBCalls: jest.Mock = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: [], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

		const request = {
			url: "http://localhost:3000/api/vehicles?userid=3",
		} as NextRequest;

		const response = await GET({
			...request,
			query: {},
			cookies: {},
			body: {},
			env: {},
		} as unknown as NextRequest);
		const responseData = await response.json();

		expect(responseData).toEqual([]);
	});
});

describe("POST /api/vehicles", () => {
	const mockVehicles: Vehicles = [
		{
			type: "gas",
			userid: 1,
			id: 1,
			vehiclesOrder: 1,
			vehicleData: {
				vehicleID: 1,
				vehicleName: "Tesla Model 3",
				year: 2020,
				make: "Tesla",
				model: "Model 3",
				trim: "Base",
				highwayMPG: 35.5,
			},
			gasVehicleData: {
				vehicleID: 1,
				gasCostPerGallon: 3.5,
				milesPerGallonHighway: 35.5,
				milesPerGallonCity: 35.5,
			},
			purchaseAndSales: {
				vehicleID: 1,
				yearPurchased: 2020,
				purchasePrice: 22000.0,
				downPaymentAmount: 2000.0,
				willSellCarAfterYears: 5,
				milesBoughtAt: 10000,
				willSellCarAtMiles: 80000,
				willSellCarAtPrice: 12000.0,
			},
			usage: {
				vehicleID: 1,
				averageDailyMiles: 100,
				weeksPerYear: 52,
				percentHighway: 0.5,
				extraDistanceMiles: 0,
				extraDistancePercentHighway: 0,
			},
			fixedCosts: {
				vehicleID: 1,
				yearlyInsuranceCost: 1000.0,
				yearlyRegistrationCost: 100.0,
				yearlyTaxes: 100.0,
				monthlyLoanPayment: 300.0,
				monthlyWarrantyCost: 30.0,
				inspectionCost: 100.0,
				otherYearlyCosts: 300.0,
			},
			yearlyMaintenanceCosts: {
				vehicleID: 1,
				oilChanges: 100.0,
				tires: 200.0,
				batteries: 300.0,
				brakes: 100.0,
				other: 100.0,
				depreciation: 800.0,
			},
			variableCosts: {
				vehicleID: 1,
				monthlyParkingCosts: 100.0,
				monthlyTolls: 50.0,
				monthlyCarWashCost: 20.0,
				monthlyMiscellaneousCosts: 50.0,
				monthlyCostDeductions: 80.0,
			},
			electricVehicleData: null,
		},
	];

	it("Should create a vehicle then return the created vehicle object", async () => {
		// Mock the database call to 'insert_vehicle' to return a vehicleID
		const mockInsertVehicle = jest
			.fn()
			.mockResolvedValue({ data: 1, error: null }); // Mocked RPC response

		const mockGetVehicleData = jest.fn().mockResolvedValue({
			data: mockVehicles[0],
			error: null,
		});

		// Mock Supabase client methods
		const supabase = {
			rpc: mockInsertVehicle,
			from: jest.fn().mockReturnValue({
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
				then: jest
					.fn()
					.mockImplementation((cb) => cb({ data: mockVehicles, error: null })),
			}),
		};

		// Mock the Supabase client (You may need to mock the import path depending on how you are using it)
		(createClientSSROnly as jest.Mock).mockReturnValue(supabase);

		const requestBody = mockVehicles[0];

		const request = {
			json: jest.fn().mockResolvedValue(mockVehicles[0]),
			body: mockVehicles[0],
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await POST(request);

		// Mock the response from GET after creating the vehicle
		const createdVehicle = mockVehicles[0];

		const responseData = await response.json();
		expect(responseData).toEqual(createdVehicle);

		expect(mockInsertVehicle).toHaveBeenCalledTimes(1);
	});

	// There are a lot of required fields, we won't test all of them here, just spot-check
	it("Should throw error if submitted without required fields", async () => {
		const completeMockVehicle = mockVehicles[0];
		const mockInsertVehicleWithoutAllFields: Vehicle = {
			userid: 1,
			type: "gas",
			electricVehicleData: completeMockVehicle.electricVehicleData,
			gasVehicleData: completeMockVehicle.gasVehicleData,
			purchaseAndSales: completeMockVehicle.purchaseAndSales,
			usage: completeMockVehicle.usage,
			yearlyMaintenanceCosts: completeMockVehicle.yearlyMaintenanceCosts,
			variableCosts: completeMockVehicle.variableCosts,
			vehicleData: completeMockVehicle.vehicleData,
		} as Vehicle;

		const supabase = {
			rpc: jest.fn().mockResolvedValue({ error: "error" }),
			from: jest.fn().mockReturnValue({
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
				then: jest
					.fn()
					.mockImplementation((cb) => cb({ data: [], error: null })),
			}),
		};
		(createClientSSROnly as jest.Mock).mockReturnValue(supabase);

		const request = {
			json: jest.fn().mockResolvedValue(mockInsertVehicleWithoutAllFields),
			body: mockInsertVehicleWithoutAllFields,
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await POST(request);

		expect(response.status).toBe(500);
		expect(await response.json()).toEqual({
			error: "Failed to insert vehicle data",
		});
	});

	it("Should insert fine if electricVehicleData is null  but gasVehicleData isn't", async () => {
		const completeMockVehicle = mockVehicles[0];
		const vehicleWithNullElectricVehicleData: Vehicle = {
			userid: 1,
			type: "electric",
			vehiclesOrder: 1,
			vehicleData: completeMockVehicle.vehicleData,
			electricVehicleData: null,
			gasVehicleData: null,
			purchaseAndSales: completeMockVehicle.purchaseAndSales,
			usage: completeMockVehicle.usage,
			yearlyMaintenanceCosts: completeMockVehicle.yearlyMaintenanceCosts,
			variableCosts: completeMockVehicle.variableCosts,
			fixedCosts: completeMockVehicle.fixedCosts,
		} as Vehicle;

		const supabase = {
			rpc: jest.fn().mockResolvedValue({ data: 1 }),
			from: jest.fn().mockReturnValue({
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
				then: jest
					.fn()
					.mockImplementation((cb) =>
						cb({ data: [vehicleWithNullElectricVehicleData], error: null })
					),
			}),
		};
		(createClientSSROnly as jest.Mock).mockReturnValue(supabase);

		const request = {
			json: jest.fn().mockResolvedValue(vehicleWithNullElectricVehicleData),
			body: vehicleWithNullElectricVehicleData,
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await POST(request);
		const responseData = await response.json();

		expect(response.status).toBe(200);
		expect(responseData).toEqual(vehicleWithNullElectricVehicleData);
	});

	it("Should insert fine if gasVehicleData is null  but electricVehicleData isn't", async () => {
		const completeMockVehicle = mockVehicles[0];
		const vehicleWithNullGasVehicleData: Vehicle = {
			userid: 1,
			type: "gas",
			vehiclesOrder: 1,
			vehicleData: completeMockVehicle.vehicleData,
			electricVehicleData: null,
			gasVehicleData: null,
			purchaseAndSales: completeMockVehicle.purchaseAndSales,
			usage: completeMockVehicle.usage,
			yearlyMaintenanceCosts: completeMockVehicle.yearlyMaintenanceCosts,
			variableCosts: completeMockVehicle.variableCosts,
			fixedCosts: completeMockVehicle.fixedCosts,
		} as Vehicle;

		const supabase = {
			rpc: jest.fn().mockResolvedValue({ data: 1 }),
			from: jest.fn().mockReturnValue({
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
				then: jest
					.fn()
					.mockImplementation((cb) =>
						cb({ data: [vehicleWithNullGasVehicleData], error: null })
					),
			}),
		};

		(createClientSSROnly as jest.Mock).mockReturnValue(supabase);

		const request = {
			json: jest.fn().mockResolvedValue(vehicleWithNullGasVehicleData),
			body: vehicleWithNullGasVehicleData,
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await POST(request);
		const responseData = await response.json();

		expect(response.status).toBe(200);
		expect(responseData).toEqual(vehicleWithNullGasVehicleData);
	});

	it("Should throw error if both gasVehicleData and electricVehicleData are null", async () => {
		const completeMockVehicle = mockVehicles[0];
		const vehicleWithNullGasVehicleData: Vehicle = {
			userid: 1,
			type: "gas",
			vehiclesOrder: 1,
			vehicleData: completeMockVehicle.vehicleData,
			electricVehicleData: null,
			gasVehicleData: null,
			purchaseAndSales: completeMockVehicle.purchaseAndSales,
			usage: completeMockVehicle.usage,
			yearlyMaintenanceCosts: completeMockVehicle.yearlyMaintenanceCosts,
			variableCosts: completeMockVehicle.variableCosts,
			fixedCosts: completeMockVehicle.fixedCosts,
		} as Vehicle;

		const supabase = {
			rpc: jest.fn().mockResolvedValue({ error: "error" }),
			from: jest.fn().mockReturnValue({
				select: jest.fn().mockReturnThis(),
				eq: jest.fn().mockReturnThis(),
				then: jest
					.fn()
					.mockImplementation((cb) => cb({ data: [], error: null })),
			}),
		};
		(createClientSSROnly as jest.Mock).mockReturnValue(supabase);

		const request = {
			json: jest.fn().mockResolvedValue({ error: "error" }),
			body: vehicleWithNullGasVehicleData,
			headers: { "Content-Type": "application/json" },
		} as unknown as NextRequest;

		const response = await POST(request);
		const responseData = await response.json();

		expect(response.status).toBe(500);
		expect(responseData).toEqual({ error: "Failed to insert vehicle data" });
	});
});

describe("DELETE /api/vehicles", () => {
	const mockVehicles: Vehicles = [
		{
			type: "gas",
			userid: 1,
			id: 1,
			vehiclesOrder: 1,
			vehicleData: {
				vehicleID: 1,
				vehicleName: "Tesla Model 3",
				year: 2020,
				make: "Tesla",
				model: "Model 3",
				trim: "Base",
				highwayMPG: 35.5,
			},
			gasVehicleData: {
				vehicleID: 1,
				gasCostPerGallon: 3.5,
				milesPerGallonHighway: 35.5,
				milesPerGallonCity: 35.5,
			},
			purchaseAndSales: {
				vehicleID: 1,
				yearPurchased: 2020,
				purchasePrice: 22000.0,
				downPaymentAmount: 2000.0,
				willSellCarAfterYears: 5,
				milesBoughtAt: 10000,
				willSellCarAtMiles: 80000,
				willSellCarAtPrice: 12000.0,
			},
			usage: {
				vehicleID: 1,
				averageDailyMiles: 100,
				weeksPerYear: 52,
				percentHighway: 0.5,
				extraDistanceMiles: 0,
				extraDistancePercentHighway: 0,
			},
			fixedCosts: {
				vehicleID: 1,
				yearlyInsuranceCost: 1000.0,
				yearlyRegistrationCost: 100.0,
				yearlyTaxes: 100.0,
				monthlyLoanPayment: 300.0,
				monthlyWarrantyCost: 30.0,
				inspectionCost: 100.0,
				otherYearlyCosts: 300.0,
			},
			yearlyMaintenanceCosts: {
				vehicleID: 1,
				oilChanges: 100.0,
				tires: 200.0,
				batteries: 300.0,
				brakes: 100.0,
				other: 100.0,
				depreciation: 800.0,
			},
			variableCosts: {
				vehicleID: 1,
				monthlyParkingCosts: 100.0,
				monthlyTolls: 50.0,
				monthlyCarWashCost: 20.0,
				monthlyMiscellaneousCosts: 50.0,
				monthlyCostDeductions: 80.0,
			},
			electricVehicleData: null,
		},
	];

	it("Should delete existing vehicle by id and return the deleted vehicle object", async () => {
		const supabase = {
			from: jest.fn().mockReturnValue({
				select: jest.fn().mockReturnValue({
					eq: jest
						.fn()
						.mockResolvedValue({ data: [mockVehicles[0]], error: null }),
				}),
				delete: jest.fn().mockReturnValue({
					eq: jest.fn().mockReturnValue({
						select: jest.fn().mockResolvedValue({
							data: [mockVehicles[0]],
							error: null,
						}),
					}),
				}),
			}),
		};
		(createClientSSROnly as jest.Mock).mockReturnValue(supabase);

		const request = {
			url: "http://localhost:3000/api/vehicles?vehicleid=1",
		} as NextRequest;

		const response = await DELETE(request);
		const responseData = await response.json();

		expect(response.status).toBe(200);
		expect(responseData).toEqual(mockVehicles[0]);
	});

	it.only("Should reject calls without a vehicleid query param", async () => {
		const supabase = {
			from: jest.fn().mockReturnValue({
				select: jest.fn().mockReturnValue({
					eq: jest
						.fn()
						.mockResolvedValue({ data: [mockVehicles[0]], error: null }),
				}),
				delete: jest.fn().mockReturnValue({
					eq: jest.fn().mockReturnValue({
						select: jest.fn().mockResolvedValue({
							data: [mockVehicles[0]],
							error: null,
						}),
					}),
				}),
			}),
		};
		(createClientSSROnly as jest.Mock).mockReturnValue(supabase);

		const request = {
			url: "http://localhost:3000/api/vehicles",
		} as NextRequest;

		const response = await DELETE(request);
		const responseData = await response.json();

		expect(response.status).toBe(400);
		expect(responseData).toEqual({
			error:
				"vehicleid is required. Must be formatted like: /api/vehicles?vehicleid=2348",
		});
	});
});
