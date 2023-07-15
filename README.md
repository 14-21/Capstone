# Capstone

All GET functions:

Games:

    /games, getAllGames
    /games/:id, getGameById
    /games/studio/:studio, getGamesByStudio
    /games/ourscore/orderedrating, getGamesByOurscore ordered from 5 - 1
    /allgames/titles, getGamesByTitle alphabetically ordered
    /api/games/reviews, getAllReviews arbitrarily by reviewId
    /games/genre, getGamesByGenre

Users:

    /games/users, getAllUsers
    /games/usernames, getUsersByUsername
    /adminusers, getAdminUsers
    /games/get/user/:id, getUsersById

    Comments:
    /games/users/comments/:origReviewId, fetchAllCommentsByReviewId
    /api/user/review/comments, fetchAllCommentsByUserId

    /api/games/all/comments, getAllComments-(requiresAdmin)

All POST functions:

    post request /games/create/game, postNewGame
    post request /games/users/register, registerNewUser
    post request /games/users/login, loginUser
    post request /games/post/review, postNewReview
    post request /api/games/reviews/update/comments/:commentId, editComment

All UPDATE functions:

/games/user/review/update, updateReview

All DELETE functions:

<<<<<<< Updated upstream
/api/games/comments/delete/:commentId, deleteCommentByCommentId
/api/games/delete/:gameId", deleteGameByGameId
/api/games/user/review/delete/:id, deleteReviewsByUser
=======
/api/games/user/review/delete/:id, deleteReviewsByUser
>>>>>>> Stashed changes
