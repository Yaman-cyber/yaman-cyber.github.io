// Runs once, the first time the Mongo container starts: creates the user .env.development logs in with.
db.getSiblingDB("docbot").createUser({ user: "docbot", pwd: "pw", roles: [{ role: "readWrite", db: "docbot" }] });
