Thanks to this Tailwind cheatsheet:
https://nerdcave.com/tailwind-cheat-sheet
https://www.youtube.com/watch?v=DenUCuq4G04&t=46s

TO START PROJECT LOCALLY:
-I've put together a little script in package.json that sets up both your local frontend and backend DB
-All you need to do is download Docker Desktop and have it running (the local db runs out of there), and install the Supabase CLI
-CD in to the project. If this is your first time using this project on this device, run `npx supabase link` and follow the instructions to link this to the Supabase db
-Note that you'll need to be authorized on my Supabase project to develop on my DB. This is free and open-source though, so you're welcome to start your own Supabase project for it and credit me.
-Then, run `npm run dev: setup` to spin up both the local frontend and backend. This should be the only thing you have to do to start the frontend AND backend locally. If that doesn't work, see BACKEND LOCAL DEV DEBUGGING section.

ENVIRONMENT VARIABLES:
-Put the following local DB variables in env.local at root of project:
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY (get this from the command line, it's printed after you run npm run dev:setup OR npx supabase start AFTER you've ran npx supabase link)
NEXT_JWT_SECRET (get this from the command line, it's printed after you run npm run dev:setupOR npx supabase start AFTER you've ran npx supabase link)

PLANNING: To be updated as project goes on.

STYLING:
-Tailwind CSS
-Edit strings for dynamic styling

FRONTEND:
-Next 15
-React (obviously)
-TypeScript (of course)
-Zod

STYLING:
-Tailwind CSS
-Using dynamic string literals for any styling logic
-Custom components, color gradients, and other styling sources of truth are found in globals.css
-This is sent to the javascript through tailwind.config.ts
-I also made tailWindClassNames.mileageCalcForm.ts as a single source-of-truth for the custom component class names. That way I only have to change them in one place if any updates are needed.

STATE MANAGEMENT
-Redux for global state management
-Four reducers: userReducer, tripReducer, vehicleReducer, darkModeReducer
-Logging in will populate user's info to these three states

FRONTEND FEATURES PLANNED:

+Dark mode (obviously)
-Was tricky to implement dark mode toggle with server side rendering
-Ended up using ThemeWrapper in providers.tsx
-Relevant files: providers.tsx, ThemeSwitch.tsx
-Thanks to Dave's video for help with this: https://www.youtube.com/watch?v=7zqI4qMDdg8&t=223s

+Users without accounts can use Calculator
-Need to make account to save it

+SAVED:
-User saves trips, vehicles

+Calculator:
-Miles per year
-Cost of gas, maintenance, insurance, depreciation
-New tires or any miscellanea
-Do the math, give cost per Mile
-Then, cost per additional mile feature

+COMPARISON:
-Compare to biking, flying, walking, transit
-Have checkboxes for all the things if you may need if you don't drive, and let user fill in costs of those (biking, flying etc)

PAGES:
<Dashboard/>
-User is directed here on login, or on page load if they're already logged in
-Will list all a user's Vehicles
-Has functionality to do CRUD operations on vehicles
-Protected route, only accessible if logged in

<Login/>
-For logging in (obviously)
-User directed here if they load the page without being logged in

FRONTEND STRETCH:
+Car cost estimator - if considering buying a car, what will it ACTUALLY cost you?

<!-- Wrote this with nice formatting 2.1.25. Need to reformat the rest of this file too. -->

# Car Cost Calculation Utility Overview

This utility is designed to provide a comprehensive estimate of the true cost per mile of driving a vehicle. It combines multiple cost categories (both fixed and variable) to give users a ballpark figure that reflects the real-world expenses of car ownership.

- **Purpose & Intention:**

  - Calculate the actual cost per mile driven, factoring in both predictable (fixed) and changing (variable) expenditures.
  - Offer an estimate for the cost of extra miles driven beyond the normal usage.
  - Help users understand the underlying expense components when planning for vehicle ownership.

- **Key Aspects:**

  - **Depreciation:**
    Essentially, this function subtracts the purchase price from the (estimated) eventual sales price to calculate the depreciation per mile.
  - **Fuel Cost:**  
    The utility calculates the average fuel (or electricity for electric vehicles) cost per mile based on driving habits and vehicle data using [`calcAvgFuelCostPerMileDollars`](src/app/utils/CarCostAlgorithm/calcAvgFuelCostPerMileDollars.ts).
  - **Fixed Costs:**  
    It aggregates costs that remain constant over time (e.g., insurance, registration, taxes, and loan payments) via [`calculateFixedCostPerYear`](src/app/utils/CarCostAlgorithm/calculateFixedCostPerYear.ts).
  - **Variable Costs & Maintenance:**  
    The costs that change or accumulate over time (like tolls, parking, and maintenance) are computed using helper functions in [`smallerCostUtils.ts`](src/app/utils/CarCostAlgorithm/smallerCostUtils.ts).

- **Overall Calculation:**

  - The main function, [`calculateCarCostMain`](src/app/utils/CarCostAlgorithm/calculateCarCostMain.ts), ties everything together:
    - It determines the yearly mileage based on user input.
    - It factors in depreciation (difference between purchase price and anticipated resale).
    - It calculates both the total cost per mile and the cost for any extra miles driven.
  - The final product includes the cost per average mile of daily use (costPerMile), as well as a costPerAddtlMile that estimates the cost of any miles driven beyond the user's typical use.
    -CostPerAddtlMile only takes in to account maintenance cost, depreciation and fuel. It assumes that fixed costs such as insurance and variable costs such as tolls, parking etc aren't affected.

- **Intended Use & User Benefit:**
  - **Planning & Comparison:**  
    Users can compare the cost-effectiveness of driving versus other modes of transportation.
  - **Data-Driven Insights:**  
    By dissecting vehicle expenses into clearly defined categories, users gain insights into where most of their money is going.
  - **Long-Term Estimation:**  
    The tool estimates cost over the lifespan of a vehicle, considering both habitual and additional driving needs.

BACKEND:
+DB: Supabase
https://supabase.com/dashboard/project/kqnhzwgaypywymhqfbgd/settings/api
+Backend Host: Vercel
+Backend framework: Next's API endpoint functionality
-Figure out hosting
-Lives in same repo. In backend folder?
-Node
-Docker
-Run locally and online, node server and db
-Seeding and migrations
-Postgres
-TS
-Knex
-Docker container
-Zod talking to FE and BE
-NGINX

BACKEND ENDPOINTS:
-Using nextJS's api/route/route.js structure
-Will have endpoints for user, vehicle, probably trip

AUTH:
-This app uses Supabase Auth https://supabase.com/docs/guides/auth/server-side/nextjs
-Also using Google signin functionality.
-Google auth is the single source of truth, there is no other login or password option.
-Supabase auth links with the private.auth table in the db, this is automatically configured by supabase
-As of 2.9.25, I plan to store basic user info on that auth table, such as darkmode preference. Will also adjust vehicle foreign keys to match this table instead of the original users table which I had created
-The <AuthWatcher/> component is not a UI component, it watched for supabase auth updates (login, logout etc) and makes appropriate updates to redux state
AUTH UI FLOW SCENARIOS:
-User loads page, has no persisted session: Directed to /login
-User loads page, has previous session: Directed to /dashboard
-User can use the calculator without being logged in, will save one (three? Not sure) vehicle(s) to localstorage

DB:
-hosting DB on Supabase

Tables:
+auth.users (obviously)
-auth.users is Generated by supabase auth schema
-Email, id, darkmode. Very simple table
-Backed up by Supabase auth which stores auth tstuff
+trip -- stretch goal, don't worry about this right now
-Distance, flight cost, rental cost, gas cost
+vehicle
-The vehicle table is the meat and potatoes of this project.
-See VehicleSchema.ts for more info
-Each User has multiple Vehicles
-User will input data about their vehicle (gas cost, purchase price, depreciation and so on) which will be used to calculate the true cost of owning and operating that vehicle
VEHICLES TABLES:
-Vehicles are complicated objects in this project, they're the meat and potatoes of the whole site
-So, since they have so many fields, I've separated them in to eight different tables.

API ENDPOINTS:
api/user(finished)
-PUT, POST, DELETE and GET live in src/app/api/user/route.ts
-These are (obviously) used to perform CRUD operations on a single user
-They're called with a URL like so: api/user?id=1
api/vehicles
-This assembles/reads/writes etc vehicle data from eight different tables
-Vehicles are complicated objects in this project so they are separated in to these eight tables
-I wrote backend functions insert_vehicle_function.sql to help with POST, and update_vehicle.sql to help with PUT
-These deal with objects of the Vehicle type from getVehicleTypes.ts
GET api/vehicles:
-Gets one vehicle by vehicleID, or multiple vehicles by userID
-Assembles a vehicle's data from the eight different tables (see create_vehicles_table.sql) and returns it as a Vehicles[] or array with a single Vehicle
POST api/vehicles
-Takes in a single Vehicle object (see getVehicleTypes.ts)
-Calls insert_vehicle_function.sql to send the new Vehicle's data to the eight relevant vehicle tables
-The function only succeeds if the data is successfully written to all tables, otherwise it rolls back the operation
PATCH api/vehicles
-Takes in a Partial<Vehicle> object
-Each sub-object in Vehicle type represents a table. For instance gasVehicleData, fixedCosts etc
-All of these objects are non-mandatory in the object passed to PATCH.
-So, only tables included in the Partial<Vehicle> will be updated
-Note that update_vehicle.sql doesn't return anything (unless there's an error), it returns a blank array. This is because if it returned something it would just be the Partial vehicle data.
-So, PATCH makes a GET call to get the full updated vehicle data, and returns that.
DELETE api/vehicles
-Takes in a vehicle id and deletes that vehicle
-Returns the deleted Vehicle object

MIGRATIONS:
-To run migrations, cd in to root of project
To create new migration:
In cli run: supabase migration new create_employees_table
-Or whatever migration name
-Then, add new SQL to the newly created file
To run ONLY a migration (aka no seeds) in remote:
For local:
supabase migration up
To push migration to remote (CAREFUL NOT TO OVERRIDE PROD)
npx supabase db push
To push migration AND SEEDS to remote: (BE VERY CAREFUL, THIS MIGHT OVERRIDE PROD DATA):
npx supabase db reset --linked

SEEDS:
-Created a seed script in supabase/seed.sql

RESET DB:
-to reapply migrations and popualte with seed data
supabase db reset

TESTING:
FRONTEND TESTING:
-So far (01/04/2025) I have some very basic frontend tests setup, that just ensure my components render without errors.
-The UI is just a skeleton right now, will flesh out the tests as I flesh out the UI.

BACKEND TESTING:
-Right now, backend tests are UNIT tests that live in my server unit testing folder. They ensure that the API endpoint logic performs CRUD operations correctly on data passed in to them.
-These tests don't actually interact with a real or testing DB.
-If I write integration tests (aka tests that interact with a real db), they will live in my server integration testing folder.
-Right now (1.15.2025) I have unit tests written for api/vehicles and api/users.

HOSTING:
-Vercel for frontend, and backend API endpoints
-Supabase for DB

BACKEND LOCAL DEV DEBUGGING:
-These longer steps shouldn't be necessary unless you're running in to some kind of errors. See `START PROJECT LOCALLY` above first, and only come here if you're having problems.
-Download docker desktop (need this to run local Supabase)
-CD in to project, run npm i
-May need to install supabase CLI
-Note that you need Docker Desktop open, and it needs to have specific settings. See here in the `Running Supabase Locally` section: https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=npx&queryGroups=access-method&access-method=postgres
IMPORTANT: All of the below stuff about local backend is taken care of by my `npm run dev: setup` script in package.json. This just lays out the steps that script takes.
-SO, you ONLY need to run `npm run dev: setup` to set up BOTH the local frontend AND backend. Unless you get some kind of error, then see the below for detailed steps.
-Run `npx supabase link` and link project to Supabase
-It'll ask for the project ref. I got that from here: -https://supabase.com/dashboard/project/kqnhzwgaypywymhqfbgd
-Note that it's just the letters of the project, not the whole url. For example if the project is https://supabase.co/82394fajsafas, run `npx supabase link --project-ref 82394fajsafas`. That's just a placeholder project id, you need to get it from supabase.
-Run `npx supabase db pull`
-Run `npx supabase start`
-Run `npx supabase migration up`
-Will need to populate NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local. Also need GOOGLE_OAUTH_SECRET; this is my Client Secret from the GCP platform for MileageBuddy. Google Auth Platform > Clients > Client: [id]. It's used in config.toml
-Again, `npm run dev:setup` takes care of everything for you after `npx supabase link`. These items are just in case you need debugging help.
