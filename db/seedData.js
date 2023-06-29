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
          username VARCHAR(255) UNIQUE NOT NULL,
          fname VARCHAR(255) NOT NULL,
          lname VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          profilepic VARCHAR(255) NOT NULL,
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

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

//Start of Users table section lines 174 through 209
async function createInitialUsers(userObj) {
  try {
    const { rows } = await client.query(
      `
        INSERT INTO users(username, fname, lname, password, email, profilepic, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING username;
        `,
      [
        userObj.username,
        userObj.fname,
        userObj.lname,
        userObj.password,
        userObj.email,
        userObj.profilepic,
        userObj.is_admin,
      ]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllUsers() {
  try {
    const { rows } = await client.query(`
        SELECT * FROM users;
        `);

    return rows;
  } catch (error) {
    console.log(error);
  }
}

//Start of Reviews table section lines xxxxx through XXXX
// async function createInitialReviews

//Build the master DB
async function buildDatabase() {
  try {
    client.connect();

    await dropTables();
    await createTables();

    //Start of games seed data
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
      platform: "PC, XBOX ONE, PS5",
      genre: "Simulation, Relaxing",
      msrp: "$29.99",
      score: "5",
      ourreview: "SO MUCH FUUUUUUUUUUUN!",
      studio: "Disney",
      ourscore: "5",
      picture: "url for Disney Dreamlight Valley eventually",
    });

    const gameCrusaderKings = await createNewGame({
      title: "Crusader Kings III",
      platform: "PC, PS5",
      genre: "Strategy, RPG",
      msrp: "$49.99",
      score: "3",
      ourreview: "Pretty good with excellent story lines!",
      studio: "Paradox Interaction",
      ourscore: "4",
      picture: "url for Crusader Kings III eventually",
    });

    const gameNioh2 = await createNewGame({
      title: "Nioh 2",
      platform: "PC, PS5, XBOX",
      genre: "Action, RPG",
      msrp: "$29.99",
      score: "3",
      ourreview: "Almost more fructrating than the first. Yokai infest the land and our protagonist defends it!!",
      studio: "KOEI TECMO Games Co Ltd",
      ourscore: "3",
      picture: "url for Nioh 2 eventually",
    });

    const gameF123 = await createNewGame({
      title: "F123",
      platform: "PC, PS5, XBOX",
      genre: "Sports, Racing",
      msrp: "$69.99",
      score: "5",
      ourreview: "Formula 1 racing sim at its best!",
      studio: "Electronic Arts",
      ourscore: "5",
      picture: "url for F123 eventually",
    });

    const gameMadden24 = await createNewGame({
      title: "Madden NFL 24",
      platform: "PC, PS5, XBOX",
      genre: "Action, Sports",
      msrp: "$69.99",
      score: "5",
      ourreview: "WOW, another football game that accounts for such a large percentage of EA's annual revenue",
      studio: "Electronic Arts",
      ourscore: "4",
      picture: "url for Madden NFL 24 eventually",
    });

    const gameGreenHell = await createNewGame({
      title: "Green Hell",
      platform: "PC, PS5, XBOX",
      genre: "Horror, Survival",
      msrp: "$24.99",
      score: "4",
      ourreview: "Being stalked by a jaguar and building a shelter, all whilst avoiding malaria. Cool horror sim, first person view.",
      studio: "Creepy Jar",
      ourscore: "5",
      picture: "url for Green Hell eventually",
    });

    const gameMarioKart8 = await createNewGame({
      title: "Mario Kart 8 Deluxe",
      platform: "Nintendo Switch",
      genre: "Adventure, Racing",
      msrp: "$59.99",
      score: "5",
      ourreview: "Classic Mario Kart with modern graphics!",
      studio: "Nintendo",
      ourscore: "5",
      picture: "url for Mario Kart 8 Deluxe eventually",
    });

    const gamePikmin4 = await createNewGame({
      title: "Pikmin 4",
      platform: "Nintendo Switch",
      genre: "Action, RPG",
      msrp: "$59.99",
      score: "4",
      ourreview: "Long awaited sequel!",
      studio: "Nintendo",
      ourscore: "4",
      picture: "url for Pikmin 4 eventually",
    });

    const gameLegendOfZeldaTOK = await createNewGame({
      title: "The Legend of Zelda: Tears of the Kingdom",
      platform: "Nintendo Switch",
      genre: "Action, RPG",
      msrp: "$59.99",
      score: "4",
      ourreview: "Really cool graphics and really fun to play!",
      studio: "Nintendo",
      ourscore: "5",
      picture: "url for The Legend of Zelda: Tears of the Kingdom eventually",
    });

    const allGames = await fetchAllGames();
    const findSpecificGame = await fetchGameById(1);
    console.log(findSpecificGame);

    //Start of user seed data
    const seedUser1 = await createInitialUsers({
      username: "sarahadmin",
      fname: "sarah",
      lname: "admin",
      password: "adminPass1",
      email: "sadmin1@gmail.com",
      profilepic: "url/href for sarahadmin",
      is_admin: true,
    });

    const seedUser2 = await createInitialUsers({
      username: "coltonadmin",
      fname: "colton",
      lname: "admin",
      password: "adminPass2",
      email: "sadmin2@gmail.com",
      profilepic: "url/href for coltonadmin",
      is_admin: true,
    });

    const seedUser3 = await createInitialUsers({
      username: "kelseyadmin",
      fname: "kelsey",
      lname: "admin",
      password: "adminPass3",
      email: "sadmin3@gmail.com",
      profilepic: "url/href for kelseyadmin",
      is_admin: true,
    });

    const seedUser4 = await createInitialUsers({
      username: "jessieadmin",
      fname: "jessie",
      lname: "admin",
      password: "adminPass4",
      email: "sadmin4@gmail.com",
      profilepic: "url/href for jessieadmin",
      is_admin: true,
    });

    const seedUser5 = await createInitialUsers({
      username: "tmedhurst",
      fname: "Ted",
      lname: "Medhurst",
      password: "somethingDumb123",
      email: "atuny0@sohu.com",
      profilepic: "url/href for tmedhurst",
      is_admin: false,
    });

    const seedUser6 = await createInitialUsers({
      username: "SlaBing ",
      fname: "Slater",
      lname: "Bingly",
      password: "slaterhater234",
      email: "hbingley1@gmail.com",
      profilepic: "url/href for seedUser1url/href for tmedhurst",
      is_admin: false,
    });

    const seedUser7 = await createInitialUsers({
      username: "CarlyButtonedUp ",
      fname: "Carly",
      lname: "Button",
      password: "ljfkej24",
      email: "button12349590x@sohu.com",
      profilepic: "url/href for CarlyButtonedUp",
      is_admin: false,
    });

    const seedUser8 = await createInitialUsers({
      username: "RashadW",
      fname: "Rashad",
      lname: "Weeks",
      password: "hienig89",
      email: "rshawe2@eharmony.com",
      profilepic: "url/href for Rashad Weeks",
      is_admin: false,
    });

    const seedUser9 = await createInitialUsers({
      username: "DemCork",
      fname: "Demetrius",
      lname: "Corkery",
      password: "L89Nbbje3",
      email: "nloiterton8@aol.com",
      profilepic: "url/href for seedUser1",
      is_admin: false,
    });

    const seedUser10 = await createInitialUsers({
      username: "ThermanU",
      fname: "Umma",
      lname: "Therman",
      password: "hionwlHHIPN950",
      email: "umcgourty9@jalbum.net",
      profilepic: "url/href for ThermanU",
      is_admin: false,
    });

    const seedUser11 = await createInitialUsers({
      username: "RathAssunta",
      fname: "Assunta",
      lname: "Rath",
      password: "Kinw&^045tG",
      email: "rhallawellb@dropbox.com",
      profilepic: "url/href for RathAssunta",
      is_admin: false,
    });

    const seedUser12 = await createInitialUsers({
      username: "SkilesG",
      fname: "Skiles",
      lname: "Goodwin",
      password: "post235jKKl2h",
      email: "lgribbinc@posterous.com",
      profilepic: "url/href for SkilesG",
      is_admin: false,
    });

    const seedUser13 = await createInitialUsers({
      username: "MikeT123",
      fname: "MikeT",
      lname: "Turley",
      password: "jIowne82JlwJJI",
      email: "mturleyd@tumblr.com",
      profilepic: "url/href for MikeT123",
      is_admin: false,
    });

    const seedUser14 = await createInitialUsers({
      username: "MichKimi",
      fname: "Michelle",
      lname: "Kimichi",
      password: "LnwkOhspwh928!!",
      email: "kminchelle@qicktrip.com",
      profilepic: "url/href for MichKimi",
      is_admin: false,
    });

    const seedUser15 = await createInitialUsers({
      username: "ACardigan",
      fname: "Aubrey",
      lname: "Cardigan",
      password: "KlwhII928K",
      email: "acc@robohash.org",
      profilepic: "url/href for ACardigan",
      is_admin: false,
    });

    const seedUser16 = await createInitialUsers({
      username: "BarryF1",
      fname: "Barry",
      lname: "Faye",
      password: "lng-86.58",
      email: "bleveragei@xinjianguni.edu",
      profilepic: "url/href for BarryF1",
      is_admin: false,
    });

    const seedUser17 = await createInitialUsers({
      username: "RennerL22",
      fname: "Lenna",
      lname: "Renner",
      password: "szWAG6hc",
      email: "aeatockj@psu.edu",
      profilepic: "url/href for RennerL22",
      is_admin: false,
    });

    const seedUser18 = await createInitialUsers({
      username: "ErnserDoylful31",
      fname: "Doyle",
      lname: "Ernser",
      password: "tq920JJI7kPXyf",
      email: "ckeernser@pen.io",
      profilepic: "url/href for ErnserDoylful31",
      is_admin: false,
    });

    const seedUser19 = await createInitialUsers({
      username: "TWeber25",
      fname: "Teresa Weber",
      lname: "Teresa Weber",
      password: "928arecusandaeest020",
      email: "froachel@howstuffworks.com",
      profilepic: "url/href for TWeber25",
      is_admin: false,
    });

    const seedUser20 = await createInitialUsers({
      username: "C_KensleyStar",
      fname: "Chelsea",
      lname: "Kensleyk",
      password: "ipsumut&GGEof28",
      email: "ckensleyk@pen.io",
      profilepic: "url/href for C_KensleyStar",
      is_admin: false,
    });

    const seedUser21 = await createInitialUsers({
      username: "FRosenbaum",
      fname: "Felicity Rosenbaum",
      lname: "Felicity Rosenbaum",
      password: "zQwaHTHbuZyr",
      email: "beykelhofm@wikispaces.com",
      profilepic: "url/href for FRosenbaum",
      is_admin: false,
    });

    const seedUser22 = await createInitialUsers({
      username: "KeardRk",
      fname: "Richard",
      lname: "Keard",
      password: "bMQnPttV",
      email: "brickeardn@fema.gov",
      profilepic: "url/href for KeardRk",
      is_admin: false,
    });

    const seedUser23 = await createInitialUsers({
      username: "GronaverL",
      fname: "Laura",
      lname: "Gronaver",
      password: "4a1dAKDv9KB9",
      email: "lgronaverp@cornell.edu",
      profilepic: "url/href for GronaverL",
      is_admin: false,
    });

    const seedUser24 = await createInitialUsers({
      username: "SchowalterP",
      fname: "Piper",
      lname: "Schowalter",
      password: "xZnWSWnqH",
      email: "fokillq@amazon.co",
      profilepic: "url/href for SchowalterP",
      is_admin: false,
    });

    const seedUser25 = await createInitialUsers({
      username: "KTLarkin",
      fname: "Kody",
      lname: "Tern Larkin",
      password: "HLDqN59vCF",
      email: "xisherwoodr@ask.com",
      profilepic: "url/href for KTLarkin",
      is_admin: false,
    });

    const seedUser26 = await createInitialUsers({
      username: "MacyGreen8",
      fname: "Macy",
      lname: "Greenfelder",
      password: "ePawWgrnZR8L",
      email: "jissetts@hostgator.com",
      profilepic: "url/href for MacyGreen8",
      is_admin: false,
    });

    const seedUser27 = await createInitialUsers({
      username: "MStracke",
      fname: "Maurine",
      lname: "Stracke",
      password: "5t6q4KC7O",
      email: "kdulyt@umich.edu",
      profilepic: "url/href for MStracke",
      is_admin: false,
    });

    const seedUser28 = await createInitialUsers({
      username: "J_ohNbabyJ",
      fname: "John",
      lname: "Mulaney",
      password: "llkjd$392j",
      email: "jmulaney@notsnl.com",
      profilepic: "url/href for J_ohNbabyJ",
      is_admin: false,
    });

    const seedUser29 = await createInitialUsers({
      username: "UngangweP",
      fname: "Phinn",
      lname: "Ungangwe",
      password: "L*hwU2H",
      email: "ungangugn@nsu.edu",
      profilepic: "url/href for UngangweP",
      is_admin: false,
    });

    const seedUser30 = await createInitialUsers({
      username: "GaleJaxJax2222",
      fname: "Jaxon",
      lname: "Gale",
      password: "Heni288&lwj",
      email: "glaej@gmail.com",
      profilepic: "url/href for GaleJaxJax2222",
      is_admin: false,
    });

    const allUsers = await fetchAllUsers();
    console.log(fetchAllUsers);

    client.end();
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  fetchAllGames,
  fetchGameById,
  // fetchGameByGenre,
  // fetchGameByPlatform,
  // fetchGameByOurscore,
  fetchGameByStudio,
  createNewGame,
  createInitialUsers,
  fetchAllUsers,
  buildDatabase,
};
