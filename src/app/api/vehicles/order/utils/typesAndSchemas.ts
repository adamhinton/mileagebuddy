// _____________________________________________________________________________
// This is a types file for the endpoint /api/vehicles/order
// This endpoint is used to update the order of vehicles in the UI, called after DnD functionality on Vehicles
// These schemas and types are to ensure that the data sent to the server is valid
// and to define the structure of the request body
// _____________________________________________________________________________

import { z } from "zod";

export const VehicleOrderUpdateSchema = z.object({
	// Vehicle's ID in the db
	id: z.number(),
	// Order of the vehicle in the UI. Starts from 1 sequentially
	order: z.number(),
});

export const UpdateVehicleOrderRequestSchema = z.object({
	// Middleware checks that the vehicles in question belong to this user
	userid: z.string().uuid(),
	orderUpdates: z.array(VehicleOrderUpdateSchema),
});

export type UpdateVehicleOrdersRequest = z.infer<
	typeof UpdateVehicleOrderRequestSchema
>;

export type VehicleOrderUpdate = z.infer<typeof VehicleOrderUpdateSchema>;
