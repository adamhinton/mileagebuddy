-- Create the extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Enable the pgcrypto extension within the extensions schema
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Set the search_path for the entire database.
-- This ensures that all future connections, including the one running the seed script,
-- will look for functions in the 'extensions' schema.
ALTER DATABASE postgres SET search_path = "$user", public, extensions;