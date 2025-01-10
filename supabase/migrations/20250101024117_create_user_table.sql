CREATE TABLE users (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email text UNIQUE NOT NULL,
  isDarkMode boolean DEFAULT true
)
