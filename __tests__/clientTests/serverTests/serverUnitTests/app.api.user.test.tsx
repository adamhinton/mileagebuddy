// README:
// Ignore everything below. This is DEPRECATED because I've transitioned away from my own users endpoint to just using supabase's auth.users
// Keeping this for now in case I still implement some sort of users endpoint, but will likely delete later
// TODO delete users endpoint test file if not needed

// Have to have one test in this file or VScode complains
describe("Sanity check", () => {
	it("should pass", () => {
		expect(true).toBe(true);
	});
});

// // README
// // This is a test file for the server-side API route /api/user
// // Testing the GET operation to fetch a user by id

// // This file is for UNIT tests. It tests API endpoint logic with dummy data, doesn't interact with an actual DB.
// // See README in servertests/serverunit tests for more info.

// // IMPORTANT: All backend tests must have this jest-environment flag at the top of the file, because their jest-environment is different from the one specified in our jest config (since it's different for client vs server tests)
// /**
//  * @jest-environment node
//  */

// import { DELETE, GET, PUT, POST } from "@/app/api/user/route";
// import { createClientSSROnly } from "../../../../src/app/utils/server/supabase/server";
// import { NextRequest } from "next/server";

// // Mock the Supabase client
// jest.mock("../../../../src/app/utils/server/supabase/server", () => ({
// 	createClientSSROnly: jest.fn(),
// }));

// jest.mock("next/server", () => ({
// 	NextResponse: {
// 		json: jest.fn((data, options) => ({
// 			json: jest.fn().mockResolvedValue(data),
// 			...options,
// 		})),
// 	},
// }));

// describe("GET /api/user", () => {
// 	let mockDBCalls: jest.Mock;
// 	let mockUser: { id: string; isDarkMode: boolean; email: string };

// 	beforeEach(() => {
// 		mockUser = {
// 			id: "1",
// 			email: "john@example.com",
// 			isDarkMode: false,
// 		};

// 		mockDBCalls = jest.fn().mockReturnValue({
// 			select: jest.fn().mockReturnThis(),
// 			eq: jest.fn().mockReturnThis(),
// 			then: jest.fn().mockImplementation((callback) => {
// 				return Promise.resolve(callback({ data: [mockUser], error: null }));
// 			}),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });
// 	});

// 	it("should return a user by id if id exists", async () => {
// 		const request = {
// 			url: "http://localhost:3000/api/user?id=1",
// 		} as NextRequest;

// 		const response = await GET(request);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual([mockUser]);
// 		expect(mockDBCalls).toHaveBeenCalledWith("users");
// 		expect(mockDBCalls().select).toHaveBeenCalledWith("*");
// 		expect(mockDBCalls().eq).toHaveBeenCalledWith("id", 1);
// 	});

// 	it("should return a user by email if email exists", async () => {
// 		const request = {
// 			url: "http://localhost:3000/api/user?email=john@example.com",
// 		} as NextRequest;

// 		const response = await GET(request);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual([mockUser]);
// 		expect(mockDBCalls).toHaveBeenCalledWith("users");
// 		expect(mockDBCalls().select).toHaveBeenCalledWith("*");
// 		expect(mockDBCalls().eq).toHaveBeenCalledWith("email", "john@example.com");
// 	});

// 	it("should return an error when user is not found", async () => {
// 		mockDBCalls = jest.fn().mockReturnValue({
// 			select: jest.fn().mockReturnThis(),
// 			eq: jest.fn().mockReturnThis(),
// 			then: jest.fn().mockImplementation((callback) => {
// 				return Promise.resolve(callback({ data: [], error: null }));
// 			}),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

// 		const request = {
// 			url: "http://localhost:3000/api/user?id=999",
// 		} as NextRequest;

// 		const response = await GET(request);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({ error: "User not found" });
// 		expect(response.status).toBe(404);
// 	});

// 	it("should return an error when no query parameter is provided", async () => {
// 		const request = {
// 			url: "http://localhost:3000/api/user",
// 		} as NextRequest;

// 		const response = await GET(request);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({
// 			error: "At least one query parameter (id or email) is required.",
// 		});
// 		expect(response.status).toBe(400);
// 	});
// });

// describe("PUT /api/user", () => {
// 	it("should update the user when valid data is provided", async () => {
// 		const mockUser = {
// 			id: 1,
// 			isDarkMode: true,
// 			email: "john.doe@gmail.com",
// 		};

// 		const updatedUser = {
// 			id: 1,
// 			isDarkMode: false,
// 			email: "john.updated@gmail.com",
// 		};

// 		const mockDBCalls = jest.fn().mockReturnValue({
// 			select: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
// 			}),
// 			update: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [updatedUser], error: null }),
// 			}),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({
// 			from: mockDBCalls,
// 		});

// 		const request = {
// 			url: "http://localhost:3000/api/user?id=1",
// 			json: jest.fn().mockResolvedValue({
// 				email: "jane@example.com",
// 				isDarkMode: true,
// 			}),
// 		};

// 		const response = await PUT({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({
// 			message: "User updated successfully",
// 			data: [updatedUser],
// 		});
// 		expect(mockDBCalls().update().eq).toHaveBeenCalledWith("id", 1);
// 		expect(mockDBCalls().update().eq).toHaveBeenCalledTimes(1);
// 	});

// 	it("should update the user when only passed an isDarkMode change", async () => {
// 		const mockUser = {
// 			id: 1,
// 			isDarkMode: true,
// 			email: "john.doe@gmail.com",
// 		};

// 		const updatedUser = {
// 			id: 1,
// 			isDarkMode: false,
// 			email: "john.doe@gmail.com",
// 		};

// 		const mockDBCalls = jest.fn().mockReturnValue({
// 			select: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
// 			}),
// 			update: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [updatedUser], error: null }),
// 			}),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({
// 			from: mockDBCalls,
// 		});

// 		const request = {
// 			url: "http://localhost:3000/api/user?id=1",
// 			json: jest.fn().mockResolvedValue({
// 				isDarkMode: false,
// 			}),
// 		};

// 		const response = await PUT({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({
// 			message: "User updated successfully",
// 			data: [updatedUser],
// 		});
// 		expect(mockDBCalls().update().eq).toHaveBeenCalledWith("id", 1);
// 		expect(mockDBCalls().update().eq).toHaveBeenCalledTimes(1);
// 	});

// 	it("should update the user when only passed an email change", async () => {
// 		const mockUser = {
// 			id: 1,
// 			isDarkMode: true,
// 			email: "john.doe@gmail.com",
// 		};

// 		const updatedUser = {
// 			id: 1,
// 			isDarkMode: true,
// 			email: "jane@example.com",
// 		};

// 		const mockDBCalls = jest.fn().mockReturnValue({
// 			select: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
// 			}),
// 			update: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [updatedUser], error: null }),
// 			}),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({
// 			from: mockDBCalls,
// 		});

// 		const request = {
// 			url: "http://localhost:3000/api/user?id=1",
// 			json: jest.fn().mockResolvedValue({
// 				email: "jane@example.com",
// 			}),
// 		};

// 		const response = await PUT({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({
// 			message: "User updated successfully",
// 			data: [updatedUser],
// 		});
// 		expect(mockDBCalls().update().eq).toHaveBeenCalledWith("id", 1);
// 		expect(mockDBCalls().update().eq).toHaveBeenCalledTimes(1);
// 	});

// 	it("should return an error if no ID is provided", async () => {
// 		const userWithoutId = {
// 			email: "jane@example.com",
// 			isDarkMode: true,
// 		};

// 		const mockDBCalls = jest.fn().mockReturnValue({
// 			select: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [userWithoutId], error: null }),
// 			}),
// 			update: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [userWithoutId], error: null }),
// 			}),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({
// 			from: mockDBCalls,
// 		});

// 		const request = {
// 			url: "http://localhost:3000/api/user",
// 			json: jest.fn().mockResolvedValue(userWithoutId),
// 		};

// 		const response = await PUT({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({
// 			error: "User ID is required. Must format like so: /api/users?id=2348",
// 		});
// 		expect(response.status).toBe(400);
// 	});

// 	it("should return an error if the user doesn't exist in the database", async () => {
// 		const mockDBCalls = jest.fn().mockReturnValue({
// 			select: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [], error: null }),
// 			}),
// 			update: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [], error: null }),
// 			}),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

// 		const request = {
// 			url: "http://localhost:3000/api/user?id=999",
// 			json: jest.fn().mockResolvedValue({
// 				email: "jane@example.com",
// 				isDarkMode: false,
// 			}),
// 		};

// 		const response = await PUT({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({ message: "User not in DB" });
// 		expect(response.status).toBe(404);
// 	});

// 	it("should return an error if no user data is provided", async () => {
// 		const request = {
// 			url: "http://localhost:3000/api/user?id=1",
// 			json: jest.fn().mockResolvedValue({}),
// 		};

// 		const mockUser = {
// 			id: "1",
// 			email: "john.doe@gmail.com",
// 			isDarkMode: false,
// 		};

// 		const mockDBCalls = jest.fn().mockReturnValue({
// 			select: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
// 			}),
// 			update: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [], error: null }),
// 			}),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

// 		const response = await PUT({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({
// 			error: "User data to update is required",
// 		});
// 		expect(response.status).toBe(400);
// 	});
// });

// describe("DELETE /api/user", () => {
// 	it("should delete a user by id if id exists", async () => {
// 		const mockUsers = [
// 			{ id: 1, email: "bob.smithjones@gmail.com", isDarkMode: false },
// 			{ id: 1, email: "jane.smith@gmail.com", isDarkMode: true },
// 		];
// 		const mockDBCalls = jest.fn().mockReturnValue({
// 			select: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: mockUsers, error: null }),
// 			}),
// 			delete: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
// 			}),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

// 		const request = {
// 			url: "http://localhost:3000/api/user?id=1",
// 			method: "DELETE",
// 		} as NextRequest;

// 		const response = await DELETE({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({
// 			message: "User deleted successfully",
// 			data: [
// 				{
// 					id: 1,
// 				},
// 			],
// 		});
// 	});

// 	it("should return an error if the user doesn't exist in the database", async () => {
// 		const mockDBCalls = jest.fn().mockReturnValue({
// 			select: jest.fn().mockReturnValue({
// 				// DELETE first searches for user in DB, this simulates user not existing
// 				eq: jest.fn().mockResolvedValue({ data: [], error: null }),
// 			}),
// 			// Don't need this since the function never gets as far as trying to delete user
// 			// delete: jest.fn().mockReturnValue({
// 			// 	eq: jest.fn().mockResolvedValue({ data: [], error: null }),
// 			// }),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

// 		const request = {
// 			url: "http://localhost:3000/api/user?id=999",
// 			method: "DELETE",
// 		} as NextRequest;

// 		const response = await DELETE({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({ message: "User not in DB" });
// 	});

// 	it("should return an error if no user id is provided", async () => {
// 		const request = {
// 			url: "http://localhost:3000/api/user",
// 			method: "DELETE",
// 		} as NextRequest;

// 		const response = await DELETE({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({
// 			error: "User ID is required. Must format like so: /api/users?id=2348",
// 		});
// 	});
// });

// describe("POST /api/user", () => {
// 	it("should create a new user and return the created user object", async () => {
// 		const mockNewUser = {
// 			isDarkMode: true,
// 			email: "bob.smithjones@gmail.com",
// 		};

// 		const mockDBCalls = jest.fn().mockReturnValue({
// 			// check if user already exists first
// 			select: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [], error: null }),
// 			}),

// 			insert: jest.fn().mockReturnValue({
// 				select: jest.fn().mockReturnValue({ data: [mockNewUser], error: null }),
// 			}),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

// 		const request = {
// 			url: "http://localhost:3000/api/user",
// 			json: jest.fn().mockResolvedValue(mockNewUser),
// 		};
// 		const response = await POST({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {
// 				isDarkMode: true,
// 				email: "bob.smithjones@gmail.com",
// 			},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual([mockNewUser]);
// 		expect(mockDBCalls).toHaveBeenCalledWith("users");
// 	});

// 	it("Should create a user if isDarkMode is not provided", async () => {
// 		const mockNewUser = {
// 			email: "bob.smithjones@gmail.com",
// 		};

// 		const mockDBCalls = jest.fn().mockReturnValue({
// 			// check if user already exists first
// 			select: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [], error: null }),
// 			}),

// 			insert: jest.fn().mockReturnValue({
// 				select: jest.fn().mockReturnValue({ data: [mockNewUser], error: null }),
// 			}),
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

// 		const request = {
// 			url: "http://localhost:3000/api/user",
// 			json: jest.fn().mockResolvedValue(mockNewUser),
// 		};
// 		const response = await POST({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {
// 				email: "bob.smithjones@gmail.com",
// 			},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual([mockNewUser]);
// 		expect(mockDBCalls).toHaveBeenCalledWith("users");
// 	});

// 	it("should return an error if the email already exists in the database", async () => {
// 		const mockNewUser = {
// 			email: "bob.smithjones@gmail.com",
// 			isDarkMode: true,
// 		};

// 		const mockDBCalls = jest.fn().mockReturnValue({
// 			// check if user already exists first
// 			select: jest.fn().mockReturnValue({
// 				eq: jest.fn().mockResolvedValue({ data: [mockNewUser], error: null }),
// 			}),
// 			// Don't need to mock insert because it shouldn't get that far, it'll find user is already in db first
// 		});

// 		(createClientSSROnly as jest.Mock).mockReturnValue({ from: mockDBCalls });

// 		const request = {
// 			url: "http://localhost:3000/api/user",
// 			json: jest.fn().mockResolvedValue(mockNewUser),
// 		};
// 		const response = await POST({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: mockNewUser,
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({ error: "User already in DB" });
// 		expect(mockDBCalls).toHaveBeenCalledWith("users");
// 	});

// 	it("should return an error if no email is provided", async () => {
// 		const request = {
// 			url: "http://localhost:3000/api/user",
// 			json: jest.fn().mockResolvedValue({}),
// 		};
// 		const response = await POST({
// 			...request,
// 			query: {},
// 			cookies: {},
// 			body: {},
// 			env: {},
// 		} as unknown as NextRequest);
// 		const responseData = await response.json();

// 		expect(responseData).toEqual({
// 			error: "Email required",
// 		});
// 	});
// });
