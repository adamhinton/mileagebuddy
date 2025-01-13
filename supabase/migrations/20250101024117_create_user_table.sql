-- NOTE: Some table names and column names are wrapped in double quotes because that makes them case sensitive. Otherwise they would be all lower case, whcih is annoying when converting them to camel case in frontend.

CREATE TABLE users (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email text UNIQUE NOT NULL,
  "isDarkMode" boolean DEFAULT true
)
