-- ___________________________________________________________
-- This is for the Trips feature
-- Each Trip can have multiple TripOptions
-- A one-to-many relationship

DROP TABLE IF EXISTS trip_options;

CREATE TABLE trip_options(
    id SERIAL PRIMARY KEY,
    "tripID" INTEGER NOT NULL,
    CONSTRAINT fk_trip FOREIGN KEY ("tripID") REFERENCES trips(id) ON DELETE CASCADE,
    
    -- Optional because only TripOptions of transportMode OWN_VEHICLE will need a vehicleID
    "vehicleID" INTEGER,
    CONSTRAINT fk_vehicles FOREIGN KEY ("vehicleID") REFERENCES vehicles(id) ON DELETE CASCADE,
    CHECK(
        "transportMode" = 'OWN_VEHICLE' AND "vehicleID" IS NOT NULL
        OR "transportMode" = 'OTHER' AND "vehicleID" IS NULL
    ),

    name VARCHAR(100) NOT NULL,
    notes VARCHAR(500),

    "transportMode" VARCHAR(20) NOT NULL CHECK("transportMode" IN ('OWN_VEHICLE', 'OTHER')),

    "parkingCosts" DECIMAL(4, 1) DEFAULT 0 CHECK("parkingCosts" >= 0),
    "tollCosts" DECIMAL(4, 1) DEFAULT 0 CHECK("tollCosts" >= 0),
    "additionalCosts" DECIMAL(7, 1) DEFAULT 0 CHECK("additionalCosts" >= 0),

    -- These are unique to transportMode 'OTHER'
    "transportationType" VARCHAR(30),
    CHECK(
        "transportMode" = 'OTHER' AND "transportationType" IN ('Flight', 'Train', 'Bus', 'Rental Car', 'Other')
        OR "transportMode" = 'OWN_VEHICLE' AND "transportationType" IS NULL
    ),

    "transportationCostToDestination" DECIMAL(8, 2),
    CHECK(
        "transportMode" = 'OTHER' AND "transportationCostToDestination" IS NOT NULL
        OR "transportMode" = 'OWN_VEHICLE' AND "transportationCostToDestination" IS NULL
    ),

    "transportationCostAtDestination" DECIMAL(8, 2),
    CHECK(
        "transportMode" = 'OTHER' AND "transportationCostAtDestination" IS NOT NULL
        OR "transportMode" = 'OWN_VEHICLE' AND "transportationCostAtDestination" IS NULL
    )
);