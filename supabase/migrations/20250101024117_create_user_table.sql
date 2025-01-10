-- Note that in db calls isdarkmode has to be all lower case for postgres reasons

CREATE TABLE users (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email text UNIQUE NOT NULL,
  isdarkmode boolean DEFAULT true
)
