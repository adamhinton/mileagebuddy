-- -- NOTE. IMPORTANT: Some table names and column names are wrapped in double quotes. This is to make them case sensitive, otherwise all keys returned from the backend would be lowercase which would be extremely annoying when trying to convert them to camel case for frontend use.

-- CREATE TABLE users (
--   id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--   email text UNIQUE NOT NULL,
--   "isDarkMode" boolean DEFAULT true
-- )
