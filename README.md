Thanks to this Tailwind cheatsheet:
https://nerdcave.com/tailwind-cheat-sheet
https://www.youtube.com/watch?v=DenUCuq4G04&t=46s

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
Tables:
+User (obviously)
-Username, email, pass, darkmode,
+trip
-Distance, flight cost, rental cost, gas cost
+vehicle
-Type - gas or electric
-Insurance cost, gas cost, maintenance, initial miles, miles per year, depreciation, etc etc

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

TODO:
+Design API
+Feature planning
+Learn more about Tailwind
+Jira board?
+Get AWS hosting going

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
