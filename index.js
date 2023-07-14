const {
  fetchAllGames,
  fetchGameById,
  fetchGameByStudio,
  createNewGame,
  fetchGameByOurscore,
  fetchAllGamesByTitle,

  createUsers,
  fetchAllUsers,
  fetchUsersByUsername,
  fetchUsersById,
  fetchUsersByAdmin,

  createReviews,
  fetchAllReviews,
  editReview,
  fetchAllReviewsByUserId,
  deleteReview,

  // Database Comments Functions
  fetchAllComments,
  editComment,
  fetchAllCommentsByReviewId,
  fetchAllCommentsByUserId,
  deleteComment,
} = require("./db/seedData");

//Express server code goes here, routes, and middleware etc.
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 8080;
const path = require("path");
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils.js");
const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
app.use(cors());

app.use(express.json());

app.use("/", async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Our user Id:-----", id);
      if (id) {
        const foundUser = await fetchUsersById(id);
        if (foundUser) {
          req.user = foundUser;
        }
        next();
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

const client = require("./db/index");
const { requireAdmin } = require("./adminutils");
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

async function getAllUsers(req, res) {
  try {
    const allUsersData = await fetchAllUsers();
    if (allUsersData && allUsersData.length) {
      res.send(allUsersData);
    } else {
      res.send("No User Data Available...");
    }
  } catch (error) {
    console.log(error);
  }
}

app.get("/games/users", requireAdmin, getAllUsers);

//New routes for users filtered in db below
async function getUsersByUsername(req, res) {
  try {
    const allUsersByUsername = await fetchUsersByUsername();
    if (allUsersByUsername && allUsersByUsername.length) {
      res.send(allUsersByUsername);
    } else {
      res.send("No User Data Available...");
    }
  } catch (error) {
    next(error);
  }
}

app.get("/games/usernames", getUsersByUsername); //NOT A SECURE ROUTE RIGHT NOW

async function getAdminUsers(req, res) {
  try {
    const allAdminUsers = await fetchUsersByAdmin();
    if (allAdminUsers && allAdminUsers.length) {
      res.send(allAdminUsers);
    } else {
      res.send("No User Data Available...");
    }
  } catch (error) {
    console.log(error);
  }
}

app.get("/adminusers", getAdminUsers); //NOT A SECURE ROUTE RIGHT NOW

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

async function getUserById(req, res, next) {
  try {
    const specificUser = await fetchUsersById(Number(req.user.userId));

    if (specificUser) {
      res.send(specificUser);
    }
  } catch (error) {
    next(error);
  }
}

app.get("/games/get/user", requireUser, getUserById);

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

async function getGamesByOurscore(req, res, next) {
  try {
    console.log(req.params.ourscore);

    const ourscoreRating = await fetchGameByOurscore(
      Number(req.params.ourscore)
    );
    console.log("Finished Fetching my get games by ourscore");

    res.send(ourscoreRating);
  } catch (error) {
    console.log(error);
  }
}

app.get("/games/ourscore/orderedrating", getGamesByOurscore);

async function getGamesByTitle(req, res, next) {
  try {
    const allGamesTitles = await fetchAllGamesByTitle();
    if (allGamesTitles && allGamesTitles.length) {
      res.send(allGamesTitles);
    } else {
      res.send("No games to display");
    }
    console.log("Finished fetching get games by title");
  } catch (error) {
    console.log(error);
  }
}

app.get("/allgames/titles", getGamesByTitle);

async function registerNewUser(req, res, next) {
  try {
    const { fname, lname, username, password, email, is_admin } = req.body;
    console.log(req.body);
    if (
      !req.body.fname ||
      !req.body.lname ||
      !req.body.username ||
      !req.body.password ||
      !req.body.email
    ) {
      next({
        name: "Missing Required Field",
        message: "Please fill out all required fields listed.",
      });
    }

    const _user = await fetchUsersByUsername(username);

    if (_user) {
      next({
        name: "User Already Exists",
        message:
          "A user with that username already exists, please choose another.",
      });
    }

    const newUserInDb = await createUsers({
      fname,
      lname,
      username,
      password,
      email,
      is_admin,
    });

    const newJWTToken = jwt.sign(
      {
        id: newUserInDb.userId,
        username: newUserInDb.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      success: true,
      data: {
        message: "Thank you for registering!",
        newJWTToken,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

app.post("/games/users/register", registerNewUser);

async function loginUser(req, res, next) {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    if (!username || !password) {
      next({
        name: "Missing Login Information",
        message: "Please make sure you have filled out all required fields.",
      });
    }

    const user = await fetchUsersByUsername(username);

    if (!user) {
      next({
        name: "Bad Login",
        message: "Incorrect Username or Login.",
      });
    }
    console.log(user, "user code")
    if (password == user.password) {
      const token = jwt.sign(
        {
          id: user.userId,
          username: user.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({
        message: "You have successfully logged in.",
        token: token,
      });
    } else {
      next({
        name: "Incorrect Username or Password.",
        message: "Login information incorrect, please try again.",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

app.post("/games/users/login", loginUser);

async function postNewGame(req, res, next) {
  try {
    const myAuthToken = req.headers.authorization.slice(7);
    console.log("My Actual Token", myAuthToken);
    console.log(process.env.JWT_SECRET, " !!!!!!!!!!!!!!!!!!!!!!!");

    const isThisAGoodToken = jwt.verify(myAuthToken, process.env.JWT_SECRET);
    console.log("This is my decrypted token:", isThisAGoodToken);

    if (isThisAGoodToken) {
      const userFromDb = await fetchUsersByUsername(isThisAGoodToken.username);
      // console.log(req.body, " ?????????");
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
      res.send({ error: true, message: "Failed to decrypt token." });
    }
  } catch (error) {
    console.log(error);
  }
}

app.post("/games/create/game", requireAdmin, postNewGame); //NOT A SECURE ROUTE RIGHT NOW

// REVIEWS FUNCTIONS
async function getAllReviews(req, res, next) {
  console.log("before get all reviews");
  try {
    const allReviewsData = await fetchAllReviews();
    console.log("all reviews fetched");
    if (allReviewsData && allReviewsData.length) {
      res.send(allReviewsData);
    } else {
      res.send("No Reviews Available...");
    }
  } catch (error) {
    console.log(error);
  }
}
app.get("/api/games/reviews", getAllReviews);

async function getReviewsByUsername(req, res, next) {
  try {
  } catch (error) {}
}

async function postReview(req, res, next) {
  try {
    console.log(req.user, "This is the result of req.user", req.body);
    const userReviews = await fetchAllReviewsByUserId(req.user.userId);
    console.log(userReviews)
    const currentGame = await fetchGameById(req.body.reviewGameId);

    const foundUserReviews = userReviews.find((e) => {
      if (e.reviewGameId === req.body.reviewGameId) {
        return true;
      }
    });

    if (!foundUserReviews) {
      req.body.reviewUserId = req.user.userId;
      const newGameReview = await createReviews(req.body);
      res.send(newGameReview);
    } else {
      res.send({
        error: true,
        message: `You cannot post a second review on the same game, ${currentGame.title}.`,
      });
    }
  } catch (error) {
    next(error);
  }
}
app.post("/games/post/review", requireUser, postReview);

async function updateReview(req, res, next) {
  try {
    const myAuthToken = req.headers.authorization.slice(7);
    console.log("My Actual Token", myAuthToken);
    console.log(process.env.JWT_SECRET, " !!!!!!!!!!!!!!!!!!!!!!!");

    const isThisAGoodToken = jwt.verify(myAuthToken, process.env.JWT_SECRET);
    console.log("This is my decrypted token:", isThisAGoodToken);

    if (isThisAGoodToken) {
      const correctUser = await fetchUsersByUsername(isThisAGoodToken.username);

      if (correctUser) {
        const newReview = await editReview(req.body);
      } else {
        res.send({
          error: true,
          message:
            "Unable to update the review, please make sure you are logged in and viewing the review you posted.",
        });
      }
    } else {
      res.send({
        error: true,
        message: "Unauthorized Token",
      });
    }
  } catch (error) {
    next(error);
  }
}

app.put("/games/user/review/update", requireUser, updateReview);

async function getReviewsByUserId(req, res, next) {
  try {
    const myAuthToken = req.headers.authorization.slice(7);
    console.log("My Actual Token", myAuthToken);
    console.log(process.env.JWT_SECRET, " !!!!!!!!!!!!!!!!!!!!!!!");

    const isThisAGoodToken = jwt.verify(myAuthToken, process.env.JWT_SECRET);
    console.log("This is my decrypted token:", isThisAGoodToken);

    if (isThisAGoodToken) {
      const reviewsByUser = await fetchAllReviewsByUserId(isThisAGoodToken.id);

      if (reviewsByUser.length) {
        res.send(reviewsByUser);
      } else {
        res.send({
          error: "No Reviews",
          message: "No reviews found.",
        });
      }
    }
  } catch (error) {
    next(error);
  }
}

app.get("/api/games/user/specific/reviews", requireUser, getReviewsByUserId);

async function deleteReviewsByUser(req, res, next) {
  try {
    const myAuthToken = req.headers.authorization.slice(7);
    console.log("My Actual Token", myAuthToken);
    console.log(process.env.JWT_SECRET, " !!!!!!!!!!!!!!!!!!!!!!!");

    const isThisAGoodToken = jwt.verify(myAuthToken, process.env.JWT_SECRET);
    console.log("This is my decrypted token:", isThisAGoodToken);

    if (isThisAGoodToken) {
      const reviewsByUser = await fetchAllReviewsByUserId(isThisAGoodToken.id);
      console.log(reviewsByUser, "!!!!!!!!!!!!!!!!!!!!!");
      const foundUserReviews = reviewsByUser.filter((e) => {
        if (e.reviewId === req.params.id) {
          console.log(reviewId, "reviewId");
          return true;
        }
      });
      console.log(foundUserReviews, " @@@@@@");
      if (foundUserReviews) {
        const deletedReview = await deleteReview(Number(req.params.id));
        console.log(deletedReview, "$$$$$$$$$$$$$");

        res.send(deletedReview);
      } else {
        res.send({
          error: "Delete Error",
          message: "You can only delete reviews that you have posted.",
        });
      }
    } else {
      res.send({
        error: "Token Error",
        message: "Must be logged in.",
      });
    }
  } catch (error) {
    next(error);
  }
}

app.delete(
  "/api/games/user/review/delete/:id",
  requireUser,
  deleteReviewsByUser
);

// COMMENTS FUNCTIONS
async function getAllCommentsById(req, res, next) {
  try {
    const allComments = await fetchAllCommentsByReviewId(
      req.params.origReviewId
    );
    console.log(req.params.origReviewId, "BODY OF REVIEWS");
    if (allComments && allComments.length) {
      res.send(allComments);
    } else {
      res.send("No Comments Available...");
    }
  } catch (error) {
    next(error);
  }
}

app.get("/games/users/comments/:origReviewId", getAllCommentsById);

async function getCommentsByUser() {}
async function getCommentsByReview() {}
async function postNewComment() {}

async function updateComment(req, res, next) {
  try {
    console.log(req.user, "Im the user!!!!!!!!!!!!!!!!!!!!!");
    const correctUser = await fetchUsersById(req.user.userId);
    const { commentId } = req.params;
    console.log(correctUser, "WHAT!!!!!!!");
    if (correctUser && !req.user.is_admin) {
      const newUpdatedComment = await editComment(req.body, commentId);
      console.log(newUpdatedComment, "COMMENT HERE");
      if (newUpdatedComment) {
        res.send(newUpdatedComment);
      } else {
        next({
          error: "Unable to Update",
          message:
            "Please verify that you are logged in, and trying to comment on your posts and try again.",
        });
      }
    } else {
      res.send({
        error: "Unauthorized",
        message: "You are only allowed to edit your comments.",
      });
    }
  } catch (error) {
    next(error);
  }
}

app.put(
  "/api/games/reviews/update/comments/:commentId",
  requireUser,
  updateComment
);

async function getGamesByGenre(req, res, next) {
  try {
    console.log(req.params.genre);

    const myGenreGame = await fetchGameByGenre(req.params.genre);

    res.send(myGenreGame);
  } catch (error) {
    console.log(error);
  }
}

app.get("/games/genre", getGamesByGenre);

app.get("*", (req, res) => {
  res.status(404).send({
    success: false,
    error: {
      name: "404 - Not Found",
      message: "No route found for the requested URL",
    },
    data: null,
  });
});

app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);
  res.send({
    error: { name: error.name, message: error.message },
  });
});

app.listen(PORT, () => {
  console.log(`The server is up and running on port: ${PORT}`);
});
