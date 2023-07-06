//Express server code goes here, routes, and middleware etc.
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 8080;
const path = require("path");
const jwt = require("jsonwebtoken");

const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
app.use(cors());

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

const client = require("./db/index");
client.connect();

const {
  fetchAllGames,
  fetchGameById,
  fetchGameByStudio,
  fetchAllUsers,
  createNewGame,
  fetchUsersByUsername,
  createUsers,
  createReviews,
  fetchAllReviews,
} = require("./db/seedData");

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

async function getAllUsers(req, res) {
  try {
    const allUsersData = await fetchAllUsers();
    if (allUsersData && allUsersData.length) {
      res.send(allGamesData);
    } else {
      res.send("No User Data Available...");
    }
  } catch (error) {
    console.log(error);
  }
}

app.get("games/users", getAllUsers);

async function getGameById(req, res, next) {
  try {
    // console.log("Testing getGameById");
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
    // console.log("Finished Fetching my Studio Game");

    res.send(myStudioGame);
  } catch (error) {
    console.log(error);
  }
}

app.get("/games/studio/:studio", getGamesByStudio);

async function registerNewUser(req, res) {
  try {
    const newUserData = req.body;
    const mySecret = process.env.JWT_SECRET;
    console.log(req.body);

    const newJWTToken = await jwt.sign(req.body, process.env.JWT_SECRET, {
      expiresIn: "1w",
    });

    if (newJWTToken) {
      const newUserForDb = await createUsers(req.body);

      if (newUserForDb) {
        res.send({ userData: newUserForDb, token: newJWTToken }).status(200);
      } else {
        res.send({ error: true, message: "Failed to create user" }).status(403);
      }
    } else {
      res
        .send({ error: true, message: "Failed to create valid auth token" })
        .status(403);
    }
  } catch (error) {
    console.log(error);
  }
}

app.post("/games/users/register", registerNewUser);

async function postNewGame(req, res) {
  try {
    const myAuthToken = req.headers.authorization.slice(7);
    console.log("My Actual Token", myAuthToken);
    console.log(process.env.JWT_SECRET, " !!!!!!!!!!!!!!!!!!!!!!!");

    const isThisAGoodToken = jwt.verify(myAuthToken, process.env.JWT_SECRET);
    console.log("This is my decrypted token:", isThisAGoodToken);

    if (isThisAGoodToken) {
      const userFromDb = await fetchUsersByUsername(isThisAGoodToken.username);
      console.log(req.body, " ?????????");
      if (userFromDb) {
        const newGamePost = await createNewGame(req.body);

        res.send(newGamePost);
      } else {
        res.send({
          error: true,
          message:
            "User does not exist in database. Please register for a new account and try again.",
        });
      }
    } else {
      res.send({ error: true, mesage: "Failed to decrypt token." });
    }
  } catch (error) {
    console.log(error);
  }
}

app.post("/games/create/game", postNewGame);

async function getAllReviews(req, res, next) {
  try {
    const allGamesData = await fetchAllReviews();
    if (allGamesData && allGamesData.length) {
      res.send(allGamesData);
    } else {
      res.send("No Reviews Available...");
    }
  } catch (error) {
    console.log(error);
  }
}
app.get("/reviews", getAllReviews);

// async function getAllComments(req,res,next){
//   try {
//     const allComments = await fetchAllComments():
//     if (allComments && allGamesData.length){
//       res.send(allComments);
//     }else{
//       res.send("No Comments Available...");
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

// app.get("/comments", getAllComments)

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
