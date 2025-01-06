/* eslint-disable @typescript-eslint/no-unused-vars */
import { GET } from "@/app/api/user/route";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

jest.mock("../../../../supabaseUtilsCustom/server", () => ({
	createClientSSROnly: jest.fn(),
}));

jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn((data) => ({
			json: jest.fn().mockResolvedValue(data),
		})),
	},
}));

describe("GET /api/user", () => {
	it("should return a user by id if id exists", async () => {
		const mockUser = {
			id: "1",
			username: "John Doe",
			email: "bob.smithjones@gmail.com",
		};

		const mockFrom = jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			then: jest.fn().mockImplementation((callback) => {
				return Promise.resolve(callback({ data: [mockUser], error: null }));
			}),
		});

		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockFrom });
		const request = {
			url: "http://localhost:3000/api/user?id=1",
		} as NextApiRequest;

		const response = await GET(request);
		const responseData = await response.json();

		expect(responseData).toEqual([mockUser]);

		expect(mockFrom).toHaveBeenCalledWith("users");
		expect(mockFrom().select).toHaveBeenCalledWith("*");
		expect(mockFrom().eq).toHaveBeenCalledWith("id", "1");
	});
});
