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

All POST functions:
    post request /games/create/game, postNewGame
    post request /games/users/register, registerNewUser
    post request /games/users/login, loginUser
    post request /games/post/review, postNewReview


All UPDATE functions:


All DELETE functions:
