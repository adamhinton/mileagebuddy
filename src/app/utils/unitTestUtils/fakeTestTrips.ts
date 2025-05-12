import { Trip } from "@/app/zod/schemas/trips/TripSchemas/BaseTripSchemas";
import testVehicles from "./fakeTestVehicles"; // Assuming this path and that testVehicles exports an array of vehicles with numeric IDs

const fakeTestTrips: Trip[] = [
	// Trip 1: Short distance, 3 options (2 own vehicle, 1 other)
	{
		name: "Weekend Getaway to Napa",
		destination: "Napa Valley, CA",
		origin: "San Francisco, CA",
		notes: "Wine tasting trip with friends.",
		tripType: "SHORT_DISTANCE",
		roundTripDrivingDistanceMiles: 100,
		tripOptions: [
			{
				name: "Drive F-150",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[0].id, // Ford F-150
				parkingCosts: 20,
				tollCosts: 10,
				additionalCosts: 0,
				notes: "Comfortable but less fuel efficient.",
			},
			{
				name: "Drive Prius Prime",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[4].id, // Toyota Prius Prime
				parkingCosts: 20,
				tollCosts: 10,
				additionalCosts: 0,
				notes: "More fuel efficient option.",
			},
			{
				name: "Ride Share",
				transportMode: "OTHER",
				transportationType: "Other", // Representing Uber/Lyft
				transportationCostToDestination: 120,
				transportationCostAtDestination: 50,
				parkingCosts: 0,
				tollCosts: 0,
				additionalCosts: 0,
				notes: "Convenient but potentially costly.",
			},
		],
	},
	// Trip 2: Long distance, 2 options (1 own vehicle, 1 flight)
	{
		name: "Road Trip to National Park",
		destination: "Yellowstone National Park",
		origin: "Denver, CO",
		notes: "Annual family vacation.",
		tripType: "LONG_DISTANCE",
		roundTripDrivingDistanceMiles: 1000,
		departureDate: new Date("2024-07-15"),
		returnDate: new Date("2024-07-22"),
		localDrivingDistanceMiles: 200,
		tripOptions: [
			{
				name: "Drive Toyota Camry",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[1].id, // Toyota Camry
				parkingCosts: 50, // Park entrance + lodging parking
				tollCosts: 5,
				additionalCosts: 0,
				notes: "Scenic route, more luggage space.",
			},
			{
				name: "Fly and Rent Car",
				transportMode: "OTHER",
				transportationType: "Flight",
				transportationCostToDestination: 400, // Flight cost
				transportationCostAtDestination: 300, // Rental car at destination
				parkingCosts: 20, // Parking for rental
				tollCosts: 0,
				additionalCosts: 50, // Airport shuttle
				notes: "Faster, but involves rental logistics.",
			},
		],
	},
	// Trip 3: Short distance, 1 option (own electric vehicle)
	{
		name: "Commute to Work",
		destination: "Downtown Office",
		origin: "Suburban Home",
		notes: "Daily commute.",
		tripType: "SHORT_DISTANCE",
		roundTripDrivingDistanceMiles: 30,
		tripOptions: [
			{
				name: "Drive Tesla Model 3",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[2].id, // Tesla Model 3
				parkingCosts: 15, // Daily parking garage
				tollCosts: 2,
				additionalCosts: 0,
				notes: "Zero emissions commute.",
			},
		],
	},
	// Trip 4: Long distance, 4 options (1 own, 1 flight, 1 train, 1 bus)
	{
		name: "Visit Family Cross-Country",
		destination: "Chicago, IL",
		origin: "New York, NY",
		notes: "Thanksgiving holiday.",
		tripType: "LONG_DISTANCE",
		roundTripDrivingDistanceMiles: 1600,
		departureDate: new Date("2024-11-20"),
		returnDate: new Date("2024-11-28"),
		localDrivingDistanceMiles: 50,
		tripOptions: [
			{
				name: "Drive Nissan Leaf (with stops)",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[3].id, // Nissan Leaf
				parkingCosts: 30,
				tollCosts: 50,
				additionalCosts: 0, // Charging costs are part of vehicle operation, not "additional" here
				notes: "Economical but time-consuming due to charging.",
			},
			{
				name: "Fly Direct",
				transportMode: "OTHER",
				transportationType: "Flight",
				transportationCostToDestination: 350,
				transportationCostAtDestination: 70, // Public transport/rideshare in Chicago
				parkingCosts: 0,
				tollCosts: 0,
				additionalCosts: 0,
			},
			{
				name: "Amtrak Train",
				transportMode: "OTHER",
				transportationType: "Train",
				transportationCostToDestination: 250,
				transportationCostAtDestination: 50,
				parkingCosts: 0,
				tollCosts: 0,
				additionalCosts: 0,
				notes: "Scenic, but slower than flying.",
			},
			{
				name: "Greyhound Bus",
				transportMode: "OTHER",
				transportationType: "Bus",
				transportationCostToDestination: 150,
				transportationCostAtDestination: 50,
				parkingCosts: 0,
				tollCosts: 0,
				additionalCosts: 0,
				notes: "Most budget-friendly, longest travel time.",
			},
		],
	},
	// Trip 5: Short distance, no options yet
	{
		name: "Grocery Run",
		destination: "Local Supermarket",
		origin: "Home",
		tripType: "SHORT_DISTANCE",
		roundTripDrivingDistanceMiles: 5,
		tripOptions: [],
		notes: "Quick trip for essentials.",
	},
	// Trip 6: Long distance, 3 options (own hybrid, rental car, other)
	{
		name: "Conference Trip",
		destination: "Las Vegas, NV",
		origin: "Los Angeles, CA",
		notes: "Attending a professional conference.",
		tripType: "LONG_DISTANCE",
		roundTripDrivingDistanceMiles: 550,
		departureDate: new Date("2025-03-10"),
		returnDate: new Date("2025-03-13"),
		localDrivingDistanceMiles: 30,
		tripOptions: [
			{
				name: "Drive Hyundai Ioniq",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[5].id, // Hyundai Ioniq Plug-in
				parkingCosts: 60, // Hotel parking
				tollCosts: 0,
				additionalCosts: 0,
			},
			{
				name: "Fly and use Ride Share",
				transportMode: "OTHER",
				transportationType: "Flight",
				transportationCostToDestination: 180,
				transportationCostAtDestination: 100, // Ride shares for 3 days
				parkingCosts: 0,
				tollCosts: 0,
				additionalCosts: 0,
			},
			{
				name: "Rent a Car (at origin)",
				transportMode: "OTHER",
				transportationType: "Rental Car",
				transportationCostToDestination: 200, // Cost of rental for the trip duration
				transportationCostAtDestination: 0, // Already have rental
				parkingCosts: 60, // Hotel parking for rental
				tollCosts: 0,
				additionalCosts: 20, // Gas for rental (estimate, could be more detailed if rental was primary focus)
				notes: "If own car is unavailable or not preferred for long drive.",
			},
		],
	},
	// Trip 7: Short distance, 2 options (own gas, own electric)
	{
		name: "Visit Local Park",
		destination: "City Park",
		origin: "Apartment",
		notes: "Afternoon outing.",
		tripType: "SHORT_DISTANCE",
		roundTripDrivingDistanceMiles: 15,
		tripOptions: [
			{
				name: "Take the F-150",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[0].id, // Ford F-150
				parkingCosts: 5,
				tollCosts: 0,
				additionalCosts: 0,
			},
			{
				name: "Take the Leaf",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[3].id, // Nissan Leaf
				parkingCosts: 5,
				tollCosts: 0,
				additionalCosts: 0,
			},
		],
	},
	// Trip 8: Long distance, 5 options
	{
		name: "Beach Vacation",
		destination: "Miami, FL",
		origin: "Atlanta, GA",
		notes: "Spring break trip.",
		tripType: "LONG_DISTANCE",
		roundTripDrivingDistanceMiles: 1300,
		departureDate: new Date("2025-04-05"),
		returnDate: new Date("2025-04-12"),
		localDrivingDistanceMiles: 100,
		tripOptions: [
			{
				name: "Drive Prius Prime",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[4].id, // Toyota Prius Prime
				parkingCosts: 100, // Hotel + beach parking
				tollCosts: 20,
				additionalCosts: 0,
			},
			{
				name: "Fly to Miami",
				transportMode: "OTHER",
				transportationType: "Flight",
				transportationCostToDestination: 300,
				transportationCostAtDestination: 150, // Ubers/Lyfts
				parkingCosts: 0,
				tollCosts: 0,
				additionalCosts: 0,
			},
			{
				name: "Fly and Rent Convertible",
				transportMode: "OTHER",
				transportationType: "Flight",
				transportationCostToDestination: 300,
				transportationCostAtDestination: 400, // Rental car for a week
				parkingCosts: 100,
				tollCosts: 10,
				additionalCosts: 0,
				notes: "Fun beach car experience",
			},
			{
				name: "Bus to Miami",
				transportMode: "OTHER",
				transportationType: "Bus",
				transportationCostToDestination: 120,
				transportationCostAtDestination: 100, // Local transport
				parkingCosts: 0,
				tollCosts: 0,
				additionalCosts: 0,
			},
			{
				name: "Train to Miami",
				transportMode: "OTHER",
				transportationType: "Train",
				transportationCostToDestination: 220,
				transportationCostAtDestination: 120, // Local transport
				parkingCosts: 0,
				tollCosts: 0,
				additionalCosts: 0,
			},
		],
	},
	// Trip 9: Short distance, 4 options
	{
		name: "Weekend Shopping",
		destination: "Outlet Mall",
		origin: "Home",
		notes: "Buying new clothes.",
		tripType: "SHORT_DISTANCE",
		roundTripDrivingDistanceMiles: 60,
		tripOptions: [
			{
				name: "Drive Camry",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[1].id, // Toyota Camry
				parkingCosts: 0,
				tollCosts: 5,
				additionalCosts: 0,
			},
			{
				name: "Drive Model 3",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[2].id, // Tesla Model 3
				parkingCosts: 0,
				tollCosts: 5,
				additionalCosts: 0,
			},
			{
				name: "Carpool with Friend (share gas)",
				transportMode: "OTHER",
				transportationType: "Other",
				transportationCostToDestination: 10, // Contribution to gas
				transportationCostAtDestination: 0,
				parkingCosts: 0,
				tollCosts: 2.5, // Shared toll
				additionalCosts: 0,
				notes: "Friend drives their car.",
			},
			{
				name: "Public Bus",
				transportMode: "OTHER",
				transportationType: "Bus",
				transportationCostToDestination: 4,
				transportationCostAtDestination: 0,
				parkingCosts: 0,
				tollCosts: 0,
				additionalCosts: 0,
				notes: "Takes longer but very cheap.",
			},
		],
	},
	// Trip 10: Long distance, 6 options
	{
		name: "International Trip (Conceptual)",
		destination: "London, UK",
		origin: "Boston, MA",
		notes: "Vacation abroad. Driving part is to/from airport.",
		tripType: "LONG_DISTANCE",
		// This driving distance would be to/from the airport on the origin side
		roundTripDrivingDistanceMiles: 50,
		departureDate: new Date("2025-09-01"),
		returnDate: new Date("2025-09-15"),
		localDrivingDistanceMiles: 150, // Using Tube, taxis, and maybe a day-trip rental in UK
		tripOptions: [
			{
				name: "Drive Ioniq to Airport & Park",
				transportMode: "OWN_VEHICLE",
				vehicleId: testVehicles[5].id, // Hyundai Ioniq
				// These costs are for the airport leg of the "OWN_VEHICLE" part
				parkingCosts: 200, // Long-term airport parking
				tollCosts: 10,
				additionalCosts: 0, // The flight itself is a separate "OTHER" option or part of it
				notes:
					"This option only covers getting to/from Boston Logan with own car.",
			},
			{
				name: "Fly to London (Economy)",
				transportMode: "OTHER",
				transportationType: "Flight",
				transportationCostToDestination: 700,
				transportationCostAtDestination: 200, // Oyster card, some taxis
				parkingCosts: 0, // Assuming not renting a car for the whole duration
				tollCosts: 0,
				additionalCosts: 0,
			},
			{
				name: "Fly to London (Business Class)",
				transportMode: "OTHER",
				transportationType: "Flight",
				transportationCostToDestination: 2500,
				transportationCostAtDestination: 300, // More taxis, maybe a private car hire for a day
				parkingCosts: 0,
				tollCosts: 0,
				additionalCosts: 100, // Airport lounge access if not included
			},
			{
				name: "Taxi to Airport + Flight (Economy)",
				transportMode: "OTHER",
				transportationType: "Flight", // Primary mode
				transportationCostToDestination: 700 + 80, // Flight + Taxi to Logan
				transportationCostAtDestination: 200,
				parkingCosts: 0,
				tollCosts: 0,
				additionalCosts: 0,
				notes: "Combines taxi for airport drop-off with flight cost.",
			},
			{
				name: "Drive to NY, Fly from JFK (Cheaper flight)",
				transportMode: "OWN_VEHICLE", // For the drive to NY
				vehicleId: testVehicles[0].id, // Ford F-150 (example for a longer drive)
				parkingCosts: 150, // Parking near JFK
				tollCosts: 40, // Tolls to/from NY
				additionalCosts: 0, // Flight cost handled in a linked "OTHER" option if app supported linked options, or user notes it
				notes:
					"Drive to a different airport for a cheaper flight. Flight cost itself would be separate.",
			},
			{
				name: "Fly from JFK (after driving there)",
				transportMode: "OTHER",
				transportationType: "Flight",
				transportationCostToDestination: 550, // Cheaper flight from JFK
				transportationCostAtDestination: 200,
				parkingCosts: 0, // Parking handled by the "Drive to NY" option
				tollCosts: 0,
				additionalCosts: 0,
				notes: "The flight part of the 'Drive to NY, Fly from JFK' strategy.",
			},
		],
	},
];

export default fakeTestTrips;
