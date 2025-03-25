// _____________________________________________________________________________
// This is a types file for the endpoint /api/vehicles/order
// This endpoint is used to update the order of vehicles in the UI, called after DnD functionality on Vehicles
// These schemas and types are to ensure that the data sent to the server is valid
// and to define the structure of the request body
// _____________________________________________________________________________

import { z } from "zod";

export const VehicleOrderUpdateSchema = z.object({
	id: z.number(),
	order: z.number(),
});

export const UpdateVehicleOrderRequestSchema = z.object({
	userid: z.string().uuid(),
	orderUpdates: z.array(VehicleOrderUpdateSchema),
});

export type UpdateVehicleOrdersRequest = z.infer<
	typeof UpdateVehicleOrderRequestSchema
>;

export type VehicleOrderUpdate = z.infer<typeof VehicleOrderUpdateSchema>;
