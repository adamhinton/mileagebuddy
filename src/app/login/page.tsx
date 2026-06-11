"use client";

// AUTH TODO:
// Work darkmode in to auth user data

import Script from "next/script";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { createClientCSROnly } from "../utils/server/supabase/client";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProjectLogo from "@/app/projectLogo.png";

declare global {
	interface Window {
		google?: {
			accounts?: {
				id?: {
					initialize: (options: {
						client_id: string;
						callback: (response: { credential: string }) => Promise<void>;
						ux_mode?: "popup" | "redirect";
					}) => void;
					renderButton: (
						parent: HTMLElement,
						options: Record<string, string | number>,
					) => void;
				};
			};
		};
	}
}

// This is allowed to be exposed to the public
const GOOGLE_CLIENT_ID =
	"220043080394-n7is08dpuk1iv2kbbif6isaq9l5d1lsn.apps.googleusercontent.com";

export default function LoginPage() {
	const loggedInUser = useAppSelector((state) => state.user.value);
	const isLoggedIn = !!loggedInUser?.id;
	const buttonContainerRef = useRef<HTMLDivElement>(null);
	const [gsiReady, setGsiReady] = useState(false);

	useEffect(() => {
		if (
			!gsiReady ||
			!buttonContainerRef.current ||
			!window.google?.accounts?.id
		) {
			return;
		}

		const handleCredentialResponse = async (response: {
			credential: string;
		}) => {
			const supabase = createClientCSROnly();

			const { error } = await supabase.auth.signInWithIdToken({
				provider: "google",
				token: response.credential,
			});

			if (error) {
				console.error("Error signing in with Google:", error.message);
				return;
			}

			console.log("Successfully signed in with Google");
		};

		buttonContainerRef.current.innerHTML = "";

		window.google.accounts.id.initialize({
			client_id: GOOGLE_CLIENT_ID,
			callback: handleCredentialResponse,
			ux_mode: "popup",
		});

		window.google.accounts.id.renderButton(buttonContainerRef.current, {
			type: "standard",
			shape: "rectangular",
			theme: "outline",
			text: "sign_in_with",
			size: "large",
			logo_alignment: "left",
			width: 320,
		});
	}, [gsiReady]);

	return (
		<main className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-start pt-12 pb-8 px-4">
			<Script
				src="https://accounts.google.com/gsi/client"
				strategy="afterInteractive"
				onLoad={() => setGsiReady(true)}
			/>

			{isLoggedIn ? (
				/* ── Logged-in state ─────────────────────────────────────────── */
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<div className="flex justify-center mb-2">
							<Image
								src={ProjectLogo}
								alt="MileageBuddy logo"
								width={48}
								height={48}
								className="rounded-lg"
							/>
						</div>
						<CardTitle className="text-xl">Welcome back!</CardTitle>
						<CardDescription>{loggedInUser?.email}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col items-center gap-4">
						<Button
							variant="destructive"
							size="lg"
							className="w-full"
							onClick={async () => {
								const supabase = createClientCSROnly();
								const { error } = await supabase.auth.signOut();
								if (error) {
									console.error("Error logging out:", error.message);
								}
							}}
							aria-label="Log out"
						>
							Log Out
						</Button>
					</CardContent>
				</Card>
			) : (
				/* ── Sign-in state ───────────────────────────────────────────── */
				<div className="flex flex-col items-center gap-6 w-full max-w-md">
					{/* Branding */}
					<div className="flex flex-col items-center gap-3">
						<Image
							src={ProjectLogo}
							alt="MileageBuddy logo"
							width={72}
							height={72}
							className="rounded-2xl shadow-md"
						/>
						<h1 className="text-4xl font-bold text-primary tracking-tight">
							MileageBuddy
						</h1>
						<p className="text-muted-foreground text-center text-base">
							Calculate the true cost of owning your vehicle.
						</p>
					</div>

					{/* Feature badges */}
					<div className="flex flex-wrap justify-center gap-2">
						<Badge variant="outline">💾 Save your vehicles</Badge>
						<Badge variant="outline">💰 True cost per mile</Badge>
						<Badge variant="outline">
							⛽ Fuel, maintenance &amp; depreciation
						</Badge>
					</div>

					{/* Sign-in card */}
					<Card className="w-full">
						<CardHeader>
							<CardTitle className="text-lg text-center">
								Sign in to get started
							</CardTitle>
						</CardHeader>
						<Separator />
						<CardContent
							className="flex justify-center pt-6"
							role="region"
							aria-label="Google sign in options"
						>
							<div ref={buttonContainerRef} />
						</CardContent>
						<CardFooter className="justify-center">
							<p className="text-xs text-muted-foreground">
								Completely free and open-source
							</p>
						</CardFooter>
					</Card>
				</div>
			)}
		</main>
	);
}
