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
                ourreview TEXT DEFAULT 'no reviews',
                studio VARCHAR (255) NOT NULL,
                ourscore VARCHAR (255) NOT NULL,
                picture TEXT NOT NULL
            );
        `);

    await client.query(`
        CREATE TABLE users (
          "userId" SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          fname VARCHAR(255) NOT NULL,
          lname VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          profilepic VARCHAR(255) UNIQUE NOT NULL,
          is_admin BOOLEAN DEFAULT false
        );
        `);

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
  }
}
//Game table section lines 68 - 169
async function createNewGame(newGameObj) {
  try {
    const { rows } = await client.query(
      `
        INSERT INTO games(title, platform, genre, msrp, score, ourreview, studio, ourscore, picture)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
        `,
      [
        newGameObj.title,
        newGameObj.platform,
        newGameObj.genre,
        newGameObj.msrp,
        newGameObj.score,
        newGameObj.ourreview,
        newGameObj.studio,
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
  try {
    const { rows } = await client.query(`
        SELECT * FROM games;
        `);

    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function fetchGameById(idValue) {
  try {
    const { rows } = await client.query(`
        SELECT * FROM games
        WHERE "gameId" = ${idValue};
        `);

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

// async function fetchGameByGenre(genreValue) {
//   try {
//     const { rows } = await client.query(`
//         SELECT * FROM games
//         WHERE "genre" = '${genreValue}';
//         `);

//     return rows[0];
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function fetchGameByPlatform(platformValue) {
//   try {
//     const { rows } = await client.query(`
//         SELECT * FROM games
//         WHERE "platform" = ${platformValue};
//         `);

//     return rows[0];
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function fetchGameByOurscore(ourscoreValue) {
//   try {
//     const { rows } = await client.query(`
//         SELECT * FROM games
//         WHERE "ourscore" = ${ourscoreValue};
//         `);

//     return rows[0];
//   } catch (error) {
//     console.log(error);
//   }
// }

async function fetchGameByStudio(studioValue) {
  try {
    const { rows } = await client.query(`
        SELECT * FROM games
        WHERE "studio" = '${studioValue}';
        `);

    console.log(rows);
    console.log("This is the fetchgameby studio function");
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

//Start of Users table section lines 171 through XXXX

// async function createInitialUsers

//Start of Reviews table section lines xxxxx through XXXX

// async function createInitialReviews

async function buildDatabase() {
  try {
    client.connect();

    await dropTables();
    await createTables();

    const gameDiablo4 = await createNewGame({
      title: "Diablo 4",
      platform: "PC, XBox, PlayStation",
      genre: "Action RPG",
      msrp: "$69.99",
      score: "4",
      ourreview:
        "Diablo 4 is a game available on Battle.net. It costs almost $70 and will run higher for the ultimate collector's edition.",
      studio: "Blizzard",
      ourscore: "3",
      picture: "url for Diablo 4 eventually",
    });

    const gameTheLastOfUs = await createNewGame({
      title: "The Last of Us",
      platform: "PC, PlayStation 5",
      genre: "Action RPG",
      msrp: "$19.99",
      score: "5",
      ourreview: "The Last of Us is awesome! Sorry about her dad.",
      studio: "Naughty Dog",
      ourscore: "5",
      picture: "url for last of us eventually",
    });

    const gameTheLastOfUs2 = await createNewGame({
      title: "The Last of Us 2",
      platform: "PC, PlayStation 5",
      genre: "Action RPG",
      msrp: "$59.99",
      score: "5",
      ourreview: "The Last of Us 2 is better than the first.",
      studio: "Naughty Dog",
      ourscore: "5",
      picture: "url for last of us 2 eventually",
    });

    const gameDyingLight = await createNewGame({
      title: "Dying Light",
      platform: "PlayStation 5",
      genre: "Survival",
      msrp: "$9.99",
      score: "5",
      ourreview: "The Last of Us is awesome! Sorry about her dad.",
      studio: "Techland",
      ourscore: "4",
      picture: "url for dying light eventually",
    });

    const gameDyingLight2 = await createNewGame({
      title: "Dying Light 2: Stay Human",
      platform: "PC, PlayStation 5",
      genre: "Survival",
      msrp: "$29.99",
      score: "4",
      ourreview: "The Last of Us is awesome! Sorry about her dad.",
      studio: "Techland",
      ourscore: "4",
      picture: "url for dying light 2 stay human eventually",
    });

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
    });

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
    });

    const gameUncharted4 = await createNewGame({
      title: "Uncharted 4: A Thief's End",
      platform: "PlayStation 4, Xbox One",
      genre: "Adventure RPG",
      msrp: "$24.99",
      score: "5",
      ourreview: "Uncharted 4, not Nathan Fillian.",
      studio: "Naughty Dog",
      ourscore: "5",
      picture: "url for uncharted 4 eventually",
    });

    const gameUnchartedTheLostLegacy = await createNewGame({
      title: "Uncharted: The Lost Legacy",
      platform: "PlayStation 5",
      genre: "Adventure RPG",
      msrp: "$39.99",
      score: "3",
      ourreview: "Was this the last of the uncharted series?.",
      studio: "Techland",
      ourscore: "4",
      picture: "url for Uncharted The Lost Legacy eventually",
    });

    const gameRiseofTheTombRaider = await createNewGame({
      title: "Rise of the Tomb Raider",
      platform: "PC, PlayStation 5",
      genre: "Adventure RPG",
      msrp: "$29.99",
      score: "4",
      ourreview: "Was this the last of the uncharted series?.",
      studio: "Techland",
      ourscore: "5",
      picture: "url for Rise of the Tomb Raider eventually",
    });

    const gameDeadByDaylight = await createNewGame({
      title: "Dead by Daylight",
      platform: "PC, PlayStation 5",
      genre: "Adventure RPG, Horror",
      msrp: "$19.99",
      score: "4",
      ourreview: "This is one of the most fun to watch RP streams to.",
      studio: "Behaviour Interactive Inc",
      ourscore: "4",
      picture: "url for Dead by Daylight eventually",
    });

    const gameCSGO = await createNewGame({
      title: "Counter-Strike: Global Offensive",
      platform: "PC, PlayStation 5",
      genre: "FPS",
      msrp: "$19.99",
      score: "4",
      ourreview: "Classic. Don't gamble lol.",
      studio: "Behaviour Interactive Inc",
      ourscore: "4",
      picture: "url for Counter-Strike: Global Offensive eventually",
    });

    const gameStardewValley = await createNewGame({
      title: "Stardew Valley",
      platform: "PC, PlayStation 5",
      genre: "Simulation",
      msrp: "$14.99",
      score: "4",
      ourreview: "Basically a goat of sim games and farming sims.",
      studio: "Behaviour Interactive Inc",
      ourscore: "5",
      picture: "url for stardew valley eventually",
    });

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
    });

    const gameGolfWithFriends = await createNewGame({
      title: "Golf with Friends",
      platform: "PC, PlayStation 5",
      genre: "Sports",
      msrp: "$4.94",
      score: "3",
      ourreview: "So fun to play in an altered state with friends!",
      studio: "Paradox Interaction",
      ourscore: "3",
      picture: "url for golf with friends eventually",
    });

    const gameShadowOfTheTombRaider = await createNewGame({
      title: "Shadow of the Tomb Raider",
      platform: "PS4",
      genre: "Adventure",
      msrp: "$9.99",
      score: "4",
      ourreview: "Pretty good for a later sequenced game!",
      studio: "Crystal Dynamics",
      ourscore: "3",
      picture: "url for Shadow of the Tomb Raider eventually",
    });

    const gameFinalFantasy = await createNewGame({
      title: "Final Fantasy XIV Online",
      platform: "PC",
      genre: "MMO, RPG",
      msrp: "$19.99",
      score: "5",
      ourreview: "BEAUTIFUL JRPG and MMO with many expansions!",
      studio: "Squre Enix",
      ourscore: "5",
      picture: "url for Final Fantasy XIV Online eventually",
    });

    const gamePhantasyStarOnline2 = await createNewGame({
      title: "Phantasy Star Online 2",
      platform: "PC, PS5",
      genre: "MMO, RPG",
      msrp: "Free",
      score: "3",
      ourreview:
        "JRPG and at first it was okay, but then it kinda turned pay to win.",
      studio: "Hi-Rez Studios",
      ourscore: "2",
      picture: "url for Phantasy Star Online 2 eventually",
    });

    const gameSMITE = await createNewGame({
      title: "SMITE",
      platform: "Action, MOBA",
      genre: "MMO, RPG",
      msrp: "Free",
      score: "3",
      ourreview: "BEAUTIFUL JRPG and MMO with many expansions!",
      studio: "Hi-Rez Studios",
      ourscore: "2",
      picture: "url for SMITE eventually",
    });

    const gameDisneyDreamlightValley = await createNewGame({
      title: "Disney Dreamlight Valley",
      platform: "Simulation, Relaxing",
      genre: "PC, XBOX ONE, PS5",
      msrp: "$29.99",
      score: "5",
      ourreview: "SO MUCH FUUUUUUUUUUUN!",
      studio: "Disney",
      ourscore: "5",
      picture: "url for Disney Dreamlight Valley eventually",
    });

    const gameCrusaderKings = await createNewGame({
      title: "Crusader Kings III",
      platform: "Strategy, RPG",
      genre: "PC, PS5",
      msrp: "$49.99",
      score: "3",
      ourreview: "Pretty good with excellent story lines!",
      studio: "Paradox Interaction",
      ourscore: "4",
      picture: "url for Crusader Kings III eventually",
    });

    const allGames = await fetchAllGames();
    const findSpecificGame = await fetchGameById(1);
    console.log(findSpecificGame);

    //Health check for the fetch studio function
    // const allStudios = await fetchGameByStudio('');
    // console.log("All studios");
    // console.log(allStudios);

    client.end();
  } catch (error) {
    console.log(error);
  }
}

// buildDatabase();

module.exports = {
  fetchAllGames,
  fetchGameById,
  // fetchGameByGenre,
  // fetchGameByPlatform,
  // fetchGameByOurscore,
  fetchGameByStudio,
  createNewGame,
  buildDatabase,
};
