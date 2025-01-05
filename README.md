Thanks to this Tailwind cheatsheet:
https://nerdcave.com/tailwind-cheat-sheet
https://www.youtube.com/watch?v=DenUCuq4G04&t=46s

TO START PROJECT:
-I've put together a little script in package.json that sets up both your local frontend and backend DB
-All you need to do is download Docker Desktop and have it running (the local db runs out of there), and install the Supabase CLI
-CD in to the project. If this is your first time using this project on this device, run `npx supabase link` and follow the instructions to link this to the Supabase db
-Then, run `npm run dev: setup` to spin up both the local frontend and backend

ENVIRONMENT VARIABLES:
-Put the following local DB variables in env.local at root of project:
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY (get this from the command line, it's printed after you run npm run dev:setup)
NEXT_JWT_SECRET (get this from the command line, it's printed after you run npm run dev:setup)
NODE_ENV='development' if you're in dev, don't need this for prod

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

FRONTEND STRETCH:
+Car cost estimator - if considering buying a car, what will it ACTUALLY cost you?

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
-Likely using Supabase's auth/signin/signup functionality

DB:
-Likely hosting DB on Supabase

Tables:
+User (obviously)
-Username, email, pass, darkmode,
+trip
-Distance, flight cost, rental cost, gas cost
+vehicle
-Type - gas or electric
-Insurance cost, gas cost, maintenance, initial miles, miles per year, depreciation, etc etc

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
-Create a seed script in supabase/seed.sql

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

HOSTING:
-Vercel for frontend, and backend API endpoints
-Supabase for DB

DOCKER:
-Put in docker container
docker compose up --build
-Done, works on frontend. yay!

HOW TO RUN BACKEND LOCALLY:
-Download docker desktop (need this to run local Supabase)
-CD in to project, run npm i
-May need to install supabase CLI
IMPORTANT: All of the below stuff about local backend is taken care of by my `npm run dev: setup` script in package.json. This just lays out the steps that script takes.
-SO, you ONLY need to run `npm run dev: setup` to set up BOTH the local frontend AND backend. Unless you get some kind of error, then see the below for detailed steps.
-Run `npx supabase link` and link project to Supabase
-It'll ask for the project ref. I got that from here: -https://supabase.com/dashboard/project/kqnhzwgaypywymhqfbgd
-Note that it's just the letters of the project, not the whole url. For example if the project is https://supabase.co/82394fajsafas, run `npx supabase link --project-ref 82394fajsafas`
-Run `npx supabase db pull`
-Run `npx supabase start`
-Run `npx supabase migration up`
-Will need to populate NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local. I got them from here:
