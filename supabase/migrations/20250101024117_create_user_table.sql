-- Note that in db calls isdarkmode has to be all lower case for postgres reasons

-- TODO:
-- ADD TO TABLE:
-- createdAT
-- updatedAt
-- deletedAt
-- And update this in our CRUD endpoints

CREATE TABLE users (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email text UNIQUE NOT NULL,
  isdarkmode boolean DEFAULT true
)
