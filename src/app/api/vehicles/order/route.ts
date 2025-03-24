// ____________________________________________
// This API route has just one endpoint and one simple purpose.
// It deals with vehiclesOrder, which is a property on each Vehicle
// This determines the order they should display in the UI. It's (theoretically) incremented.
// So when a vehicle is added/deleted/edited, other orders may have to be updated.
// This can be done through DnD in the dashboard, or adding/editing/deleting a vehicle.
// ____________________________________________

import { NextResponse } from "next/server";
import { createClientSSROnly } from "@/app/utils/server/supabase/server";

type VehicleOrderUpdate = {
	id: number;
	order: number;
};

type UpdateVehicleOrdersRequest = {
	userid: string;
	orderUpdates: VehicleOrderUpdate[];
};

export async function PATCH(
	request: Request
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
	const supabase = await createClientSSROnly();

	try {
		// Parse and validate the request body
		const body: UpdateVehicleOrdersRequest = await request.json();
		const { userid, orderUpdates } = body;

		if (!userid || !Array.isArray(orderUpdates) || orderUpdates.length === 0) {
			return NextResponse.json(
				{
					error: "Invalid request body. Must include userid and orderUpdates.",
				},
				{ status: 400 }
			);
		}

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
