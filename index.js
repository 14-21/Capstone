//Express server code goes here, routes, and middleware etc.
const express = require("express");
const app = express();
const PORT = 8080;

const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
app.use(cors());

app.use(express.json());

const client = require("../db/client");
client.connect();

app.use("api", require("/api"));

app.listen(PORT, () => {
  console.log(`The server is up and running on port: ${PORT}`);
});
