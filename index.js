//Express server code goes here, routes, and middleware etc.
const express = require("express");
const app = express();
const PORT = 8080;

const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
app.use(cors());

app.use(express.json());

const client = require("./db/index");
const {
  fetchAllGames,
  fetchGameById,
  fetchGameByStudio,
} = require("./db/seedData");
client.connect();

async function getAllGames(req, res, next) {
  try {
    const allGamesData = await fetchAllGames();
    if (allGamesData && allGamesData.length) {
      res.send(allGamesData);
    } else {
      res.send("No Game Available...");
    }
  } catch (error) {
    console.log(error);
  }
}
app.get("/games", getAllGames);

async function getGameById(req, res, next) {
  try {
    console.log("Testing getGameById");
    console.log(req.params.id);

    const mySpecificGame = await fetchGameById(Number(req.params.id));

    res.send(mySpecificGame);
  } catch (error) {
    console.log(error);
  }
}

app.get("/games/:id", getGameById);

async function getGamesByStudio(req, res, next) {
  try {
    console.log(req.params.studio);

    const myStudioGame = await fetchGameByStudio(req.params.studio);
    console.log("Finished Fetching my Studio Game");

    res.send(myStudioGame);
  } catch (error) {
    console.log(error);
  }
}

app.get("/games/studio/:studio", getGamesByStudio);

// async function getGamesByGenre(req, res, next) {
//   try {
//     console.log(req.params.genre);

//     const myGenreGame = await fetchGameByGenre(req.params.genre);

//     res.send(myGenreGame);
//   } catch (error) {
//     console.log(error);
//   }
// }

// app.get("/games/genre", getGamesByGenre);

app.listen(PORT, () => {
  console.log(`The server is up and running on port: ${PORT}`);
});
