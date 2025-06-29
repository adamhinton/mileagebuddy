-- ___________________________________________________________
-- This is for the Trips feature
-- It corresponds to TripSchema

-- NOTE. IMPORTANT: Some table names and column names are wrapped in double quotes. This is to make them case sensitive, otherwise all keys returned from the backend would be lowercase which would be extremely annoying when trying to convert them to camel case for frontend use.
-- ___________________________________________________________

DROP TABLE IF EXISTS trips cascade;

CREATE TABLE trips (
    -- Stuff not used in cost calculation
    id SERIAL PRIMARY KEY,
    "userID" uuid NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY ("userID") REFERENCES auth.users(id) ON DELETE CASCADE,
    "tripsOrder" INT NOT NULL,

    -- These help the user classify and understand
    name VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    origin VARCHAR(100),
    notes VARCHAR(500),
    "departureDate" DATE,
    "returnDate" DATE,
    

    -- Now trip cost calculation stuff
    -- These are part of LongDistanceTripSchema
    "tripType" VARCHAR(20) NOT NULL CHECK("tripType" IN ('SHORT_DISTANCE', 'LONG_DISTANCE')),
    "roundTripDrivingDistanceMiles" DECIMAL(7, 1),
    "localDrivingDistanceMiles" DECIMAL(7, 1),


    -- Can have multiple TripOptions - one to many relationship - that relationship is modeled in TripOption's foreign key

    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  
);