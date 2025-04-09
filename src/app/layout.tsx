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

				<script src="https://accounts.google.com/gsi/client" async></script>
			</body>
		</html>
	);
}
