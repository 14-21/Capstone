const {
  fetchAllGames,
  fetchGameById,
  fetchGameByStudio,
  createNewGame,
  fetchGameByOurscore,
  fetchAllGamesByTitle,
  deleteGame,
  editGame,

  createUsers,
  fetchAllUsers,
  fetchUsersByUsername,
  fetchUsersById,
  fetchUsersByAdmin,
  deleteUser,

  createReviews,
  fetchAllReviews,
  editReview,
  fetchAllReviewsByUserId,
  deleteReview,

  // Database Comments Functions
  createComments,
  fetchAllComments,
  fetchAllCommentsByUserId,
  fetchAllCommentsByReviewId,
  fetchCommentById,
  updateComment,
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
const { requireNotAdmin } = require("./notadminutils");
const { trace } = require("console");
client.connect();

// Games Routes
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

async function deleteGameByGameId(req, res, next) {
  try {
    const { gameId } = req.params;
    console.log(
      req.params,
      "This is the req.params console log in delete game function"
    );
    const gameToDelete = await deleteGame({ gameId });

    if (!gameToDelete) {
      next({
        name: "Game Not Found",
        message: "No game found to be deleted.",
      });
    } else {
      res.send({
        success: true,
        data: gameToDelete,
        error: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

app.delete("/api/games/delete/:gameId", requireAdmin, deleteGameByGameId);

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
    console.log("Finished Fetching my Studio Game");

    res.send(myStudioGame);
  } catch (error) {
    console.log(error);
  }
}

app.get("/games/studio/:studio", getGamesByStudio);

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

app.post("/games/create/game", requireAdmin, postNewGame);

async function updateGame(req, res, next) {
  try {
    console.log(req.user, "I am the user!!!!!!!!!!!!!!!!!!!!!");
    const adminUser = await fetchUsersByAdmin(req.user.id);
    const {
      title,
      platform,
      genre,
      msrp,
      score,
      ourreview,
      studio,
      ourscore,
      picturecard,
      pictureheader,
      picturebody,
      picturefooter,
      synopsis,
      about,
      forgamer,
      notfor,
    } = req.body;
    console.log(req.body, "req.body consolelog");

    if (adminUser) {
      const newUpdatedGame = await editGame({
        title,
        platform,
        genre,
        msrp,
        score,
        ourreview,
        studio,
        ourscore,
        picturecard,
        pictureheader,
        picturebody,
        picturefooter,
        synopsis,
        about,
        forgamer,
        notfor,
        gameId: req.body.gameId, // Assuming gameId is provided in req.body
      });

      console.log(newUpdatedGame, "new updated game console.log");
      if (newUpdatedGame) {
        res.send(newUpdatedGame);
      } else {
        next({
          error: "Unable to Update",
          message: "Admin user required.",
        });
      }
    } else {
      res.send({
        error: "Unauthorized",
        message: "You are not allowed to post the same game.",
      });
    }
  } catch (error) {
    next(error);
  }
}

app.put("/api/games/updategame/", requireAdmin, updateGame);

//USER ROUTES
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

app.get("/games/usernames", requireAdmin, getUsersByUsername);

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

app.get("/adminusers", requireAdmin, getAdminUsers);

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

async function editComment(req, res, next) {
  try {
    const { commentId } = req.params;
    console.log(req.params, "these are req.params");
    const loggedInUserId = req.user.userId;
    const comment = await fetchCommentById(commentId);

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
        message: "The comment you are trying to edit does not exist.",
      });
    }

    if (comment.origUserId !== loggedInUserId) {
      return res.status(403).json({
        error: "Unauthorized",
        message: "You are only allowed to edit your own comments.",
      });
    }

    const updatedComment = {
      commentbody: req.body.commentbody,
      origUserId: req.body.origUserId,
      origReviewId: req.body.origReviewId,
    };

    const newUpdatedComment = await updateComment(commentId, updatedComment);
    console.log(newUpdatedComment, "COMMENT HERE");

    res.send(newUpdatedComment);
  } catch (error) {
    next(error);
  }
}

app.put("/api/comments/update/:commentId", requireUser, editComment);

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
    console.log(user, "user code");
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

async function deleteUserById(req, res, next) {
  try {
    const { userId } = req.params;
    console.log(
      req.params,
      "This is the req.params console log in delete game function"
    );
    const userToDelete = await deleteUser({ userId });

    if (!userToDelete) {
      next({
        name: "User Not Found",
        message: "User does not exist.",
      });
    } else {
      res.send({
        success: true,
        data: userToDelete,
        error: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

app.delete("/api/users/delete/:userId", requireAdmin, deleteUserById);

// REVIEWS ROUTES
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

async function postReview(req, res, next) {
  try {
    const userReviews = await fetchAllReviewsByUserId(req.user.userId);
    console.log(userReviews);
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
    const { userscore, reviewbody, reviewId } = req.body;
    const reviewUserId = req.user.userId;

    const newReview = await editReview({
      userscore,
      reviewUserId,
      reviewbody,
      reviewId,
    });
    console.log(newReview, " NEW REVIEW!!!!!!!!!!!!!!!!");
    if (newReview) {
      res.send(newReview);
    } else {
      next({
        error: true,
        message:
          "Unable to update the review, please make sure you are logged in and viewing the review you posted.",
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

      const foundUserReviews = reviewsByUser.filter((e) => {
        if (e.reviewId === req.params.id) {
          console.log(req.params.id, "req.params.id");
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

// COMMENTS ROUTES
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

async function getCommentsByUser(req, res, next) {
  try {
    const currentUserComments = await fetchAllCommentsByUserId(req.user.userId);
    if (currentUserComments) {
      res.send(currentUserComments);
    } else {
      next({
        error: "No Comments Found",
        message: "No comments found for this user.",
      });
    }
  } catch (error) {
    next(error);
  }
}

app.get("/api/user/review/comments", requireUser, getCommentsByUser);

// admin function
async function getAllComments(req, res, next) {
  try {
    console.log(req.body);
    const allComments = fetchAllComments(req.body.commentBody);
    if (allComments.length) {
      res.send(allComments);
    } else {
      next({
        error: "No Comments",
        message: "No comments found.",
      });
    }
  } catch (error) {
    next(error);
  }
}
app.get("/api/games/all/comments", requireAdmin, getAllComments);

async function postNewComment(req, res, next) {
  try {
    const { origUserId, commentbody, origReviewId } = req.body;
    console.log(req.body, "!#####!");

    const getUserComments = await fetchAllComments(origUserId);
    console.log(getUserComments, "!!!!!!!!");

    const existingComment = getUserComments.find(
      (comment) =>
        comment.origReviewId === origReviewId &&
        comment.origUserId === req.user.userId
    );

    if (existingComment) {
      next({
        error: "Add Comment To Review Failure",
        message: "Only one comment per user on a review is allowed.",
      });
    } else {
      const userComment = await createComments({
        commentbody,
        origUserId,
        origReviewId,
      });

      res.send({
        success: true,
        data: userComment,
        error: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

app.post("/api/review/post/comment", requireUser, postNewComment);

async function updateGame(req, res, next) {
  try {
    console.log(req.user, "I am the user!!!!!!!!!!!!!!!!!!!!!");
    const isAdmin = req.body.is_admin;
    console.log(isAdmin, "This is whether the user is an admin");
    if (isAdmin === false) {
      next({
        error: "Unauthorized",
        message: "Only admin users are allowed to update games.",
      });
      return;
    }

    const {
      title,
      platform,
      genre,
      msrp,
      score,
      ourreview,
      studio,
      ourscore,
      picturecard,
      pictureheader,
      picturebody,
      picturefooter,
      synopsis,
      about,
      forgamer,
      notfor,
      gameId,
    } = req.body;

    console.log(req.body, "This is req.body console log");

    const allGames = await fetchAllGames(gameId);

    const foundGame = allGames.find((game) => game.gameId === gameId);
    
    if (!foundGame) {
      next({
        error: "Invalid Game ID",
        message: "The provided game ID does not exist.",
      });
      return;
    }

    const newUpdatedGame = await editGame(gameId, {
      title,
      platform,
      genre,
      msrp,
      score,
      ourreview,
      studio,
      ourscore,
      picturecard,
      pictureheader,
      picturebody,
      picturefooter,
      synopsis,
      about,
      forgamer,
      notfor,
    });

    console.log(newUpdatedGame, "New updated game console log");

    if (newUpdatedGame) {
      res.send(newUpdatedGame);
    } else {
      next({
        error: "Unable to Update",
        message: "Check headers or column information.",
      });
    }
  } catch (error) {
    next(error);
  }
}

app.put(
  "/api/games/updategame",
  requireAdmin,
  updateGame
);

async function deleteCommentByCommentId(req, res, next) {
  try {
    const { commentId } = req.params;
    console.log(req.params, "This is req.params check in delete comment");
    const commentToDelete = await deleteComment({ commentId });
    if (!commentToDelete) {
      next({
        name: "Comment not found",
        message: "No comment found to delete.",
      });
    } else {
      res.send({
        success: true,
        data: commentToDelete,
        error: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

app.delete(
  "/api/games/comments/delete/:commentId",
  requireUser,
  deleteCommentByCommentId
);

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