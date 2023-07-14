const client = require("./");
const { buildDatabase } = require("./seedData");


buildDatabase()
  .catch(console.error)
  .finally(() => client.end());
