// README
// This is a test file for the server-side API route /api/vehicles

import { VehiclesArrayReturnedFromDB } from "@/utils/server/types/GetVehicleTypes";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/vehicles/route";
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

	const mockVehicles: VehiclesArrayReturnedFromDB = [
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

	it("Should return a list of vehicles", async () => {
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
});
