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
-Unit tests with Jest
-E2E with Playwright

BACKEND:
-GraphQL

HOSTING:
-Amplify
-Host backend on AWS as well
-Run on EC2 instance

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

TODO:

### Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Environment Variables](#environment-variables)
4. [Styling](#styling)
5. [Frontend](#frontend)
6. [Backend](#backend)
7. [Database](#database)
8. [Testing](#testing)
9. [Docker](#docker)
10. [TODO](#todo)
11. [Learn More](#learn-more)
12. [Deploy on Vercel](#deploy-on-vercel)

### Introduction

MileageBuddy is a project to help users calculate the costs of car ownership. With user input, it calculates the cost of their car per year, per mile, and for individual trips and extra miles. Future plans include user accounts and data storage for trips and vehicles, as well as a dark mode feature.

### Getting Started

To start the project:

1. Download Docker Desktop and have it running.
2. Install the Supabase CLI.
3. CD into the project directory.
4. Run `npx supabase link` and follow the instructions to link this to the Supabase DB.
5. Run `npm run dev:setup` to spin up both the local frontend and backend.

### Environment Variables

Add the following local DB variables in `.env.local` at the root of the project:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get this from the command line, it's printed after you run npm run dev:setup>
NEXT_JWT_SECRET=<get this from the command line, it's printed after you run npm run dev:setup>
NODE_ENV='development'
```

### Styling

- Tailwind CSS
- Using dynamic string literals for any styling logic

### Frontend

- Next.js 15
- React (functional components with hooks)
- TypeScript
- Zod for validation
- Redux for global state management with four reducers: `userReducer`, `tripReducer`, `vehicleReducer`, `darkModeReducer`
- Dark mode implementation using `ThemeWrapper` in `providers.tsx`

### Backend

- Supabase for DB
- Vercel for backend hosting
- Next.js API endpoint functionality
- Node.js, Docker, Postgres, TypeScript, Zod

### Database

- Tables: `User`, `Trip`, `Vehicle` (vehicle is a stretch goal)
- Migrations and seeds managed with Supabase CLI

### Testing

- Unit tests with Jest
- E2E tests with Playwright

### Docker

To run the backend locally:

1. Download Docker Desktop.
2. CD into the project directory.
3. Run `npm i`.
4. Run `npm run dev:setup` to set up both the local frontend and backend, or just `npx supabase start` to run just the backend.
5. Open your browser and navigate to `http://localhost:3000` to see the application running locally.

### App Router

The application uses Next.js's App Router for routing. You can define routes in the `app` directory.

### API Endpoints

Next.js API routes are used to create backend endpoints. These are defined in the `pages/api` directory. For example, creating a file named `pages/api/trips/route.tsx` will create an API endpoint at `/api/trips`. You can use these endpoints to handle requests and interact with the database.

### TODO

- Feature planning
- Learn more about Tailwind
- Jira board?

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
