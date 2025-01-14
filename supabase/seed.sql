SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "email", "isDarkMode") OVERRIDING SYSTEM VALUE VALUES
	(1, 'TESTDUMMYTEST.smith@example.com', true),
	(2, 'bob.jones@example.com', false),
	(3, 'charlie.brown@example.com', true),
	(4, 'david.wilson@example.com', false),
	(5, 'emma.davis@example.com', true);


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."vehicles" ("id", "userid", "type", "vehiclesOrder", "createdAt", "updatedAt", "deletedAt") VALUES
	(1, 1, 'gas', 1, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(2, 1, 'gas', 1, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(3, 1, 'gas', 1, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(4, 1, 'electric', 1, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(5, 1, 'electric', 1, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(6, 1, 'electric', 1, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL);


--
-- Data for Name: electricVehicleData; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."electricVehicleData" ("id", "vehicleID", "costPerCharge", "milesPerCharge", "electricRangeMiles", "createdAt", "updatedAt", "deletedAt") VALUES
	(1, 4, 15.25, 350.00, 350.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(2, 5, 8.50, 200.00, 215.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(3, 6, 12.00, 260.00, 259.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL);


--
-- Data for Name: fixedCosts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."fixedCosts" ("id", "vehicleID", "yearlyInsuranceCost", "yearlyRegistrationCost", "yearlyTaxes", "yearlyParkingCost", "monthlyLoanPayment", "monthlyWarrantyCost", "inspectionCost", "otherYearlyCosts", "createdAt", "updatedAt", "deletedAt") VALUES
	(1, 1, 1200.00, 150.00, 200, NULL, 350, 50, 100, 500, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(2, 2, 1400.00, 175.00, 250, NULL, 400, 60, 120, 600, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(3, 3, 1300.00, 180.00, 225, NULL, 375, 55, 110, 550, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(4, 4, 1600.00, 200.00, 300, NULL, 450, 70, 150, 700, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(5, 5, 1500.00, 190.00, 275, NULL, 425, 65, 140, 650, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(6, 6, 1550.00, 210.00, 320, NULL, 475, 80, 160, 750, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL);


--
-- Data for Name: gasVehicleData; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."gasVehicleData" ("id", "vehicleID", "gasCostPerGallon", "milesPerGallonHighway", "milesPerGallonCity", "createdAt", "updatedAt", "deletedAt") VALUES
	(1, 1, 3.49, 40.00, 30.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(2, 2, 3.39, 38.00, 28.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(3, 3, 3.59, 35.00, 25.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL);


--
-- Data for Name: purchaseAndSales; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."purchaseAndSales" ("id", "vehicleID", "yearPurchased", "purchasePrice", "downPaymentAmount", "willSellCarAfterYears", "milesBoughtAt", "willSellCarAtMiles", "willSellCarAtPrice", "createdAt", "updatedAt", "deletedAt") VALUES
	(1, 1, 2020, 22000.00, 2000.00, 5, 10000.00, 80000.00, 12000.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(2, 2, 2021, 25000.00, 2500.00, 4, 5000.00, 60000.00, 15000.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(3, 3, 2019, 27000.00, 3000.00, 6, 12000.00, 90000.00, 13000.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(4, 4, 2023, 39999.00, 5000.00, 4, 0.00, 60000.00, 35000.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(5, 5, 2021, 32000.00, 3000.00, 5, 0.00, 50000.00, 27000.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(6, 6, 2022, 35000.00, 4000.00, 6, 0.00, 70000.00, 33000.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL);


--
-- Data for Name: usage; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."usage" ("id", "vehicleID", "averageDailyMiles", "weeksPerYear", "percentHighway", "extraDistanceMiles", "extraDistancePercentHighway", "createdAt", "updatedAt", "deletedAt") VALUES
	(1, 1, 25.00, 52, 70.00, 100.00, 60.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(2, 2, 30.00, 50, 65.00, 200.00, 50.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(3, 3, 20.00, 52, 80.00, 150.00, 70.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(4, 4, 35.00, 52, 90.00, 0.00, 0.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(5, 5, 25.00, 50, 75.00, 100.00, 65.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(6, 6, 28.00, 52, 85.00, 50.00, 40.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL);


--
-- Data for Name: variableCosts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."variableCosts" ("id", "vehicleID", "monthlyParkingCosts", "monthlyTolls", "monthlyCarWashCost", "monthlyMiscellaneousCosts", "monthlyCostDeductions", "createdAt", "updatedAt", "deletedAt") VALUES
	(1, 1, 100.00, 50.00, 20.00, 50.00, 20.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(2, 2, 120.00, 60.00, 25.00, 60.00, 25.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(3, 3, 140.00, 70.00, 30.00, 70.00, 30.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(4, 4, 160.00, 80.00, 35.00, 80.00, 35.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(5, 5, 180.00, 90.00, 40.00, 90.00, 40.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(6, 6, 200.00, 100.00, 45.00, 100.00, 45.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL);


--
-- Data for Name: vehicleData; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."vehicleData" ("id", "vehicleID", "vehicleName", "year", "make", "model", "trim", "highwayMPG", "createdAt", "updatedAt", "deletedAt") VALUES
	(1, 1, 'Ford Focus', 2020, 'Ford', 'Focus', 'SE', 35.50, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(2, 2, 'Chevrolet Malibu', 2021, 'Chevrolet', 'Malibu', 'LT', 30.20, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(3, 3, 'Toyota Camry', 2019, 'Toyota', 'Camry', 'XLE', 28.40, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(4, 4, 'Tesla Model 3', 2023, 'Tesla', 'Model 3', 'Long Range', 0.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(5, 5, 'Nissan Leaf', 2021, 'Nissan', 'Leaf', 'S Plus', 0.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(6, 6, 'Chevrolet Bolt EV', 2022, 'Chevrolet', 'Bolt EV', 'LT', 0.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL);


--
-- Data for Name: yearlyMaintenanceCosts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."yearlyMaintenanceCosts" ("id", "vehicleID", "oilChanges", "tires", "batteries", "brakes", "other", "depreciation", "createdAt", "updatedAt", "deletedAt") VALUES
	(1, 1, 75.00, 250.00, 50.00, 150.00, 200.00, 2000.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(2, 2, 80.00, 280.00, 60.00, 180.00, 220.00, 2200.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(3, 3, 85.00, 300.00, 70.00, 200.00, 240.00, 2400.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(4, 4, 90.00, 320.00, 80.00, 220.00, 260.00, 2600.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(5, 5, 95.00, 340.00, 90.00, 240.00, 280.00, 2800.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL),
	(6, 6, 100.00, 360.00, 100.00, 260.00, 300.00, 3000.00, '2025-01-13 15:39:31.616612', '2025-01-13 15:39:31.616612', NULL);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: electricVehicleData_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."electricVehicleData_id_seq"', 3, true);


--
-- Name: fixedCosts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."fixedCosts_id_seq"', 6, true);


--
-- Name: gasVehicleData_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."gasVehicleData_id_seq"', 3, true);


--
-- Name: purchaseAndSales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."purchaseAndSales_id_seq"', 6, true);


--
-- Name: usage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."usage_id_seq"', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_id_seq"', 5, true);


--
-- Name: variableCosts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."variableCosts_id_seq"', 6, true);


--
-- Name: vehicleData_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."vehicleData_id_seq"', 10, true);


--
-- Name: vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."vehicles_id_seq"', 6, true);


--
-- Name: yearlyMaintenanceCosts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."yearlyMaintenanceCosts_id_seq"', 6, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
