NOTE:

This section is for UNIT tests of API endpoints, to ensure that the endpoints logic works as intended.

I will be passing in dummy/fake db data to the endpoints to ensure that CRUD operations are correctly performed on them. In other words, these tests do not interact with an actual DB.

If I want to write tests with an actual db, they will go in servertests/serverintegrationtests.

IMPORTANT: All of these tests use `node` as the test environment. This must be specified at the top of each backend test file, as so:
