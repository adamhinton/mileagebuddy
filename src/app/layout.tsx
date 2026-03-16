// TODO Stretch: Ability to add pictures of vehicles; pic will show in dash
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxStoreProvider from "@/redux/StoreProvider";
import { ThemeWrapper } from "../../providers";
import { Header } from "@/components/Header/Header";
import AuthWatcher from "./components/AuthWatcher";
import Tabs from "@/components/Tabs";

// TODO stretch: Sidebar

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Calculate car costs per mile",
	description: "Car mileage cost calculator",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		// added suppressHydrationWarning because of darkmode stuff
		// The mismatch between the server and client side rendered content for dark mode is resolved by our ThemeWrapper, not to worry
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<div className="bg-background-base text-neutral-text h-full">
					{/* ThemeWrapper is the dark/light theme wrapper */}
					<ThemeWrapper>
						<ReduxStoreProvider>
							{/* AuthWatcher is a component that watches for auth events and updates the Redux store */}
							<AuthWatcher>
								<Header />
								{/* Internal navigation tabs. Dashboard login etc */}
								<Tabs />
								{children}
							</AuthWatcher>
						</ReduxStoreProvider>
					</ThemeWrapper>
				</div>
				{/* This displays the popup to sign in with google. */}
				{/* Right now, we jsut have the div in /login/page.tsx that displays a Google login banner. */}
				{/* I deleted this script because it was conflicting with the banner, something about two fedCMs something or another getting initialized. */}
				{/* TODO stretch work out why that happened and try to reinstate this script */}
				{/* <Script
					src="https://accounts.google.com/gsi/client"
					strategy="afterInteractive"
				/>{" "} */}
			</body>
		</html>
	);
}
