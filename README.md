# Capstone

GET functions:
Games:

    /games, getAllGames
    /games/:id, getGameById
    /games/studio/:studio, getGamesByStudio
    /games/ourscore/orderedrating, getGamesByOurscore ordered from 5 - 1
    /allgames/titles, getGamesByTitle alphabetically ordered
    /games/genre, getGamesByGenre

Users:

    /games/users, getAllUsers
    /games/usernames, getUsersByUsername
    /adminusers, getAdminUsers
    /games/get/user/, getUsersById

Reviews:

    /api/games/reviews, getAllReviews arbitrarily by reviewId
    /api/games/user/specific/reviews, getReviewsByUserId

Comments:

    /games/users/comments/:origReviewId, getAllCommentsById
    /api/user/review/comments, fetchAllCommentsByUserId
    /api/games/all/comments, getAllComments

POST functions:

Games:
    
    /games/create/game, postNewGame

User:

    /games/users/register, registerNewUser
    /games/users/login, loginUser

Reviews:

    /games/post/review, postNewReview

Comments:

    /api/games/reviews/update/comments/:commentId, editComment
    /api/review/post/comment, postNewComment

All UPDATE functions:

    /api/games/updategame/, updateGame
    /games/user/review/update, updateReview
    /api/comments/update/:commentId, updateComment

All DELETE functions:

    /api/games/delete/:gameId", deleteGameByGameId
    /api/users/delete/:userId, deleteUserById
    /api/games/user/review/delete/:id, deleteReviewsByUser
    /api/games/comments/delete/:commentId, deleteCommentByCommentId


Please go to the API Documentation for full explanation of routes and endpoints.
