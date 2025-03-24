// ____________________________________________
// This API route has just one endpoint and one simple purpose.
// It deals with vehiclesOrder, which is a property on each Vehicle
// This determines the order they should display in the UI. It's (theoretically) incremented.
// So when a vehicle is added/deleted/edited, other orders may have to be updated.
// This can be done through DnD in the dashboard, or adding/editing/deleting a vehicle.
// ____________________________________________

import { NextResponse } from "next/server";
import { createClientSSROnly } from "@/app/utils/server/supabase/server";
import { z } from "zod";

const VehiclesOrderUpdateSchema = z.object({
	id: z.string(),
	// Its new order in the UI
	// corresponds to its vehiclesOrder property
	order: z.number(),
});

export const UpdateVehicleOrderRequestSchema = z.object({
	userid: z.string(),
	orderUpdates: z.array(VehiclesOrderUpdateSchema),
});

export type UpdateVehicleOrdersRequest = z.infer<
	typeof UpdateVehicleOrderRequestSchema
>;

export type VehicleOrderUpdate = z.infer<typeof VehiclesOrderUpdateSchema>;

export async function PATCH(
	request: Request
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
	const supabase = await createClientSSROnly();

	try {
		// Parse and validate the request body
		const body: UpdateVehicleOrdersRequest = await request.json();

		// This schema validation is also done in the client
		const isSafe = UpdateVehicleOrderRequestSchema.safeParse(body);

		if (!isSafe.success) {
			console.error(
				"Invalid request body. Make sure you're sending the right format to api/vehicles/order:",
				isSafe.error
			);
			return NextResponse.json(
				{ error: "Invalid request body." },
				{ status: 400 }
			);
		}

		const { userid, orderUpdates } = body;

		// Call the SQL function to update vehicle orders
		const { error } = await supabase.rpc("update_vehicles_order", {
			_userid: userid,
			_vehicle_orders: orderUpdates,
		});

		if (error) {
			console.error("Error updating vehicle orders:", error);
			return NextResponse.json(
				{ error: "Failed to update vehicle orders." },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Error in PATCH /api/vehicles/order:", error);
		return NextResponse.json(
			{ error: "Internal server error." },
			{ status: 500 }
		);
	}
}
