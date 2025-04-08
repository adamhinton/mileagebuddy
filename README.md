# Introduction

- MileageBuddy promotes financial literacy by calculating the true cost per mile of owning a car - including maintenance, depreciation, fuel, insurance, and much more.

- Users input information about vehicles they own, and MileageBuddy calculates the true cost per mile of operating that vehicle including maintenance, fuel, depreciation, insurance and more.

# Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
   - [To Start Project Locally](#to-start-project-locally)
   - [Environment Variables](#environment-variables)
3. [Frontend](#frontend)
   - [Styling](#styling)
   - [State Management](#state-management)
   - [Frontend Features Planned](#frontend-features-planned)
   - [Pages](#pages)
4. [Car Cost Calculation Utility Overview](#car-cost-calculation-utility-overview)
   - [Purpose & Intention](#purpose--intention)
   - [Key Aspects](#key-aspects)
   - [Overall Calculation](#overall-calculation)
   - [Intended Use & User Benefit](#intended-use--user-benefit)
5. [Backend](#backend)
   - [Database](#database)
   - [Backend Endpoints](#backend-endpoints)
   - [Authentication](#authentication)
6. [API Endpoints](#api-endpoints)
7. [Migrations and Seeds](#migrations-and-seeds)
   - [Migrations](#migrations)
   - [Seeds](#seeds)
   - [Reset Database](#reset-database)
8. [Testing](#testing)
   - [Frontend Testing](#frontend-testing)
   - [Backend Testing](#backend-testing)
9. [Hosting](#hosting)
10. [Backend Local Development Debugging](#backend-local-development-debugging)

---

# Getting Started

## To Start Project Locally

Follow these steps to set up the project for local development:

1. **Clone the Repository**  
   Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/mileagebuddy.git
   cd mileagebuddy
   ```

2. **Install Dependencies**  
   Run the following command to install all required dependencies:

   ```bash
   npm install
   ```

3. **Ensure Docker is Running**

   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) if you haven't already.
   - Make sure Docker is **running** (not just installed) before proceeding. The local database runs inside Docker.

4. **Set Up Supabase**

   - You need a Supabase project to host the database.
     - If you're a collaborator on this project, request authorization to access the existing Supabase project.
     - Otherwise, create your own Supabase project by following the [Supabase CLI setup guide](https://supabase.com/docs/guides/local-development/cli/getting-started).
   - Link the project to Supabase:
     ```bash
     npx supabase link
     ```
     - Follow the prompts.
   - Pull the database schema:
     ```bash
     npx supabase db pull
     ```

5. **Set Up Google Cloud Platform (GCP) OAuth**

   - Create a GCP project and configure OAuth credentials.
   - Add the URI of the environment where you're running this project (e.g., `localhost`) to the list of **Authorized Redirect URIs** in the GCP console.
   - Obtain the `GOOGLE_OAUTH_SECRET` and add it to your `.env.local` file.

6. **Environment Variables**  
   Create a `.env.local` file in the root of the project and populate it with the following variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   NEXT_JWT_SECRET=<your-jwt-secret>
   GOOGLE_OAUTH_SECRET=<your-google-oauth-secret>
   ```

7. **Run the Setup Script**  
   Use the custom setup script to initialize both the frontend and backend:

   ```bash
   npm run dev:setup
   ```

   - This script sets up the local database, and starts both the frontend and backend.

8. **Troubleshooting**
   - If you encounter issues, ensure Docker is running and the Supabase CLI is installed.
   - Refer to the "Backend Local Development Debugging" section for additional troubleshooting steps.

# Frontend

## Styling

- Tailwind CSS ; see globals.css, tailwindconfig.ts and tailWindClassNames.ts

## State Management

- Redux reducers for global state management. See /src/redux

## Validation

- Zod is the source of truth for both client and server validation. All requests to and from the client, server and database are validated with Zod.

## Frontend Features

- Car Cost Calculator - user inputs their vehicle details at /calculator

- Dashboard - user reviews their vehicles and the calculated costs per mile

- Dark mode

## Pages

- /dashboard - user can review their saved vehicles and the calculated costs per mile

- /login

- /calculator - Here the user inputs their vehicle details.

# Car Cost Calculation Utility Overview

- See /src/utils/CarCostAlgorithm

## Purpose & Intention

- To calculate a comprehensive breakdown of the cost per mile of driving a vehicle

## Key Aspects

- Depreciation, fuel cost, maintenance, fixed costs (monthly fees such as insurance and warranty) and variable costs (such as gas, tolls etc)

## Intended Use & User Benefit

- Financial literacy

-Understanding the true cost of owning a car

# Backend

## Database

- This project uses Supabase as the database provider

## Backend Endpoints

The backend uses Next.js API routes to handle CRUD operations for vehicles. Below is a quick overview:

- **GET /api/vehicles**  
  Fetches vehicle data.

  - Combines data from the eight relevant Vehicle tables (fixedCosts, vehicles, variableCosts etc)

- **POST /api/vehicles**  
  Adds a new vehicle to the database.

- **PATCH /api/vehicles**  
  Updates an existing vehicle.

  - Accepts a partial vehicle object and updates only the provided fields.
  - Calls the `update_vehicle` database function.

- **DELETE /api/vehicles**  
  Deletes a vehicle by its ID.

  - Returns the deleted vehicle object.

- **PATCH /api/vehicles/order**  
  Updates the display order of vehicles.

  - Used for drag-and-drop reordering in the dashboard.

- **Users**

  -There is no user endpoint. This project uses Supabase's auth.users built in functionality.

## Authentication

- Supabase Auth and Google Sign-In.

# Migrations and Seeds

## Migrations

Migrations are used to modify the database schema. Follow these steps to create and run migrations:

1. **Create a New Migration**  
   Run the following command to create a new migration file:

   ```bash
   npx supabase migration new <migration_name>
   ```

   Replace `<migration_name>` with a descriptive name for your migration.

2. **Run Migrations Locally**  
   Apply the migrations to your local database:

   ```bash
   npx supabase migration up
   ```

3. **Push Migrations to Remote**  
   Push the migrations to the remote database (be cautious to avoid overwriting production data):

   ```bash
   npx supabase db push
   ```

4. **Reset the Database**  
   To reapply all migrations and populate the database with seed data:
   ```bash
   npx supabase db reset
   ```

## Seeds

The seed script populates the database with initial data for testing or development purposes. The seed file is located at `supabase/seed.sql`.

1. **Run the Seed Script Locally**  
   Reset the database and run seed and migration files:

   ```bash
   npx supabase db reset
   ```

2. **Seed Data Structure**
   - The seed script creates a single user in the `auth.users` table.
   - It populates six vehicles (three gas and three electric) and their associated sub-tables (`vehicleData`, `gasVehicleData`, `electricVehicleData`, etc.).

## Reset Database

To completely reset the database, including reapplying migrations and running the seed script:

```bash
npx supabase db reset
```

**Note:** Ensure Docker Desktop is running before executing any Supabase commands locally. See the Backend Local Development Debugging section if you have issues.

# Testing

## Frontend Testing

- Lives in /**tests**/clientTests

- Comprehensive unit test suite for most frontend components

- Ensures confidence in UI stability

- Stretch goal: E2E tests

## Backend Testing

- Lives in /**tests**/servertests

- Unit testing for server endpoints

- Doesn't test API calls themselves; instead tests the logic of the endpoints while mocking server calls

# Hosting

- Frontend: Vercel

- Server: Also Vercel, through full stack Next.js App Router

- Database: Supabase

# Backend Local Development Debugging

If you encounter issues while developing the backend locally, follow these steps.

NOTE that Steps 2-4 are all covered by the single command: `npm run dev:setup`. This starts up both the client/server and the database. You only need these individual steps to help debug if something is going wrong.

1. **Ensure Docker Desktop is Running**

   - The local database runs inside Docker, so Docker Desktop must be installed and running.

2. **Install Supabase CLI**

   - If not already installed, follow the [Supabase CLI setup guide](https://supabase.com/docs/guides/local-development/cli/getting-started).

3. **Link the Project to Supabase**

   - Run the following command to link the project to your Supabase instance:
     ```bash
     npx supabase link
     ```
   - Provide the project reference ID when prompted (e.g., `kqnhzwgaypywymhqfbgd`).

4. **Start Supabase Locally**

   - Start the local Supabase instance:
     ```bash
     npx supabase start
     ```

5. **Run Migrations**

   - Apply migrations to the local database:
     ```bash
     npx supabase migration up
     ```

6. **Reset the Database**

   - To reapply migrations and populate the database with seed data:
     ```bash
     npx supabase db reset
     ```

7. **Environment Variables**

   - Ensure the following variables are correctly set in your `.env.local` file:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
     NEXT_JWT_SECRET=<your-jwt-secret>
     GOOGLE_OAUTH_SECRET=<your-google-oauth-secret>
     ```

8. **Run the Setup Script**

   - Use the custom setup script to initialize both the frontend and backend:
     ```bash
     npm run dev:setup
     ```

9. **Check Supabase Logs**

   - If issues persist, check the Supabase logs for errors:
     ```bash
     npx supabase logs
     ```

10. **Refer to Supabase Documentation**
    - For additional troubleshooting, refer to the [Supabase CLI documentation](https://supabase.com/docs/guides/local-development/cli/getting-started).

By following these steps, you should be able to debug and resolve most backend development issues.
