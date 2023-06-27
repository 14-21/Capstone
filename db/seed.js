// This file will run code to build db and all its content on an external hosting site.

// import client connection
const client = require("./index");

async function dropTables() {
  console.log("Dropping Tables");
  try {
    await client.query(`
    DROP TABLE IF EXISTS games;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS reviews;
    `);

    console.log("Finished dropping tables...");
  } catch (error) {
    throw error;
  }
}

//what do you look like, what data are you going to be filled with

async function createTables() {
  try {
    console.log("Starting to create tables");
    await client.query(`
            CREATE TABLE games(        
                "gameId" SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                platform VARCHAR(255) NOT NULL,
                genre VARCHAR(255) NOT NULL,
                msrp VARCHAR (255) NOT NULL,
                score VARCHAR (255) NOT NULL,
<<<<<<< HEAD
                review TEXT DEFAULT 'no reviews',
                author VARCHAR (255) NOT NULL,
                comments TEXT DEFAULT 'no comments',
                ourscore VARCHAR (255) NOT NULL,
                picture TEXT NOT NULL,
            )
        
        `);
  } catch (error) {
    console.log(error);
  }
}

async function destroyTables() {
  try {
    await client.query(`
            DROP TABLE IF EXISTS games;
        `);
  } catch (error) {
    console.log(error);
=======
                ourreview TEXT DEFAULT 'no reviews',
                studio VARCHAR (255) NOT NULL,
                ourscore VARCHAR (255) NOT NULL,
                picture TEXT NOT NULL
            );
        `);
    // await client.query(`
    //     CREATE TABLE users (
    //       "userId" SERIAL PRIMARY KEY,
    //       name VARCHAR(255) NOT NULL,
    //       password VARCHAR(255) NOT NULL,
    //       email VARCHAR(255) UNIQUE NOT NULL,
    //       is_admin BOOLEAN DEFAULT false
    //     );
    //     `);

    // await client.query(`
    //     CREATE TABLE reviews (
    //       "reviewId" SERIAL PRIMARY KEY,
    //       content VARCHAR(255) NOT NULL,
    //       score INTEGER NOT NULL,
    //       ourscore INTEGER NOT NULL,
    //       user_id INTEGER REFERENCES users(id),
    //       game_name INTEGER REFERENCES games(id)
    // );
    // `);

    console.log("Finished creating tables");
  } catch (error) {
    throw error;
>>>>>>> sarahsbranch
  }
}

async function createNewGame(newGameObj) {
  try {
<<<<<<< HEAD
    const { rows } = await client.query
    (`
        INSERT INTO games(title, platform, genre, msrp, score, review, author, comments, ourscore, picture)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
=======
    const { rows } = await client.query(
      `
        INSERT INTO games(title, platform, genre, msrp, score, ourreview, studio, ourscore, picture)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
>>>>>>> sarahsbranch
        RETURNING *;
        `,
      [
        newGameObj.title,
        newGameObj.platform,
        newGameObj.genre,
        newGameObj.msrp,
        newGameObj.score,
<<<<<<< HEAD
        newGameObj.review,
        newGameObj.author,
        newGameObj.comments,
=======
        newGameObj.ourreview,
        newGameObj.studio,
>>>>>>> sarahsbranch
        newGameObj.ourscore,
        newGameObj.picture,
      ]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllGames() {
<<<<<<< HEAD
    try {
        const { rows } = await client.query(`
        SELECT * FROM games;
        `);
        
        return rows;
    } catch (error) {
        console.log(error);
    }
=======
  try {
    const { rows } = await client.query(`
        SELECT * FROM games;
        `);

    return rows;
  } catch (error) {
    console.log(error);
  }
>>>>>>> sarahsbranch
}

async function fetchGameById(idValue) {
  try {
    const { rows } = await client.query(`
        SELECT * FROM games
        WHERE "gameId" = ${idValue};
<<<<<<< HEAD
        `)
=======
        `);
>>>>>>> sarahsbranch

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

<<<<<<< HEAD
=======
// async function fetchGameByTitle(titleValue) {

// }

// async function fetchGameByPlatform(platformValue) {

// ETC.....

// }
>>>>>>> sarahsbranch

async function buildDatabase() {
  try {
    client.connect();

<<<<<<< HEAD
    await destroyTables();
    await createTables();

    const firstGame = await createNewGame ({
=======
    await dropTables();
    await createTables();

    const gameDiablo4 = await createNewGame({
>>>>>>> sarahsbranch
      title: "Diablo 4",
      platform: "PC, XBox, PlayStation",
      genre: "Action RPG",
      msrp: "$69.99",
      score: "4",
<<<<<<< HEAD
      review:
        "Diablo 4 is a game available on Battle.net. It costs almost $70 and will run higher for the ultimate collector's edition.",
      author: "Blizzard",
      comments:
        "Diablo 4 is the 4th game released in the Diablo game franchise",
      ourscore: "3",
      picture: "url",
    });
    
    const allGames = await fetchAllGames();
    
    const findSpecificGame = await fetchGameById(1);
    // console.log(findSpecificGame);

    client.end();

=======
      ourreview:
        "Diablo 4 is a game available on Battle.net. It costs almost $70 and will run higher for the ultimate collector's edition.",
      studio: "Blizzard",
      ourscore: "3",
      picture: "url for Diablo 4 eventually",
    })

    const gameTheLastOfUs = await createNewGame({
      title: "The Last of Us",
      platform: "PC, PlayStation 5",
      genre: "Action RPG",
      msrp: "$19.99",
      score: "5",
      ourreview:
        "The Last of Us is awesome! Sorry about her dad.",
      studio: "Naughty Dog",
      ourscore: "5",
      picture: "url for last of us eventually",
    })
    
    const gameTheLastOfUs2 = await createNewGame({
      title: "The Last of Us 2",
      platform: "PC, PlayStation 5",
      genre: "Action RPG",
      msrp: "$59.99",
      score: "5",
      ourreview:
        "The Last of Us 2 is better than the first.",
      studio: "Naughty Dog",
      ourscore: "5",
      picture: "url for last of us 2 eventually",
    })
    
    const gameDyingLight = await createNewGame({
      title: "Dying Light",
      platform: "PlayStation 5",
      genre: "Survival",
      msrp: "$9.99",
      score: "5",
      ourreview:
        "The Last of Us is awesome! Sorry about her dad.",
      studio: "Techland",
      ourscore: "4",
      picture: "url for dying light eventually",
    })
    
    const gameDyingLight2 = await createNewGame({
      title: "Dying Light 2: Stay Human",
      platform: "PC, PlayStation 5",
      genre: "Survival",
      msrp: "$29.99",
      score: "4",
      ourreview:
        "The Last of Us is awesome! Sorry about her dad.",
      studio: "Techland",
      ourscore: "4",
      picture: "url for dying light 2 stay human eventually",
    }) 
    
    const gameHogwartsLegacy = await createNewGame({
      title: "Hogwarts Legacy",
      platform: "PC, PlayStation 5",
      genre: "Adventure RPG",
      msrp: "$59.99",
      score: "5",
      ourreview:
        "If you are a Harry Potter fan, you're literally going to spend so many hours of your life playing this! From flying around on a broom endlessly, to the House stories, to taming your own beasts. The room of requirement is SO amazing!",
      studio: "Avalance",
      ourscore: "5",
      picture: "url for Hogwarts Legacy eventually",
    })
    
    const gameDeadIsland2 = await createNewGame({
      title: "Dead Island 2",
      platform: "PC, PlayStation 5",
      genre: "Survival",
      msrp: "$29.99",
      score: "4",
      ourreview:
        "Sounds like the second in the line of zombie shooter survival games.",
      studio: "Deep Silver",
      ourscore: "3",
      picture: "url for dead island 2 eventually",
    })

    const gameUncharted4 = await createNewGame({
      title: "Uncharted 4: A Thief's End",
      platform: "PlayStation 4, Xbox One",
      genre: "Adventure RPG",
      msrp: "$24.99",
      score: "5",
      ourreview:
        "Uncharted 4, not Nathan Fillian.",
      studio: "Naughty Dog",
      ourscore: "5",
      picture: "url for uncharted 4 eventually",
    })

    const gameUnchartedTheLostLegacy = await createNewGame({
      title: "Uncharted: The Lost Legacy",
      platform: "PlayStation 5",
      genre: "Adventure RPG",
      msrp: "$39.99",
      score: "3",
      ourreview:
        "Was this the last of the uncharted series?.",
      studio: "Techland",
      ourscore: "4",
      picture: "url for Uncharted The Lost Legacy eventually",
    })

    const gameRiseofTheTombRaider = await createNewGame({
      title: "Rise of the Tomb Raider",
      platform: "PC, PlayStation 5",
      genre: "Adventure RPG",
      msrp: "$29.99",
      score: "4",
      ourreview:
        "Was this the last of the uncharted series?.",
      studio: "Techland",
      ourscore: "5",
      picture: "url for Rise of the Tomb Raider eventually", 
    })

    const gameDeadByDaylight = await createNewGame({
      title: "Dead by Daylight",
      platform: "PC, PlayStation 5",
      genre: "Adventure RPG, Horror",
      msrp: "$19.99",
      score: "4",
      ourreview:
        "This is one of the most fun to watch RP streams to.",
      studio: "Behaviour Interactive Inc",
      ourscore: "4",
      picture: "url for Dead by Daylight eventually", 
    })

    const gameCSGO = await createNewGame({
      title: "Counter-Strike: Global Offensive",
      platform: "PC, PlayStation 5",
      genre: "FPS",
      msrp: "$19.99",
      score: "4",
      ourreview:
        "Classic. Don't gamble lol.",
      studio: "Behaviour Interactive Inc",
      ourscore: "4",
      picture: "url for Counter-Strike: Global Offensive eventually", 
    })

    const gameStardewValley = await createNewGame({
      title: "Stardew Valley",
      platform: "PC, PlayStation 5",
      genre: "Simulation",
      msrp: "$14.99",
      score: "4",
      ourreview:
        "Basically a goat of sim games and farming sims.",
      studio: "Behaviour Interactive Inc",
      ourscore: "5",
      picture: "url for stardew valley eventually", 
    })    

    const gameCitiesSkylines = await createNewGame({
      title: "Cities: Skylines",
      platform: "PC, PlayStation 5",
      genre: "Simulation",
      msrp: "$14.99",
      score: "4",
      ourreview:
        "Over 500 hours of gameplay, and that's without the expansion packs! Base game has so much content and so much to offer.",
      studio: "Paradox Interaction",
      ourscore: "5",
      picture: "url for Cities Skylines eventually", 
    })    


    const gameGolfWithFriends = await createNewGame({
      title: "Golf with Friends",
      platform: "PC, PlayStation 5",
      genre: "Sports",
      msrp: "$4.94",
      score: "3",
      ourreview:
        "So fun to play in an altered state with friends!",
      studio: "Paradox Interaction",
      ourscore: "3",
      picture: "url for golf with friends eventually", 
    })    


    ;

    const allGames = await fetchAllGames();
    const findSpecificGame = await fetchGameById(1);

    console.log(findSpecificGame);

    client.end();
>>>>>>> sarahsbranch
  } catch (error) {
    console.log(error);
  }
}

<<<<<<< HEAD
// buildDatabase();
=======
buildDatabase();
>>>>>>> sarahsbranch

module.exports = {
  fetchAllGames,
  fetchGameById,
  createNewGame,
<<<<<<< HEAD
};
=======
  buildDatabase,
};
>>>>>>> sarahsbranch
