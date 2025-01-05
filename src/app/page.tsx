"use client";

import { User } from "@/zod/schemas/UserSchema";
import { useEffect, useState } from "react";
// README:
// This is a dummy HTML setup written by Copilot to give me something to bounce off of early in dev, will be replaced with my own design later.

// TODO: Add this to app
//supabase.com/dashboard/project/kqnhzwgaypywymhqfbgd/settings/api?showConnect=true

export default function Page() {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch("/api/user");
				const data = await res.json();
				const fetchedUsers: User[] = data;
				setUsers(fetchedUsers);
			} catch (error) {
				console.error("Error fetching users in page.tsx:", error);
			}
		};

		// This is a dummy fxn for testing, for now
		const fetchUserByID = async (id: string) => {
			try {
				const res = await fetch(`api/user/${id}`);
				const data = await res.json();
				const fetchedUser: User = data;
				console.log("fetchedUser:", fetchedUser);
			} catch (error) {
				console.error("Error fetching single user in page.tsx:", error);
			}
		};

		fetchUserByID("1");

		fetchData();
	}, []);

	console.log("users:", users);

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center dark: bg-bl">
			<button
				onClick={async () => {
					// whatever the equivalent of fetch is with a delete operation, to api/user/1
					// can't call DELETE directly, gotta call to the endpoint
					const res = await fetch("/api/user/1", {
						method: "DELETE",
					});
					const data = await res.json();
					console.log("data from delete:", data);
				}}
			>
				Delete User
			</button>
			{/* button to update user with id 1 with random string as name and email */}
			{/* <button onClick={async () => {
				const res = await fetch("/api/user/1", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username: "random_username",
						email: "random_email",
					})
				});
				)};
			}}>Update User</button> */}

			{/* <button
				onClick={async () => {
					const res = await fetch("/api/user/1", {
						method: "PUT",
						// headers: {
						// 	"Content-Type": "application/json",
						// },
						body: JSON.stringify({
							username: "random_username" + Math.random(),
							email: "random_email@gmail.com",
						}),
					});
					console.log("res:", res);
				}}
			>
				Update User
			</button> */}

			<button
				onClick={() => {
					fetch("/api/user/1", {
						method: "PUT",
						body: JSON.stringify({
							username: "random_username" + Math.random(),
							email: "random_email@gmail.com",
						}),
					})
						.then((res) => {
							if (!res.ok) {
								throw new Error(`HTTP error! Status: ${res.status}`);
							}
							return res.json();
						})
						.then((data) => {
							console.log("Response data:", data);
						})
						.catch((error) => {
							console.error("Error during PUT request:", error);
						});
				}}
			>
				Update User
			</button>

			<header className="bg-blue-600 w-full py-4 text-white text-center">
				<h1 className="text-3xl font-bold">MileageBuddy</h1>
				<p className="text-lg">Calculate your car ownership costs easily</p>
			</header>
			<main className="flex flex-col items-center mt-8">
				<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
					<h2 className="text-2xl font-semibold mb-4">Car Cost Calculator</h2>
					<form className="space-y-4">
						<div>
							<label
								htmlFor="milesPerYear"
								className="block text-sm font-medium text-gray-700"
							>
								Miles per Year
							</label>
							<input
								type="number"
								id="milesPerYear"
								// value={milesPerYear}
								// onChange={(e) => setMilesPerYear(Number(e.target.value))}
								className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
							/>
						</div>
						<button
							type="button"
							// onClick={handleCalculate}
							className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
						>
							Calculate
						</button>
					</form>
					{/* {costPerMile > 0 && (
            <div className="mt-4">
              <p className="text-lg">
                Estimated Cost per Mile:{" "}
                <span className="font-bold">${costPerMile.toFixed(2)}</span>
              </p>
            </div>
          )} */}
				</div>
			</main>

			<section className="mt-8 w-full max-w-md">
				<h2 className="text-xl font-semibold">Fetched User Data</h2>
				<pre>{JSON.stringify(users, null, 2)}</pre>
			</section>
		</div>
	);
}

// export default Page;
