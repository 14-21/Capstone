// This file will run code to build db and all its content on an external hosting site.

// import client connection
const client = require("./index");

//what do you look like, what data are you going to be filled with

async function createTables() {
  try {
    await client.query(`
            CREATE TABLE games(
            
                "gameId" SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                platform VARCHAR(255) NOT NULL,
                genre VARCHAR(255) NOT NULL,
                msrp VARCHAR (255) NOT NULL,
                score VARCHAR (255) NOT NULL,
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
  }
}

async function createNewGame(newGameObj) {
  try {
    const { rows } = await client.query
    (`
        INSERT INTO games(title, platform, genre, msrp, score, review, author, comments, ourscore, picture)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
        `,
      [
        newGameObj.title,
        newGameObj.platform,
        newGameObj.genre,
        newGameObj.msrp,
        newGameObj.score,
        newGameObj.review,
        newGameObj.author,
        newGameObj.comments,
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
        `)

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}


async function buildDatabase() {
  try {
    client.connect();

    await destroyTables();
    await createTables();

    const firstGame = await createNewGame ({
      title: "Diablo 4",
      platform: "PC, XBox, PlayStation",
      genre: "Action RPG",
      msrp: "$69.99",
      score: "4",
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

  } catch (error) {
    console.log(error);
  }
}

// buildDatabase();

module.exports = {
  fetchAllGames,
  fetchGameById,
  createNewGame,
};