// This file will run code to build db and all its content on an external hosting site.
// import client connection
const client = require("./index");

async function dropTables() {
  console.log("Dropping Tables");

  try {
    await client.query(`
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS games;
    DROP TABLE IF EXISTS users;
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
                ourscore INTEGER NOT NULL,
                picturecard TEXT DEFAULT 'no description',
                pictureheader TEXT DEFAULT 'no description',
                picturebody TEXT DEFAULT 'no description',
                picturefooter TEXT DEFAULT 'no description',
                synopsis TEXT DEFAULT 'no description',
                about TEXT DEFAULT 'no description',
                forgamer TEXT DEFAULT 'no description',
                notfor TEXT DEFAULT 'no description'
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
          profilepic TEXT DEFAULT 'https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg',
          is_admin BOOLEAN DEFAULT false
          );
          `);

    await client.query(`
        CREATE TABLE reviews (
          "reviewId" SERIAL PRIMARY KEY,
          reviewbody TEXT DEFAULT 'Your Review Here',
          userscore INTEGER NOT NULL,
          "reviewUserId" INTEGER REFERENCES users("userId")
          ON DELETE CASCADE,
          "reviewGameId" INTEGER REFERENCES games("gameId")
          ON DELETE CASCADE
        );
        `);

    await client.query(`
        CREATE TABLE comments (
          "commentId" SERIAL PRIMARY KEY,			
          commentbody TEXT DEFAULT 'Your Comment Here',
          "origUserId" INTEGER REFERENCES users("userId")
          ON DELETE CASCADE,
          "origReviewId" INTEGER REFERENCES reviews("reviewId")
          ON DELETE CASCADE
        );
        `);

    console.log("Finished creating tables");
  } catch (error) {
    throw error;
  }
}

async function createNewGame(newGameObj) {
  try {
    const { rows } = await client.query(
      `
        INSERT INTO games(title, platform, genre, msrp, score, ourreview, studio, ourscore, picturecard, pictureheader, picturebody, picturefooter, synopsis, about, forgamer, notfor)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
        newGameObj.picturecard,
        newGameObj.pictureheader,
        newGameObj.picturebody,
        newGameObj.picturefooter,
        newGameObj.synopsis,
        newGameObj.about,
        newGameObj.forgamer,
        newGameObj.notfor,
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
        WHERE "gameId" = '${idValue}';
        `);

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function fetchGameByOurscore(ourscoreValue) {
  try {
    const { rows } = await client.query(`
        SELECT * FROM games
        WHERE ourscore = '${ourscoreValue}';
        `);

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function fetchGameByStudio(studioValue) {
  try {
    const { rows } = await client.query(`
        SELECT * FROM games
        WHERE "studio" = '${studioValue}';
        `);

    console.log(rows);
    console.log("This is the fetchGameByStudio function");

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllGamesByTitle() {
  try {
    const { rows } = await client.query(`
        SELECT * FROM games
        WHERE "gameId" > 0
        ORDER BY "title";
        `);

    return rows;
  } catch (error) {
    console.log(error);
  }
}


async function fetchGameByGenre(genreValue) {
  try {
    const { rows } = await client.query(`
    SELECT * FROM games
    WHERE "genre" = '${genreValue}';
    `);
    
    console.log(rows);
    console.log("This is the fetchGameByGenre function");
    
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function editGame({
  gameId,
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
}) {
  try {
    console.log(title, platform, genre, msrp, score, ourreview, studio, ourscore, picturecard, pictureheader, picturebody, picturefooter, synopsis, about, forgamer, notfor, gameId, "*******")
    const { rows } = await client.query(
      `
UPDATE games
SET title = $1, platform = $2, genre = $3, msrp = $4, score = $5, ourreview = $6, studio = $7, ourscore = $8, picturecard = $9, pictureheader = $10, picturebody = $11, picturefooter = $12, synopsis = $13, about = $14, forgamer = $15, notfor = $16
WHERE "gameId" = $17
RETURNING *;
`,
      [title, platform, genre, msrp, Number(score), ourreview, studio, Number(ourscore), picturecard, pictureheader, picturebody, picturefooter, synopsis, about, forgamer, notfor, gameId]
    );

    if (rows.length) {
      return rows[0];
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteGame({ gameId }) {
  try {
    console.log(gameId, "game id type");
    const {
      rows: [game],
    } = await client.query(
      `
        DELETE FROM games
        WHERE "gameId" = $1
        RETURNING *;
        `,
      [gameId]
    );

    console.log(game, "delete gameId rows console.log");
    return game;
  } catch (error) {
    console.log(error);
  }
}

//Start of Users table section lines
async function createUsers(userObj) {
  try {
    const { rows } = await client.query(
      `
        INSERT INTO users(username, fname, lname, password, email, profilepic, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING "userId", username, email, is_admin;
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
    console.log("This is the create users function for seed");
    if (rows.length) {
      return rows[0];
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllUsers() {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM users;
      `
    );
    // delete password;
    if (rows.length) {
      return rows;
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchUsersByUsername(username) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM users
      WHERE username = $1;
      `,
      [username]
    );

    // delete password;

    if (rows.length) {
      return rows[0];
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchUsersById(id) {
  console.log(id, typeof id);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM users
      WHERE "userId"=$1;
      `,
      [id]
    );
    console.log(user, "I AM THE USER");
    delete user.password;

    return user;
  } catch (error) {
    console.log(error);
  }
}

async function fetchUsersByAdmin() {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM users
      WHERE is_admin = true;
      `
    );

    // delete adminuser.password;
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function deleteUser({ userId }) {
  console.log(
    userId,
    typeof userId,
    "This is the userId and type of console log"
  );
  try {
    const { rows } = await client.query(
      `
      DELETE FROM users
      WHERE "userId" = $1
      RETURNING *;
      `,
      [userId]
    );
    console.log(rows, "these are the delete user rows console.log");
    return rows;
  } catch (error) {
    console.log(error);
  }
}

//Start of review functions
async function createReviews(reviewObj) {
  console.log("Start of createReviews");
  try {
    const { rows } = await client.query(
      `
        INSERT INTO reviews(reviewbody, userscore, "reviewUserId","reviewGameId")
        VALUES ($1, $2, $3, $4)
        RETURNING reviewbody, userscore ;
        `,
      [
        reviewObj.reviewbody,
        reviewObj.userscore,
        reviewObj.reviewUserId,
        reviewObj.reviewGameId,
      ]
    );
    if (rows.length) {
      return rows[0];
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllReviews() {
  console.log("Starting fetchAllReviews");
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM reviews;
      `
    );
    console.log("end of select from reviews");
    if (rows.length) {
      return rows;
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllReviewsByUserId(id) {
  console.log("Starting fetchAllReviewsByUserId");
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM reviews
      WHERE "reviewUserId" = $1;
      `,
      [id]
    );
    console.log("end of select from reviews");
 
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllReviewsByGameId(reviewGameId) {
  console.log("Starting fetchAllReviewsByGameId");
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM reviews
      WHERE "reviewGameId" = $1;
      `,
      [reviewGameId]
    );
    console.log("end of select reviewsByGameId");
    if (rows.length) {
      return rows;
    }
  } catch (error) {
    console.log(error);
  }
}

async function editReview({
  reviewbody,
  userscore,
  reviewUserId,

  reviewId,
}) {
  console.log(reviewId, userscore, reviewbody, reviewUserId, "@@@@@@@@@@@");
  try {
    const { rows } = await client.query(
      `
UPDATE reviews
SET reviewbody = $1, userscore = $2
WHERE "reviewUserId"=$3 AND "reviewId" = $4
RETURNING *;
`,
      [reviewbody, userscore, reviewUserId, reviewId]
    );

    if (rows.length) {
      return rows[0];
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteReview(reviewId) {
  console.log(reviewId, typeof reviewId);
  try {
    const { rows } = await client.query(
      `
      DELETE FROM reviews
      WHERE "reviewId" = $1
      RETURNING *;
      `,
      [reviewId]
    );

    return rows;
  } catch (error) {
    console.log(error);
  }
}


// Start of Comments Functions
async function createComments(commentObj) {
  try {
    const { rows } = await client.query(
      `
      INSERT INTO comments (commentbody, "origUserId", "origReviewId")
      VALUES ($1, $2, $3)
      RETURNING commentbody, "origUserId";
      `,
      [commentObj.commentbody, commentObj.origUserId, commentObj.origReviewId]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllComments() {
  try {
    const { rows } = await client.query(
      `
        SELECT * FROM comments;
        
        
        `
    );
    if (rows.length) {
      return rows;
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllCommentsByUserId(commentId) {
  try {
    const { rows } = await client.query(
      `
        SELECT * FROM comments
        WHERE "origUserId" = $1;
        `,
      [commentId]
    );
    if (rows.length) {
      return rows;
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchCommentById(commentId) {
  const query = `
    SELECT *
    FROM comments
    WHERE "commentId" = $1
  `;
  const values = [commentId];
  const { rows } = await client.query(query, values);
  return rows[0];
}

async function updateComment(commentId, updatedComment) {
  const query = `
    UPDATE comments
    SET commentbody = $1, "origUserId" = $2, "origReviewId" = $3
    WHERE "commentId" = $4
    RETURNING *;
  `;
  const values = [
    updatedComment.commentbody,
    updatedComment.origUserId,
    updatedComment.origReviewId,
    commentId,
  ];
  const { rows } = await client.query(query, values);
  return rows[0];
}

async function fetchAllCommentsByReviewId(origReviewId) {
  try {
    const { rows } = await client.query(
      `
        SELECT * FROM comments
        WHERE "origReviewId" = $1;
        `,
      [origReviewId]
    );
    if (rows) {
      return rows;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteComment({ commentId }) {
  try {
    const {
      rows: [comment],
    } = await client.query(
      `
          DELETE FROM comments
          WHERE "commentId" = $1
          RETURNING *;
          `,
      [commentId]
    );
    console.log(comment, "delete comment function rows console.log");
    return comment;
  } catch (error) {
    console.log(error);
  }
}

//Build the master DB!
async function buildDatabase() {
  try {
    client.connect();

    await dropTables();
    await createTables();

    //Start of games seed data
    const gameDiablo4 = await createNewGame({
      title: "Diablo 4",
      platform: "PC, XBox, PlayStation",
      genre: "Action",
      msrp: "$69.99",
      score: "4",
      ourreview:
        "Diablo 4 is a game available on Battle.net. It costs almost $70 and will run higher for the ultimate collector's edition at $99.99. All fans will really enjoy the ultimate collector's edition! We would definitely reccommend this game.",
      studio: "Blizzard",
      ourscore: "3",
      picturecard:
        "https://upload.wikimedia.org/wikipedia/en/1/1c/Diablo_IV_cover_art.png",
      pictureheader:
        "https://storage.oyungezer.com.tr/ogz-public/public/content/2023/05/30/content_647601975e823_78396.jpg",
      picturebody:
        "https://www.nme.com/wp-content/uploads/2022/12/Diablo-4-inarius.jpg",
      picturefooter:
        "https://images.blz-contentstack.com/v3/assets/bltf408a0557f4e4998/blt24fbc5431943b197/636d81343debb436bf972c0d/TreasureBeast_Blizzard.png?width=&format=webply&dpr=2&disable=upscale&quality=80",
      synopsis:
        "In Diablo IV, players find themselves in a world ravaged by demonic forces, following the events of Diablo III. The story revolves around the emergence of Lilith, the daughter of Mephisto and Queen of the Succubi, who seeks to wreak havoc and claim dominion over Sanctuary. Players must navigate a dark and treacherous journey, battling against the hordes of Hell and uncovering the mysteries behind Lilith's return, all while discovering their own hidden powers and destiny in a desperate struggle for the fate of humanity.",
      about:
        "Diablo IV is the highly anticipated sequel to the iconic Diablo franchise developed by Blizzard Entertainment. Set in a dark and gothic world, players will embark on a thrilling and brutal journey as they face off against the forces of Hell. With an emphasis on immersive storytelling, Diablo IV promises to deliver a rich and intricate narrative that explores the deep lore of the Diablo universe. Players can look forward to a vast and dynamic open world, engaging multiplayer features, and an enhanced loot system that will keep them hooked for hours on end.",
      forgamer:
        "Fans of the Diablo franchise. Open-world exploration fans, loot, and character customization enthusiasts, and players interested in dark fantasy and deep lore. Action and Hack-and-Slash enthusiasts. Action and Hack-and-Slash enthusiasts.",
      notfor:
        "Those who prefer lighthearted or family-friendly content . Individuals who dislike action-oriented gameplay. Players seeking linear narratives or with low tolerance for violence or horror.",
    });

    const gameTheLastOfUs = await createNewGame({
      title: "The Last of Us",
      platform: "PC, PlayStation 5",
      genre: "RPG",
      msrp: "$19.99",
      score: "5",
      ourreview: "The Last of Us is awesome! Sorry about her dad.",
      studio: "Naughty Dog",
      ourscore: "5",
      picturecard:
        "https://m.media-amazon.com/images/M/MV5BMTkzMzk3MzYzMV5BMl5BanBnXkFtZTgwOTQzMDM2MTE@._V1_FMjpg_UX1000_.jpg",
      pictureheader:
        "https://www.gizchina.com/wp-content/uploads/images/2023/03/The-Last-of-Us-Part-1.jpg",
      picturebody:
        "https://www.gameinformer.com/sites/default/files/styles/body_default/public/2022/06/09/61668e56/t6.jpeg",
      picturefooter:
        "https://www.usatoday.com/gcdn/media/USATODAY/GenericImages/2013/07/01/1372696134000-The-Last-of-Us---b-1307011230_16_9.JPG?width=1272&height=720&fit=crop&format=pjpg&auto=webp",
      synopsis:
        "The Last of Us is a critically acclaimed post-apocalyptic action-adventure game developed by Naughty Dog. Set in a world devastated by a fungal pandemic, the story follows Joel, a hardened survivor, and Ellie, a young girl with a mysterious immunity to the infection, as they embark on a dangerous journey across the United States. Their harrowing quest for survival and the deep bond that forms between them make for a gripping narrative that explores themes of love, loss, and the lengths one will go to protect what they hold dear.",
      about:
        "The Last of Us is a renowned post-apocalyptic video game developed by Naughty Dog. It takes place in a world ravaged by a fungal outbreak, where players assume the role of Joel, a smuggler tasked with escorting Ellie, a teenage girl who may hold the cure to the infection, across the treacherous United States. As they encounter hostile survivors and infected creatures, the game immerses players in a gripping and emotionally charged story that delves into themes of survival, morality, and the complex relationship between Joel and Ellie.",
      forgamer:
        "The Last of Us is primarily targeted towards players who appreciate immersive storytelling and character-driven narratives in video games. It appeals to fans of post-apocalyptic settings, survival themes, and cinematic experiences. The game caters to those who enjoy a combination of tense stealth-based gameplay, intense action sequences, and emotional depth in their gaming experiences.",
      notfor:
        "While The Last of Us has garnered widespread acclaim, there are certain groups of individuals who may not find it suitable for their preferences or sensitivities. The game may not be for those who prefer lighthearted or comedic gaming experiences, as it delves into darker and emotionally heavy themes. Additionally, individuals who are uncomfortable with violence, intense action sequences, or mature content may not find The Last of Us to be their preferred choice. Lastly, players who prioritize fast-paced gameplay or multiplayer-focused experiences over narrative-driven single-player campaigns may not fully appreciate the game's slower pace and emphasis on storytelling.",
    });

    const gameTheLastOfUs2 = await createNewGame({
      title: "The Last of Us 2",
      platform: "PC, PlayStation 5",
      genre: "FPS",
      msrp: "$59.99",
      score: "5",
      ourreview:
        "The Last of Us 2 is better than the first and pretty darn good for a sequel.",
      studio: "Naughty Dog",
      ourscore: "5",
      picturecard:
        "https://image.api.playstation.com/vulcan/img/rnd/202010/2618/w48z6bzefZPrRcJHc7L8SO66.png",
      pictureheader: "https://cdn.europosters.eu/image/hp/52507.jpg",
      picturebody:
        "https://www.xfire.com/wp-content/uploads/2022/10/The-last-of-us-multiplayer-cover.jpg",
      picturefooter:
        "https://cdn.mos.cms.futurecdn.net/Mz3heMHRTTD6GRa45ikjLC-1200-80.jpg",
      synopsis:
        "The Last of Us II is a highly anticipated sequel to the critically acclaimed game developed by Naughty Dog. It continues the post-apocalyptic journey in a world devastated by the Cordyceps infection, focusing on Ellie as the main protagonist seeking vengeance in a brutal and unforgiving landscape. ",
      about:
        "The Last of Us II was released on June 19, 2020, exclusively for the PlayStation 4 console. It marked a highly anticipated follow-up to the original game, The Last of Us, which was released in 2013. The game received significant attention and generated excitement among players and critics alike, leading to its commercial success and widespread critical acclaim. Since its initial release, The Last of Us II has also been made available for the PlayStation 5 console through backward compatibility, offering enhanced performance and visual improvements for players on the next-generation platform.",
      forgamer:
        "The game is targeted towards players who are drawn to emotionally charged narratives, intense and immersive gameplay, and a willingness to explore complex themes of morality, grief, and the consequences of one's actions.",
      notfor:
        "The Last of Us II may not be suitable for everyone due to its mature content and dark themes. Players who are sensitive to violence, graphic imagery, or intense and emotionally challenging storytelling may not find it to be their preferred game. Additionally, those who are seeking lighthearted or more light-hearted gaming experiences, or prioritize multiplayer-focused gameplay over a single-player narrative-driven campaign, may not fully appreciate the game's somber tone and narrative-driven approach.",
    });

    const gameDyingLight = await createNewGame({
      title: "Dying Light",
      platform: "PlayStation 5",
      genre: "Survival",
      msrp: "$9.99",
      score: "5",
      ourreview:
        "Excellent horror game where you play undercover agent Kyle Crane who is sent to infiltrate a quarantine zone in the Middle-east.",
      studio: "Techland",
      ourscore: "4",
      picturecard:
        "https://upload.wikimedia.org/wikipedia/en/c/c0/Dying_Light_cover.jpg",
      pictureheader:
        "https://cdn.akamai.steamstatic.com/steam/apps/239140/capsule_616x353.jpg?t=1674129492",
      picturebody:
        "https://assetsio.reedpopcdn.com/dying-light-1s-next-gen-update-grade-patch-is-now-available-on-xbox-series-x-s-1647901402978.jpg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
      picturefooter:
        "https://cdn.wccftech.com/wp-content/uploads/2022/03/WCCFdyinglight15.jpg",
      synopsis:
        "Dying Light is a survival horror game set in a zombie-infested open world. The game follows the story of Kyle Crane, an undercover operative sent to the quarantined city of Harran. As Crane navigates the treacherous urban environment, he must scavenge for supplies, complete missions, and engage in intense parkour-based combat to survive against both hordes of zombies and hostile human factions. Along the way, he uncovers dark secrets, forms alliances, and makes choices that shape the fate of the city and its inhabitants.",
      about:
        "Dying Light is an action survival horror game developed by Techland and published by Warner Bros. Interactive Entertainment. It was initially released on January 27, 2015, for Microsoft Windows, PlayStation 4, and Xbox One. The game's success led to the release of enhanced editions and DLC expansions, including 'The Following' expansion that introduced a new story campaign and drivable vehicles. Techland continues to support the game with updates and additional content, and a sequel, Dying Light 2, is currently in development.",
      forgamer:
        "Dying Light is primarily targeted towards gamers who enjoy the combination of survival horror, open-world exploration, and intense action. It appeals to those who appreciate the challenge of navigating dangerous environments, engaging in strategic combat, and scavenging for resources to stay alive. Fans of zombie-themed games, parkour mechanics, and immersive gameplay experiences will find Dying Light particularly engaging.",
      notfor:
        "While Dying Light appeals to a broad range of players, there are certain groups of people who may not find it suitable for their preferences or interests. Dying Light may not be for individuals who have a low tolerance for horror themes, violence, or intense and challenging gameplay. Additionally, those who prefer slower-paced or more casual gaming experiences, or who do not enjoy open-world exploration and survival mechanics, may not fully appreciate the game's style and mechanics. Lastly, players who are looking for multiplayer-focused games or extensive online multiplayer components may find Dying Light's primary focus on single-player or cooperative gameplay less appealing.",
    });

    const gameDyingLight2 = await createNewGame({
      title: "Dying Light 2: Stay Human",
      platform: "PC, PlayStation 5",
      genre: "Survival",
      msrp: "$29.99",
      score: "4",
      ourreview:
        "Sequel to the virus campaign but this time it took over 6 years for it to come out, leaving fans breathless for more.",
      studio: "Techland",
      ourscore: "4",
      picturecard:
        "https://image.api.playstation.com/vulcan/img/rnd/202106/2908/7aJhOMuJALdBPqZHVy3CgJsg.png",
      pictureheader:
        "https://c4.wallpaperflare.com/wallpaper/41/194/544/e3-2018-poster-8k-dying-light-2-wallpaper-preview.jpg",
      picturebody:
        "https://media.zenfs.com/en/comingsoon_net_477/9bed1a7c2c948388aa1e2c6652ca6192",
      picturefooter:
        "https://www.digitaltrends.com/wp-content/uploads/2022/01/dl2-featured.jpg?p=1",
      synopsis:
        "Dying Light 2 is a highly anticipated sequel that takes place in a post-apocalyptic open world overrun by infected creatures. Set 15 years after the events of the first game, players assume the role of Aiden Caldwell, a survivor with exceptional parkour skills navigating the decaying city of Villedor. As Aiden, players must make choices that shape the fate of the city, forming alliances and facing the consequences of their actions in a dynamic and branching narrative where the choices have far-reaching impact on the world and its inhabitants.",
      about:
        "Dying Light 2 is being developed by Techland, the same studio responsible for the first Dying Light game. The game was initially announced during E3 2018 and was scheduled for release in Spring 2020. However, the release was postponed to allow for further development and improvement. As of my knowledge cutoff in September 2021, a new release date for Dying Light II was February 4, 2022, but Techland continues to work on the game and provide updates to fans.",
      forgamer:
        "Dying Light 2 is primarily targeted towards gamers who enjoy immersive open-world experiences, intense action gameplay, and narrative-driven storytelling. It appeals to those who relish the challenge of surviving in a post-apocalyptic setting filled with infected creatures and hostile factions, while also making impactful choices that shape the world around them. Fans of the original Dying Light, as well as those who appreciate parkour mechanics, exploration, and deep player agency, will find Dying Light 2 particularly engaging.",
      notfor:
        "While Dying Light 2 has a wide appeal, there are certain groups of people who may not find it suitable for their preferences or gaming interests. The game may not be for those who are sensitive to horror themes, intense violence, or challenging gameplay. Additionally, individuals who prefer slower-paced or more casual gaming experiences, or those who do not enjoy open-world exploration and decision-based narratives, may not fully appreciate Dying Light 2's style and mechanics. Lastly, players who prioritize multiplayer-focused games or extensive online multiplayer components may find Dying Light 2's primary focus on single-player or cooperative gameplay less appealing.",
    });

    const gameHogwartsLegacy = await createNewGame({
      title: "Hogwarts Legacy",
      platform: "PC, PlayStation 5",
      genre: "Adventure",
      msrp: "$59.99",
      score: "5",
      ourreview:
        "If you are a Harry Potter fan, you're literally going to spend so many hours of your life playing this! From flying around on a broom endlessly, to the House stories, to taming your own beasts. The room of requirement is SO amazing!",
      studio: "Avalance",
      ourscore: "5",
      picturecard:
        "https://image.api.playstation.com/vulcan/ap/rnd/202011/0919/cDHU28ds7cCvKAnVQo719gs0.png",
      pictureheader:
        "https://www.topbuzztrends.com/wp-content/uploads/2023/02/Hogwarts-Legac-y_.jpg",
      picturebody:
        "https://images.indianexpress.com/2022/03/hogwarts-legacy-raw-gameplay-featured.jpg",
      picturefooter:
        "https://variety.com/wp-content/uploads/2023/02/Hogwarts-Legacy-1.jpg?w=1000",
      synopsis:
        "Hogwarts Legacy is an upcoming action role-playing game set in the Wizarding World of Harry Potter. The game takes place in the 1800s, allowing players to create their own character and attend Hogwarts School of Witchcraft and Wizardry. As a student with unique magical abilities, players will embark on an immersive journey, unraveling mysteries, learning spells, and making impactful choices that shape their character's destiny in a world filled with magical creatures, secrets, and dark forces.",
      about:
        "Hogwarts Legacy is being developed by Portkey Games, a label under Warner Bros. Interactive Entertainment that focuses on creating games set in the Wizarding World. The game was first announced in September 2020 during a PlayStation Showcase event. As of my knowledge cutoff in September 2021, the game is scheduled to be released in 2022 for various platforms, including PlayStation 5, Xbox Series X/S, and PC. Hogwarts Legacy offers players a highly anticipated opportunity to explore the magical world of Hogwarts and its rich lore in a new and immersive action role-playing experience.",
      forgamer:
        "Hogwarts Legacy is primarily targeted towards gamers who are fans of the Harry Potter franchise and the Wizarding World. It appeals to players who enjoy immersive role-playing experiences, exploration of richly detailed game worlds, and engaging in magical adventures. Fans of open-world games, character customization, and narrative-driven gameplay will find Hogwarts Legacy particularly captivating.",
      notfor:
        "While Hogwarts Legacy has broad appeal, there are certain groups of gamers who may not find it suitable for their preferences. The game may not be for those who are not interested in the Harry Potter universe or the Wizarding World, as it heavily draws upon the franchise's lore. Additionally, players who do not enjoy exploration-based gameplay, immersive storytelling, or role-playing elements may not fully appreciate Hogwarts Legacy's focus on these aspects.",
    });

    const gameDeadIsland2 = await createNewGame({
      title: "Dead Island 2",
      platform: "PC, PlayStation 5",
      genre: "Survival",
      msrp: "$29.99",
      score: "4",
      ourreview:
        "Sounds like the second in the line of zombie shooter survival games. With its epic gore and visceral gameplay, players will have a blast blasting zombies.",
      studio: "Deep Silver",
      ourscore: "3",
      picturecard:
        "https://cdn1.epicgames.com/offer/236c74b4cd2e4e3099cbe2ebdc9686fd/EGS_DeadIsland2_DeepSilverDambusterStudios_S2_1200x1600-efc5201842cf642eb45f73227cd0789b",
      pictureheader:
        "https://i0.wp.com/thegamehaus.com/wp-content/uploads/2023/04/dead-island-2-characters-release-date-jacob.jpg?fit=1920%2C1080&ssl=1",
      picturebody:
        "https://thenerdstash.com/wp-content/uploads/2023/04/dead-island-2-open-world.jpg",
      picturefooter:
        "https://venturebeat.com/wp-content/uploads/2022/08/deadisland2.png?fit=1363%2C777&strip=all",
      synopsis:
        "Dead Island 2 is an upcoming open-world action role-playing game set in a zombie-infested California. The game follows the aftermath of a zombie outbreak in Los Angeles, where players assume the role of a survivor trying to escape the chaos. As players navigate through the open-world environment, they must battle hordes of undead, complete missions, and make choices that impact the outcome of the story, all while uncovering the mysteries behind the zombie virus and the true nature of the outbreak.",
      about:
        "Dead Island 2 is being developed by Dambuster Studios, a subsidiary of Deep Silver and part of the Koch Media group. The game was initially announced during E3 2014 and has undergone development changes and delays since its announcement. As of my knowledge cutoff in September 2021, a specific release date for Dead Island 2 has not been officially announced, and the game's development status has been relatively quiet. Fans eagerly await further updates on the release and development of Dead Island 2.",
      forgamer:
        "Dead Island 2 is primarily targeted towards gamers who enjoy open-world action games with a focus on zombie survival. It appeals to players who relish intense combat against hordes of undead, exploration of large and detailed environments, and engaging in cooperative multiplayer experiences. Fans of the original Dead Island game, as well as those who enjoy sandbox-style gameplay and cooperative gameplay mechanics, will find Dead Island 2 particularly appealing.",
      notfor:
        "Dead Island 2 may not be suitable for gamers who are sensitive to violence, gore, or horror themes, as the game features intense and graphic content. It may not be for players who prefer slower-paced or more casual gaming experiences, as the game emphasizes fast-paced action and combat. Additionally, those who do not enjoy open-world exploration or cooperative multiplayer gameplay may not fully appreciate Dead Island 2's focus on these aspects.",
    });

    const gameUncharted4 = await createNewGame({
      title: "Uncharted 4: A Thief's End",
      platform: "PlayStation 4, Xbox One",
      genre: "Action",
      msrp: "$24.99",
      score: "5",
      ourreview: "Uncharted 4, not Nathan Fillian.",
      studio: "Naughty Dog",
      ourscore: "5",
      picturecard:
        "https://assets2.ignimgs.com/2015/06/03/uncharted-4-button-v2jpg-5a448e.jpg",
      pictureheader:
        "https://assetsio.reedpopcdn.com/uncharted-4-review-1462863882364.jpg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
      picturebody:
        "https://www.digitaltrends.com/wp-content/uploads/2016/05/Uncharted-4-Featured.jpg?resize=625%2C417&p=1",
      picturefooter:
        "https://hips.hearstapps.com/digitalspyuk.cdnds.net/16/13/1459263905-20160224-uncharted-4-story-trailer-01-1456311962.png",
      synopsis:
        "Uncharted 4: A Thief's End follows the final chapter of Nathan Drake's adventure-filled journey. Retired from his treasure-hunting days, Nathan is pulled back into the world of thievery when his long-lost brother, Sam, resurfaces with a life-threatening proposition. Together, they embark on a globe-trotting quest to find the legendary pirate treasure of Henry Avery, facing dangerous enemies, uncovering hidden secrets, and confronting the sacrifices they must make in order to survive and protect their loved ones.",
      about:
        "Uncharted 4: A Thief's End was developed by Naughty Dog, an acclaimed game development studio known for their storytelling prowess. The game was published by Sony Computer Entertainment and released exclusively for the PlayStation 4 console. It was initially announced at E3 2014 and experienced a few delays in its development, but was ultimately released on May 10, 2016, to critical acclaim. Uncharted 4: A Thief's End received numerous accolades for its captivating narrative, stunning visuals, and polished gameplay mechanics, solidifying its place as a standout title in the Uncharted series.",
      forgamer:
        "Uncharted 4: A Thief's End is primarily for gamers who enjoy action-adventure games with strong storytelling elements. It appeals to players who appreciate cinematic experiences, immersive narratives, and engaging characters. Fans of the Uncharted series, as well as those who enjoy exploration, puzzle-solving, and thrilling action sequences, will find Uncharted 4: A Thief's End particularly captivating.",
      notfor:
        "While Uncharted 4: A Thief's End is widely praised, there are certain groups of gamers who may not find it suitable for their preferences. The game may not be for those who do not enjoy linear storytelling or prefer open-world exploration and freedom. Additionally, players who are not interested in action-adventure games, cinematic experiences, or narrative-driven gameplay may not fully appreciate Uncharted 4: A Thief's End. Lastly, individuals who prioritize competitive multiplayer or fast-paced multiplayer experiences over single-player campaigns may find the game's focus on solo storytelling less appealing.",
    });

    const gameUnchartedTheLostLegacy = await createNewGame({
      title: "Uncharted: The Lost Legacy",
      platform: "PlayStation 5",
      genre: "Action",
      msrp: "$39.99",
      score: "3",
      ourreview: "Was this the last of the Uncharted series? We certainlly hope not!",
      studio: "Techland",
      ourscore: "4",
      picturecard:
        "https://m.media-amazon.com/images/M/MV5BNjRmN2EzYTEtYzNlYy00ZDc4LWJlZDgtMDQzYjM0Njg5NmYyXkEyXkFqcGdeQXVyMTk2OTAzNTI@._V1_.jpg",
      pictureheader:
        "https://images.squarespace-cdn.com/content/v1/5a4ff2a98a02c747dc17e25b/1515193434780-4NVVIJ41V3H4YH6YR2PQ/UnchartedLostLegacyReview.png?format=1000w",
      picturebody:
        "https://s3.us-east-1.amazonaws.com/nd.images/uploads/Key-Art-FINAL-FLAT-SM.jpg",
      picturefooter:
        "https://gamespot.com/a/uploads/original/1484/14849348/3274821-utll-launch-screenshot_11.jpg",
      synopsis:
        "Uncharted: The Lost Legacy is a standalone expansion to the Uncharted series, focusing on the characters Chloe Frazer and Nadine Ross. Set in India, the game follows Chloe and Nadine as they embark on a perilous journey to recover an ancient artifact known as the Tusk of Ganesh. As they navigate treacherous landscapes, face formidable enemies, and unravel the secrets of the lost city, they must confront their own pasts and forge an unlikely partnership to survive the challenges that lie ahead.",
      about:
        "Uncharted: The Lost Legacy was developed by Naughty Dog, the same acclaimed studio responsible for the mainline Uncharted series. It was published by Sony Interactive Entertainment and released exclusively for the PlayStation 4 console. The game was initially announced at PlayStation Experience in 2016 as a standalone expansion to the Uncharted franchise. Uncharted: The Lost Legacy was released on August 22, 2017, and received positive reviews for its compelling story, stunning visuals, and satisfying gameplay, showcasing Naughty Dog's ability to deliver engaging adventures within the Uncharted universe.",
      forgamer:
        "Uncharted: The Lost Legacy is primarily for gamers who are fans of the Uncharted series and enjoy action-adventure games with rich storytelling. It appeals to players who appreciate immersive narratives, dynamic characters, and thrilling gameplay. Fans of Chloe Frazer and Nadine Ross, as well as those who enjoy exploration, puzzle-solving, and intense action sequences, will find Uncharted: The Lost Legacy particularly captivating.",
      notfor:
        "While Uncharted: The Lost Legacy has wide appeal, there are certain groups of gamers who may not find it suitable for their preferences. The game may not be for those who are not interested in action-adventure games or cinematic storytelling experiences. Additionally, players who do not enjoy linear gameplay or prefer open-world exploration and freedom may not fully appreciate Uncharted: The Lost Legacy. Lastly, individuals who do not enjoy puzzle-solving, platforming, or character-driven narratives may find the game's focus less appealing.",
    });

    const gameRiseofTheTombRaider = await createNewGame({
      title: "Rise of the Tomb Raider",
      platform: "PC, PlayStation 5",
      genre: "Adventure",
      msrp: "$29.99",
      score: "4",
      ourreview: "Rise of the Tomb Raider really showcases the graphics of the game, voice acting, and CGI effects.",
      studio: "Techland",
      ourscore: "5",
      picturecard:
        "https://m.media-amazon.com/images/M/MV5BMzc5OTU1N2ItNWUzNy00YWM2LWEwMTktZjIzZDNhMzBlNjJjXkEyXkFqcGdeQXVyNTM0MjE5NTc@._V1_FMjpg_UX1000_.jpg",
      pictureheader:
        "https://res.cloudinary.com/jerrick/image/upload/v1527533929/l1iv1xykyxrv79cdok60.jpg",
      picturebody:
        "https://gamingtrend.com/wp-content/uploads/2015/09/1424111575-10.jpg",
      picturefooter:
        "https://www.destructoid.com/wp-content/uploads/2020/12/334741-tombraider.jpg",
      synopsis:
        "Rise of the Tomb Raider follows the next chapter in Lara Croft's journey as she searches for the lost city of Kitezh and its legendary immortality-giving artifact. Determined to uncover the truth behind her father's research, Lara braves treacherous environments, battles hostile forces, and confronts her own limits. As she unravels the mysteries of Kitezh and battles a shadowy organization known as Trinity, Lara must become the Tomb Raider she was destined to be in order to save the world from a devastating threat.",
      about:
        "Rise of the Tomb Raider was developed by Crystal Dynamics, the same studio responsible for the Tomb Raider reboot series. The game was published by Square Enix and released as a timed exclusive for the Xbox One and Xbox 360 consoles in November 2015. It later became available on other platforms, including PlayStation 4 and PC. Rise of the Tomb Raider received critical acclaim for its immersive gameplay, stunning visuals, and compelling storyline, solidifying Lara Croft's place as one of gaming's iconic characters.",
      forgamer:
        "Rise of the Tomb Raider is primarily for gamers who enjoy action-adventure games with strong exploration elements. It appeals to players who appreciate engaging narratives, character development, and puzzle-solving. Fans of the Tomb Raider series, as well as those who enjoy platforming, immersive environments, and thrilling combat, will find Rise of the Tomb Raider particularly captivating.",
      notfor:
        "While Rise of the Tomb Raider has broad appeal, there are certain groups of gamers who may not find it suitable for their preferences. The game may not be for those who are not interested in action-adventure games or prefer linear storytelling experiences. Additionally, players who do not enjoy exploration, puzzle-solving, or platforming mechanics may not fully appreciate Rise of the Tomb Raider. Lastly, individuals who are sensitive to violence or intense action sequences may find the game's combat-focused gameplay less appealing.",
    });

    const gameDeadByDaylight = await createNewGame({
      title: "Dead by Daylight",
      platform: "PC, PlayStation 5",
      genre: "Horror",
      msrp: "$19.99",
      score: "4",
      ourreview:
        "Not only is this is one of the most fun to watch RP streams to, it is incredibly fun to hunt and kill your friends as a famous/infamous killer.",
      studio: "Behaviour Interactive Inc",
      ourscore: "4",
      picturecard:
        "https://upload.wikimedia.org/wikipedia/en/b/b7/Dead_by_Daylight_Steam_header.jpg",
      pictureheader:
        "https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/bbdef82c828601c88b86bc92b92fd491.jpg",
      picturebody:
        "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/06/dead-by-daylight-monster.jpg",
      picturefooter:
        "https://www.superjumpmagazine.com/content/images/2022/08/dead-by-Daylight-feat-image.jpg",
      synopsis:
        "Dead by Daylight is a multiplayer horror game where players can either assume the role of a killer or a survivor. The game takes place in various horrifying realms, and survivors must work together to repair generators and escape, while the killer hunts them down and sacrifices them to a mysterious force. As survivors struggle to evade capture and the killer uses unique abilities to track them down, tension rises in a thrilling game of survival and strategy.",
      about:
        "Dead by Daylight was developed by Behaviour Interactive, a game development studio based in Canada. The game was published by Starbreeze Studios and released initially for PC in June 2016. Since its launch, Dead by Daylight has seen continued support and updates, including the release on various platforms such as PlayStation 4, Xbox One, Nintendo Switch, and mobile devices. The game has garnered a dedicated fan base and has expanded with additional content, including new killers, survivors, and maps, keeping players engaged in its asymmetrical multiplayer horror experience.",
      forgamer:
        "Dead by Daylight is primarily for gamers who enjoy multiplayer, horror-themed experiences with a focus on asymmetrical gameplay. It appeals to players who enjoy both the role of the hunter and the hunted, offering intense and suspenseful gameplay. Fans of cooperative and competitive multiplayer games, as well as those who appreciate horror genres and strategic gameplay, will find Dead by Daylight particularly engaging. Additionally, players who enjoy teamwork, communication, and skill-based challenges will find satisfaction in the game's cooperative survivor gameplay.",
      notfor:
        "Dead by Daylight may not be suitable for gamers who are not comfortable with horror themes or find intense and suspenseful gameplay overwhelming. It may not be for players who prefer single-player experiences or those who do not enjoy competitive multiplayer games. Additionally, individuals who do not appreciate the asymmetrical nature of the gameplay, where one player takes on the role of the killer and others play as survivors, may not find Dead by Daylight appealing. Lastly, players who do not enjoy teamwork, communication, or strategic decision-making may not fully appreciate the game's cooperative survivor gameplay.",
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
      picturecard:
        "https://www.gamespot.com/a/uploads/scale_medium/mig/7/2/0/5/2227205-i2cs9uzmq4yua.jpg",
      pictureheader:
        "https://www.gametutorials.com/wp-content/uploads/2020/08/cs-go.jpg",
      picturebody:
        "https://cdn.akamai.steamstatic.com/steam/apps/730/ss_118cb022b9a43f70d2e5a2df7427f29088b6b191.1920x1080.jpg?t=1683566799",
      picturefooter:
        "https://assetsio.reedpopcdn.com/veteran-shooter-counter-strike-global-offensive-breaks-its-all-time-player-peak-record-1581180453461.jpg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
      synopsis:
        "Counter-Strike: Global Offensive (CS:GO) is a competitive multiplayer first-person shooter game where players join either the terrorist or counter-terrorist team. The game features various game modes, including bomb defusal, hostage rescue, and competitive matches. Players engage in strategic gameplay, utilizing teamwork, communication, and skill to outmaneuver and defeat the opposing team in fast-paced, intense gunfights.",
      about:
        "Counter-Strike: Global Offensive (CS:GO) was developed by Valve Corporation, the same studio behind popular game titles like Half-Life and Portal. It was released on August 21, 2012, as the fourth installment in the Counter-Strike series. CS:GO has since received regular updates, including new maps, weapons, and gameplay improvements. It has become one of the most prominent and enduring competitive esports games, with a strong presence in the professional gaming scene and a dedicated player community worldwide.",
      forgamer:
        "Counter-Strike: Global Offensive (CS:GO) was developed by Valve Corporation, the same studio behind popular game titles like Half-Life and Portal. It was released on August 21, 2012, as the fourth installment in the Counter-Strike series. CS:GO has since received regular updates, including new maps, weapons, and gameplay improvements. It has become one of the most prominent and enduring competitive esports games, with a strong presence in the professional gaming scene and a dedicated player community worldwide.",
      notfor:
        "Counter-Strike: Global Offensive (CS:GO) may not be suitable for gamers who do not enjoy competitive multiplayer experiences or first-person shooter games. It may not be for players who prefer slower-paced or more casual gameplay, as CS:GO emphasizes fast reflexes, precise aiming, and intense action. Additionally, individuals who are sensitive to violence or find realistic combat scenarios uncomfortable may not find CS:GO appealing. Lastly, players who do not enjoy teamwork, communication, or the pressure of competitive environments may not fully appreciate the game's emphasis on cooperative gameplay and competitive matches.",
    });

    const gameStardewValley = await createNewGame({
      title: "Stardew Valley",
      platform: "PC, PlayStation 5",
      genre: "Simulation",
      msrp: "$14.99",
      score: "4",
      ourreview: "Basically the GOAT of sim games and farming sims in 8bit art style.",
      studio: "Concerned Ape",
      ourscore: "5",
      picturecard:
        "https://upload.wikimedia.org/wikipedia/en/f/fd/Logo_of_Stardew_Valley.png",
      pictureheader:
        "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/s/stardew-valley-switch/hero",
      picturebody:
        "https://assets1.ignimgs.com/2018/08/07/stardewvalley-blogroll-1533601459309_160w.jpg?width=1280",
      picturefooter:
        "https://variety.com/wp-content/uploads/2018/07/stardew-valley-multiplayer.png?w=1000&h=563&crop=1",
      synopsis:
        "In Stardew Valley, players take on the role of a character who inherits a run-down farm from their grandfather. The game revolves around restoring the farm, building relationships with the townspeople, exploring the surrounding countryside, and uncovering the secrets of the valley. As players immerse themselves in the charming and peaceful world of Stardew Valley, they can engage in various activities like farming, fishing, mining, and crafting.",
      about:
        "Stardew Valley was developed by Eric Barone, also known as ConcernedApe, as a solo project. The game was released on February 26, 2016, for PC, and later expanded to other platforms such as consoles and mobile devices. It gained widespread acclaim for its nostalgic pixel art style, relaxing gameplay mechanics, and deep simulation elements, becoming a beloved indie title.",
      forgamer:
        "Stardew Valley is for gamers who enjoy laid-back and relaxing experiences, particularly those who appreciate farming simulations, life simulations, and sandbox-style gameplay. It appeals to players who enjoy immersive worlds, character development, and the freedom to pursue various activities at their own pace. The game also appeals to those seeking a break from fast-paced action and a chance to unwind in a charming and nostalgic virtual countryside.",
      notfor:
        "Stardew Valley may not be suitable for gamers who prefer intense action, high-stakes challenges, or linear narratives. It may not appeal to players who thrive on constant objectives and achievements, as Stardew Valley emphasizes player-driven goals and the freedom to pursue various activities. Additionally, individuals who do not enjoy slower-paced, meditative gameplay experiences or the simulation genre may not find Stardew Valley engaging.",
    });

    const gameCitiesSkylines = await createNewGame({
      title: "Cities: Skylines",
      platform: "PC, PlayStation 5",
      genre: "Simulation",
      msrp: "$14.99",
      score: "4",
      ourreview:
        "We have over 500 hours of gameplay, and that's without the expansion packs! Base game has so much content and so much to offer!",
      studio: "Paradox Interaction",
      ourscore: "5",
      picturecard:
        "https://howlongtobeat.com/games/Cities_Skylines_cover_art.jpg",
      pictureheader:
        "https://cdn1.epicgames.com/6009be9994c2409099588cde6f3a5ed0/offer/EGS_CitiesSkylines_ColossalOrder_S3-2560x1440-14df106873c918591e49bd9604841e83.jpg",
      picturebody: "https://i.redd.it/hcqiz72s8if61.png",
      picturefooter:
        "https://media.newyorker.com/photos/59096ffa1c7a8e33fb38ea32/master/w_2560%2Cc_limit/Parking-In-Search-of-the-Keys-to-the-Virtual-City.jpg",
      synopsis:
        "Cities: Skylines is a city-building simulation game where players take on the role of a mayor and manage the development and growth of a city. The game allows players to design and construct various elements of the city, including infrastructure, zoning, and public services. As the city expands, players must balance the needs of the citizens, manage resources, and overcome challenges to create a thriving metropolis.",
      about:
        "Cities: Skylines was developed by Colossal Order and published by Paradox Interactive. The game was released on March 10, 2015, for PC, with subsequent releases on consoles and macOS. It was created as a spiritual successor to SimCity, aiming to provide a more expansive and realistic city-building experience. Cities: Skylines has since received multiple expansions and updates, further enhancing its gameplay and features. As of, September 2021, Cities: Skylines has released several expansions. It has a total of nine major expansions, namely 'After Dark,' 'Snowfall,' 'Natural Disasters,' 'Mass Transit,' 'Green Cities,' 'Parklife,' 'Industries,' 'Campus,' and 'Sunset Harbor.' These expansions introduce new features, mechanics, and content to enhance the gameplay experience and provide additional challenges and options for city management.",
      forgamer:
        "Cities: Skylines is for gamers who enjoy strategic planning, creative problem-solving, and simulation games. It appeals to players who find satisfaction in managing and optimizing complex systems, such as urban development and city management. It caters to those who appreciate the freedom to design and shape a city according to their vision, while balancing the needs and desires of the virtual citizens.",
      notfor:
        "Cities: Skylines may not be suitable for gamers who prefer action-packed or fast-paced gameplay experiences. It may not appeal to players who are not interested in simulation or strategy games, as the focus of the game is on city-building and management rather than direct control or combat. Additionally, individuals who do not enjoy the meticulous planning, resource management, and problem-solving aspects of simulation games may find Cities: Skylines less engaging.",
    });

    const gameGolfWithYourFriends = await createNewGame({
      title: "Golf with Your Friends",
      platform: "PC, PlayStation 5",
      genre: "Sports",
      msrp: "$4.94",
      score: "3",
      ourreview:
        "So fun to play in an altered state with YOUR friends! Challenge each other for the most amazing fails for extra fun!",
      studio: "Paradox Interaction",
      ourscore: "3",
      picturecard:
        "https://image.api.playstation.com/vulcan/ap/rnd/202209/1414/rit1KAnxB1hlwgjlGmWUH1js.png",
      pictureheader:
        "https://seafoamgaming.files.wordpress.com/2020/06/header.jpg?w=640",
      picturebody:
        " https://cdn.akamai.steamstatic.com/steam/apps/431240/ss_af779fcd049a35140f47ff8781eec8d0e5d7d7bd.1920x1080.jpg?t=1684404184",
      picturefooter:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/431240/ss_91d45c28c463c2fc5d4d28f15f900e2456ccf73c.1920x1080.jpg?t=1684404184",
      synopsis:
        "Golf with Friends is a multiplayer mini-golf game where players compete with friends or other online players in various whimsical and challenging courses. The objective is to navigate through the courses, avoiding obstacles and completing each hole in as few strokes as possible. The game offers a fun and lighthearted golfing experience with a focus on multiplayer competition and social interaction.",
      about:
        "Developed by Blacklight Interactive and released on January 30, 2016, initially as an early access title on Steam. The game gained popularity due to its entertaining gameplay, user-generated content support, and multiplayer features. It continued to receive updates and improvements, including the official release in May 2020 for various platforms, including PC, consoles, and mobile devices.s",
      forgamer:
        "Golf with Friends is for gamers who enjoy casual and social multiplayer experiences. It appeals to players who appreciate simple yet challenging gameplay mechanics, where precision and skill are required to complete the courses. The game is particularly enjoyable for those who want to have a fun and competitive time with friends in a lighthearted virtual golfing environment.",
      notfor:
        "Golf with Friends may not be suitable for gamers who prefer highly realistic and simulation-focused golf games. It may not appeal to players who are looking for in-depth storylines or single-player experiences, as the main focus of the game is on multiplayer competition. Additionally, individuals who do not enjoy casual or non-competitive gameplay may not find Golf with Friends engaging, as its main appeal lies in its social and multiplayer aspects.",
    });

    const gameShadowOfTheTombRaider = await createNewGame({
      title: "Shadow of the Tomb Raider",
      platform: "PS4",
      genre: "Adventure",
      msrp: "$9.99",
      score: "4",
      ourreview: "Pretty good for a later sequenced game! Lara remains a bad-ass female lead!",
      studio: "Crystal Dynamics",
      ourscore: "3",
      picturecard:
        "https://upload.wikimedia.org/wikipedia/en/1/11/Shadow_of_the_Tomb_Raider_cover.png",
      pictureheader:
        "https://assets.altarofgaming.com/wp-content/uploads/2022/08/shadow-of-the-tomb-raider-game-cover-altar-of-gaming.jpg",
      picturebody:
        "https://cdn.vox-cdn.com/thumbor/i2lNNB9wCliknDZoQF8nY92m_8M=/0x0:3840x2160/1200x800/filters:focal(1613x773:2227x1387)/cdn.vox-cdn.com/uploads/chorus_image/image/61400833/top.0.jpg",
      picturefooter:
        "https://cdn-ext.fanatical.com/production/product/1280x720/0705fa91-3d52-4f73-acf4-5a4a249dcaa2.png",
      synopsis:
        "In Shadow of the Tomb Raider, players follow the iconic adventurer Lara Croft as she embarks on a perilous journey through Latin America to stop a Maya apocalypse she inadvertently triggered. As Lara races against time, she must navigate treacherous environments, solve intricate puzzles, and engage in intense combat to save the world from impending doom. The game delves into Lara's personal growth as she confronts her inner demons and becomes the Tomb Raider she is destined to be.",
      about:
        "Shadow of the Tomb Raider was developed by Eidos-Montréal in collaboration with Crystal Dynamics, and published by Square Enix. It was released on September 14, 2018, for various platforms, including PC, PlayStation 4, and Xbox One. The game is the third installment in the rebooted Tomb Raider series, following Lara Croft's origins, and it received generally positive reviews for its immersive world, stunning visuals, and engaging gameplay.",
      forgamer:
        "Shadow of the Tomb Raider is for gamers who enjoy action-adventure experiences with a focus on exploration, puzzle-solving, and cinematic storytelling. It appeals to players who appreciate immersive worlds, character-driven narratives, and high-stakes action sequences. The game caters to those who enjoy a balance of intense combat encounters, stealth gameplay, and challenging environmental puzzles.",
      notfor:
        "Shadow of the Tomb Raider may not be suitable for gamers who do not enjoy action-adventure or exploration-based games. It may not appeal to players who prefer linear narratives or fast-paced, non-stop action, as the game incorporates slower-paced exploration and puzzle-solving elements. Additionally, individuals who are not interested in narrative-driven experiences or who are sensitive to violence may not find Shadow of the Tomb Raider engaging.",
    });

    const gameFinalFantasy = await createNewGame({
      title: "Final Fantasy XIV Online",
      platform: "PC",
      genre: "MMO",
      msrp: "$19.99",
      score: "5",
      ourreview: "BEAUTIFUL JRPG and MMO with many expansions! From the rich story-telling to the complicated boss fight sequences, this game will always offer something for everyone!",
      studio: "Squre Enix",
      ourscore: "5",
      picturecard:
        "https://i.pinimg.com/originals/53/92/90/5392905bb793433070f9ef9c517c22e7.jpg",
      pictureheader:
        "https://image.api.playstation.com/vulcan/img/rnd/202011/1211/ZAFmk7QyqFmiIbfiQDdpimy6.jpg",
      picturebody:
        "https://cdn.akamai.steamstatic.com/steam/apps/312060/ss_eeb2568b6d4c4c89b312c5fee01ccdefe7ad4dc2.1920x1080.jpg?t=1646695421",
      picturefooter:
        "https://img.finalfantasyxiv.com/lds/promo/h/F/kadgYdN3VewnLFklKng8AB0nm4.jpg",
      synopsis:
        "Final Fantasy XIV Online is a massively multiplayer online role-playing game (MMORPG) set in the fictional world of Eorzea. Players embark on an epic adventure as the Warrior of Light, tasked with battling a variety of threats, uncovering ancient secrets, and restoring balance to the realm. The game's plot involves political intrigue, thrilling battles, and memorable characters as players explore a vast and immersive fantasy universe.",
      about:
        "Final Fantasy XIV Online was developed and published by Square Enix. It was initially released in 2010 but faced critical and commercial issues, leading to a complete overhaul and re-release known as Final Fantasy XIV: A Realm Reborn in 2013. Since then, the game has received numerous expansions, updates, and patches, expanding the world and adding new content to the ongoing story.",
      forgamer:
        "Final Fantasy XIV Online is for gamers who enjoy immersive, story-driven MMORPG experiences set in richly detailed fantasy worlds. It appeals to players who appreciate complex character customization, engaging quests, and cooperative gameplay with other online players. The game caters to those who enjoy both PvE (player versus environment) content, such as dungeons and raids, and PvP (player versus player) encounters.",
      notfor:
        "Final Fantasy XIV Online may not be suitable for gamers who prefer fast-paced, action-oriented gameplay or who are not interested in investing significant time into an ongoing, evolving online world. It may not appeal to players who do not enjoy the MMORPG genre or who prefer solo gameplay experiences. Additionally, individuals who are not fond of complex game mechanics, extensive lore, or subscription-based payment models may not find Final Fantasy XIV Online appealing.",
    });

    const gameSMITE = await createNewGame({
      title: "SMITE",
      platform: "PC, PS5",
      genre: "MOBA",
      msrp: "Free",
      score: "3",
      ourreview:
        "JRPG and at first it was okay, but then it kinda turned pay to win.",
      studio: "Hi-Rez Studios",
      ourscore: "2",
      picturecard:
        "https://image.api.playstation.com/vulcan/ap/rnd/202212/1417/gRameAdNU1JSRfRxhFCpw4Vs.jpg",
      pictureheader:
        "https://www.evdodepotusa.com/wp-content/uploads/2019/07/How-much-data-does-Smite-use-1200x675.jpg",
      picturebody:
        "https://image.api.playstation.com/vulcan/img/cfn/11307S8EdLg-2Gfsl0Kynql7mQubRghFaMDtUv2_npZoZGcUDVZgUZwkCK0qREUba_hLdDcCgkMZa7Maob6xNQOiRbo57Igf.jpg",
      picturefooter:
        "https://cdn.akamai.steamstatic.com/steam/apps/386360/ss_40c090c787cb377117dee7d1ed8f6ca1d9b8d696.1920x1080.jpg?t=1686847405",
      synopsis:
        "SMITE is a free-to-play multiplayer online battle arena (MOBA) game where players take on the roles of mythological gods and goddesses from various pantheons. In intense team-based matches, players battle against each other in objective-based gameplay, aiming to destroy the opposing team's Titan. The game combines elements of strategy, skill-based combat, and mythological lore as players engage in epic clashes inspired by ancient myths.",
      about:
        "SMITE was developed and published by Hi-Rez Studios. It was released on March 25, 2014, for PC, and later expanded to other platforms, including consoles and mobile devices. The game has received regular updates, introducing new gods, maps, game modes, and cosmetic items to enhance the gameplay experience for its growing player community.",
      forgamer:
        "SMITE is for gamers who enjoy competitive multiplayer experiences, strategic gameplay, and a diverse roster of mythological characters. It appeals to players who appreciate team-based coordination, skill-based combat, and the depth of mastering different gods' abilities and playstyles. The game caters to those who enjoy the thrill of intense battles and the ongoing challenge of improving their skills in a highly competitive environment.",
      notfor:
        "SMITE may not be suitable for gamers who do not enjoy team-based multiplayer games or the MOBA genre. It may not appeal to players who prefer solo gameplay experiences or those who are not interested in the mythology-inspired setting. Additionally, individuals who are not fond of ongoing updates and patches, or who are not willing to invest time in learning and mastering the abilities and strategies of multiple characters, may not find SMITE engaging.",
    });

    const gamePhantasyStarOnline2 = await createNewGame({
      title: "Phantasy Star Online 2",
      platform: "Action, MOBA",
      genre: "MMO",
      msrp: "Free",
      score: "3",
      ourreview: "BEAUTIFUL JRPG and MMO however the servers are starting to empty.",
      studio: "Hi-Rez Studios",
      ourscore: "2",
      picturecard:
        "https://assets-prd.ignimgs.com/2021/06/23/pso-2-new-genesis-button-fin-1624434516456.jpg",
      pictureheader:
        "https://mmoculture.com/wp-content/uploads/2021/04/PSO2-NG-image.png",
      picturebody:
        "https://gameranx.com/wp-content/uploads/2021/03/Phantasy-Star-Online-2-New-Genesis.jpg",
      picturefooter:
        "https://variety.com/wp-content/uploads/2019/06/phantasy-star-online-2.jpg",
      synopsis:
        "Phantasy Star Online 2 is a free-to-play online action role-playing game where players become members of ARKS, an interstellar organization tasked with protecting the universe from various threats. Players create their own customizable character and embark on quests across different planets, battling enemies and uncovering the mysteries of the universe. The game features a blend of sci-fi and fantasy elements, with a focus on cooperative gameplay and character progression.",
      about:
        "Phantasy Star Online 2 was developed and published by Sega. It was initially released in Japan in 2012 and later expanded to other regions, including North America, Europe, and Southeast Asia, with localized versions. The game has received regular content updates, expansions, and collaborations, offering players new quests, items, and features to enhance their gameplay experience.",
      forgamer:
        "Phantasy Star Online 2 is for gamers who enjoy immersive online multiplayer experiences, action-packed combat, and character customization. It appeals to players who appreciate cooperative gameplay and teaming up with other players to tackle challenging quests and bosses. The game caters to those who enjoy a mix of sci-fi and fantasy themes, with a focus on character progression and a vibrant community.",
      notfor:
        "Phantasy Star Online 2 may not be suitable for gamers who prefer single-player experiences or who are not interested in online multiplayer gameplay. It may not appeal to players who are not fond of action-oriented combat or those who prefer highly narrative-driven games. Additionally, individuals who are not willing to invest time in character customization and grinding for loot and experience may not find Phantasy Star Online 2 engaging.",
    });

    const gameDisneyDreamlightValley = await createNewGame({
      title: "Disney Dreamlight Valley",
      platform: "PC, XBOX ONE, PS5",
      genre: "Adventure",
      msrp: "$29.99",
      score: "5",
      ourreview: "SO MUCH FUUUUUUUUUUUN!",
      studio: "Disney",
      ourscore: "5",
      picturecard:
        "https://cdn1.epicgames.com/offer/7e2ec8a47b8d41528eb6dd2efd2b1abc/StandardTall_1200x1600-7cb2cda8741f9b56a4c1cbb3e7dc9b3e",
      pictureheader:
        "https://i5.walmartimages.com/asr/301f3dd9-2c82-4460-bf93-7ad69a4b0194.9f7b4d4b4444355993ec58c9160a7de2.jpeg",
      picturebody:
        "https://www.digitaltrends.com/wp-content/uploads/2022/06/Disney-Dreamlight-Valley.jpg?p=1",
      picturefooter:
        "https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/f43199e62e2f36e2206b4259b7088b5a.jpg",
      synopsis:
        "Disney Dreamlight Valley is a hybrid between a life-sim and an adventure game rich with quests, exploration, and engaging activities featuring Disney and Pixar friends, both old and new.",
      about:
        "Once an idyllic land, Dreamlight Valley was a place where Disney and Pixar characters lived in harmony -- until the Forgetting. Night Thorns grew across the land and severed the wonderful memories tied to this magical place. With nowhere else to go, the hopeless inhabitants of Dreamlight Valley retreated behind locked doors in the Dream Castle. Now it's up to you to discover the stories of this world and bring the magic back to Dreamlight Valley!",
      forgamer:
        "Disney Dreamlight Valley is now available in Early Access for players who purchase a Founders Pack Edition or have an Xbox Game Pass membership ahead of the game's free-to-play launch in 2023.",
      notfor:
        "Players who cannot brave the deepest caverns or who cannot take on challenges from iconic Disney heroes and villains -- who knows who, or what, you might discover. If you don't like Disney, you may not appreciate this game.",
    });

    const gameCrusaderKings = await createNewGame({
      title: "Crusader Kings III",
      platform: "PC, PS5",
      genre: "Strategy",
      msrp: "$49.99",
      score: "3",
      ourreview: "Pretty good with excellent story lines! Conquer your kingdom, kill your way to the top.",
      studio: "Paradox Interactive",
      ourscore: "4",
      picturecard:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2LiOlQ-rwdLBEc6h8tOfi7Y2EKhHlrdgb4AFwIQr6pxyokqYjr_CRSuim-wxqD24RVmA&usqp=CAU",
      pictureheader:
        "https://news.xbox.com/en-us/wp-content/uploads/sites/2/2020/09/ms_store_image.jpg",
      picturebody:
        "https://www.wingamestore.com/images_screenshots/crusader-kings-iii-92364.jpg",
      picturefooter:
        "https://images.gamewatcherstatic.com/image/file/8/80/106118/Crusader-Kings-3-2.jpg",
      synopsis:
        "Crusader Kings III is a grand strategy game set in the medieval period, where players take control of a dynasty and guide it through generations. The game focuses on managing relationships, politics, and warfare within a dynamic and ever-changing feudal society. Players can shape their dynasty's legacy through strategic decisions, alliances, marriages, and even plotting assassinations.",
      about:
        "Crusader Kings III was developed by Paradox Development Studio and published by Paradox Interactive. It was released on September 1, 2020, as a successor to Crusader Kings II. The game received critical acclaim for its depth, immersive gameplay, and improved mechanics, and it continues to receive updates and expansions to further enhance the player experience.",
      forgamer:
        "Crusader Kings III is for gamers who enjoy deep and complex strategy games, particularly those with an interest in medieval history and political intrigue. It appeals to players who appreciate the challenge of managing a dynasty, making strategic decisions, and navigating complex relationships. The game is also suitable for those who enjoy long-term planning, emergent storytelling, and a sandbox-style experience.",
      notfor:
        "Crusader Kings III may not be suitable for gamers who prefer fast-paced action or immediate gratification, as it is a slow-paced and intricate strategy game. It may not appeal to players who prefer linear narratives or games with a clear end goal, as Crusader Kings III offers an open-ended and sandbox-style experience. Additionally, individuals who are not interested in managing complex systems, engaging in diplomatic maneuvering, or learning intricate mechanics may find the game overwhelming.",
    });

    const gameNioh2 = await createNewGame({
      title: "Nioh 2",
      platform: "PC, PS5, XBOX",
      genre: "RPG",
      msrp: "$29.99",
      score: "3",
      ourreview:
        "Almost more frustrating than the first. Yokai infest the land and our protagonist mnust defend it!!",
      studio: "KOEI TECMO Games Co Ltd",
      ourscore: "3",
      picturecard:
        "https://upload.wikimedia.org/wikipedia/en/9/91/Nioh_2_cover_art.jpg",
      pictureheader:
        "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2020/05/Nioh-Site.jpg",
      picturebody:
        "https://i.pcmag.com/imagery/reviews/05SKmaAQwo05XFGmDuZ0TL9-1.fit_scale.size_760x427.v1613491811.jpg",
      picturefooter:
        "https://i.pcmag.com/imagery/reviews/05xjsqoskHAv8bQiV1qEWsc-2..v1569469945.jpg",
      synopsis:
        "Nioh 2 is an action role-playing game set in a fictionalized version of feudal Japan. Players assume the role of a half-human, half-Yokai warrior known as a 'Shiftling,' embarking on a quest to uncover their origins and navigate a war-ravaged land. The game combines intense combat, challenging encounters with supernatural creatures, and a deep storyline rooted in Japanese mythology.",
      about:
        "Nioh 2 was developed by Team Ninja and published by Koei Tecmo. It was released on March 13, 2020, as a sequel to the critically acclaimed Nioh. The game builds upon the foundation of its predecessor, offering refined gameplay mechanics, expanded customization options, and a new storyline that delves deeper into the Yokai-infested world.",
      forgamer:
        "Nioh 2 is for gamers who enjoy challenging and skill-based action games, particularly those with an interest in Japanese history, mythology, and samurai culture. It appeals to players who appreciate precise combat mechanics, strategic decision-making, and a high level of difficulty. The game caters to those who enjoy mastering complex weapon systems, exploring intricate levels, and overcoming formidable boss battles.",
      notfor:
        "Nioh 2 may not be suitable for gamers who prefer casual or easy-going gameplay experiences, as it is known for its high level of difficulty and demanding combat encounters. It may not appeal to players who are not fond of learning complex gameplay mechanics or who get easily frustrated by repeated failures. Additionally, individuals who are not interested in Japanese culture, history, or mythology may find the game's setting and themes less engaging.",
    });

    const gameF123 = await createNewGame({
      title: "F123",
      platform: "PC, PS5, XBOX",
      genre: "Racing",
      msrp: "$69.99",
      score: "5",
      ourreview: "Formula 1 racing sim at its best! If you love realistic racing, this is the game for you!",
      studio: "Electronic Arts",
      ourscore: "5",
      picturecard:
        "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/F1_23_cover_art.jpg/220px-F1_23_cover_art.jpg",
      pictureheader:
        "https://media.contentapi.ea.com/content/dam/ea/f1/f1-23/common/featured-image/f123-featured-image-16x9.jpg.adapt.crop191x100.1200w.jpg",
      picturebody:
        "https://cdn.racinggames.gg/images/ncavvykf/racinggames/8c8b40cd7eb4a7b89b1647f338d924300ce940dd-1280x720.jpg?rect=0,0,1279,720&w=700&h=394&dpr=2",
      picturefooter:
        "https://media.contentapi.ea.com/content/dam/ea/f1/f1-23/common/features-page/f123-featurespage-feature-05-16x9.jpg.adapt.crop16x9.652w.jpg",
      synopsis:
        "Be the last to brake in EA SPORTS™ F1® 23, the official videogame of the 2023 FIA Formula One World Championship™, featuring all the updated 2023 cars with the official F1® lineup of your favorite 20 drivers and 10 teams.",
      about:
        "F1® World is your hub for a variety of fresh content inspired by the real F1® season calendar. Level up all season with a new progression system: Complete challenges, compete for rewards, earn upgrades, and snag true-to-life F1® livery, suit, and helmet drops.",
      forgamer:
        "F1 23 is for racing enthusiasts and fans of Formula 1. It caters to gamers who enjoy realistic racing simulations, strategic decision-making, and competitive gameplay. It offers an immersive experience that allows players to take control of their favorite Formula 1 teams and drivers, replicating the excitement and challenges of the real-world sport.",
      notfor:
        "This game may not be for gamers who do not have an interest in motorsports or Formula 1 specifically. It may not appeal to those seeking fast-paced action or arcade-style racing games, as it focuses more on realistic simulation and strategic racing. Additionally, individuals who prefer genres other than sports or racing, or those who are not interested in the technical aspects of Formula 1 racing, may find the game less engaging.",
    });

    const gameMadden24 = await createNewGame({
      title: "Madden NFL 24",
      platform: "PC, PS5, XBOX",
      genre: "Sports",
      msrp: "$69.99",
      score: "5",
      ourreview:
        "WOW, another football game that accounts for such a large percentage of EA's annual revenue....",
      studio: "Electronic Arts",
      ourscore: "4",
      picturecard:
        "https://hiphopwired.com/wp-content/uploads/sites/43/2023/06/16862357871586.jpg?strip=all&quality=85",
      pictureheader:
        "https://cdn1.epicgames.com/offer/0460f46401ae4bdcadbc931d30028015/EGS_MaddenNFL24_Tiburon_S1_2560x1440-e3e021bbdd6feffd2318f35fd3e2dd69",
      picturebody:
        "https://www.videogameschronicle.com/files/2023/06/madden-nfl-24-a.jpg",
      picturefooter:
        "https://videogames.si.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cg_faces:center%2Cq_auto:good%2Cw_768/MTk4ODI0MDI4NjQxNjk5MTc5/madden-nfl-24-1.png",
      synopsis:
        "Lead your Franchise into history with new mini games, streamlined relocation, more trade slots, and contract restructuring. Experience these updates to Franchise mode on PlayStation®5, Xbox Series X|S, and PC.",
      about:
        "Achieve greatness in your NFL career with your customizable avatar and progress from draft pick to 99 OVR as you build your legacy across a variety of positions. Superstar modes available on PS5™, Xbox Series X|S, and PC.",
      forgamer:
        "This game is primarily for gamers who are fans of American football and enjoy immersive sports simulations. It caters to players who appreciate strategic gameplay, team management, and competitive multiplayer experiences. It offers a realistic representation of the sport, allowing players to control their favorite NFL teams and players, engage in strategic playcalling, and compete against others in online or offline modes.",
      notfor:
        "Madden NFL 24 may not be for gamers who do not have an interest in American football or sports simulations. It may not appeal to those seeking fast-paced action or arcade-style gameplay, as it focuses on realistic football mechanics and strategic decision-making. Additionally, individuals who prefer genres other than sports or those who are not familiar with the rules and intricacies of American football may find the game less engaging.",
    });

    const gameGreenHell = await createNewGame({
      title: "Green Hell",
      platform: "PC, PS5, XBOX",
      genre: "Horror",
      msrp: "$24.99",
      score: "4",
      ourreview:
        "Being stalked by a jaguar and building a shelter, all whilst avoiding malaria. Cool horror sim, first person view.",
      studio: "Creepy Jar",
      ourscore: "5",
      picturecard:
        "https://image.api.playstation.com/vulcan/img/rnd/202106/0421/NALt5B7gKG5k3bOzvvE8nPEu.png",
      pictureheader:
        "https://m.media-amazon.com/images/M/MV5BMzUyNjA0MzktMjAzYi00NjY0LTllMzEtYzUzMGVlOWFmZjQ1XkEyXkFqcGdeQXVyNzQwMzAwNTI@._V1_.jpg",
      picturebody:
        "https://image.winudf.com/v2/image1/Y29tLmdyZWVuLmhlbGxzdXJ2aXZhbGdhbWVndWlfc2NyZWVuXzJfMTU5NDM1NTA1MV8wMTk/screen-2.webp?fakeurl=1&type=.webp",
      picturefooter:
        "https://www.uploadvr.com/content/images/2021/05/Jaguar-attack-GHVR.png",
      synopsis:
        "Green Hell is a survival game set in the Amazon rainforest, where players assume the role of a stranded explorer trying to survive and find their way back to civilization. As they navigate the unforgiving environment, players must manage their physical and mental well-being, gather resources, craft tools, and unravel the mysteries of the jungle while facing threats from wildlife and the challenges of isolation.",
      about:
        "Green Hell was developed and published by Creepy Jar, an independent game development studio. The game entered early access in 2018 and was fully released on September 5, 2019. Since its release, it has received positive reviews for its immersive survival mechanics, realistic portrayal of the Amazon rainforest, and engaging gameplay.",
      forgamer:
        "Green Hell is for gamers who enjoy challenging survival experiences, particularly those with an interest in realistic wilderness settings and immersive gameplay. It appeals to players who appreciate resource management, exploration, and overcoming the hardships of survival. The game caters to those who enjoy a sense of realism, attention to detail, and a deep atmospheric experience.",
      notfor:
        "Green Hell may not be suitable for gamers who prefer fast-paced action or games with a clear narrative structure, as it focuses more on the immersive survival aspects rather than story-driven gameplay. It may not appeal to players who are not fond of managing complex systems, gathering resources, and engaging in repetitive tasks. Additionally, individuals who are not comfortable with the challenging and sometimes harsh survival mechanics may find the game frustrating or overwhelming.",
    });

    const gameMarioKart8 = await createNewGame({
      title: "Mario Kart 8 Deluxe",
      platform: "Nintendo Switch",
      genre: "Racing",
      msrp: "$59.99",
      score: "5",
      ourreview: "Classic Mario Kart with modern graphics!",
      studio: "Nintendo",
      ourscore: "5",
      picturecard:
        "https://assets1.ignimgs.com/2019/05/31/mario-kart-8-deluxe---button-1559265583166.jpg",
      pictureheader:
        "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000153/de697f487a36d802dd9a5ff0341f717c8486221f2f1219b675af37aca63bc453",
      picturebody:
        "https://www.lifewire.com/thmb/xSyhH4taw10JBkcF-fghBCWBfNQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2LW4154603MarioKartDeluxe_hero-182b68c9551043908e7d54400202730d.jpg",
      picturefooter:
        "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5723/5723304cv13d.jpg",
      synopsis:
        "Mario Kart 8 Deluxe is a racing game featuring characters from the Mario franchise. The game follows Mario and his friends as they compete in kart races across various colorful and whimsical tracks. Players can utilize power-ups, perform stunts, and employ strategic racing tactics to secure victory in both single-player and multiplayer modes.",
      about:
        "Mario Kart 8 Deluxe was developed and published by Nintendo, specifically the Nintendo Entertainment Planning & Development division. It is an enhanced version of the original Mario Kart 8 game released for the Wii U console in 2014. Mario Kart 8 Deluxe was released for the Nintendo Switch console on April 28, 2017, and it includes all the content from the original game along with additional tracks, characters, and features.",
      forgamer:
        "Mario Kart 8 Deluxe is for gamers who enjoy fun and accessible racing experiences, particularly those who appreciate multiplayer gameplay and friendly competition. It appeals to players of all ages and skill levels, offering a mix of simple controls and strategic gameplay elements. The game is suitable for both casual gamers looking for a lighthearted racing experience and competitive gamers seeking to hone their racing skills and compete with friends or online opponents.",
      notfor:
        "Mario Kart 8 Deluxe may not be suitable for gamers who prefer realistic or simulation-style racing games, as it prioritizes fun and imaginative gameplay over realism. It may not appeal to players who are solely interested in complex narratives or deep character development, as the focus of the game is primarily on racing and multiplayer fun. Additionally, individuals who do not enjoy arcade-style gameplay mechanics or prefer genres other than racing may find the game less engaging.",
    });

    const gamePikmin4 = await createNewGame({
      title: "Pikmin 4",
      platform: "Nintendo Switch",
      genre: "RPG",
      msrp: "$59.99",
      score: "4",
      ourreview: "Long awaited sequel! Cute graphics and even cuter voice acting.",
      studio: "Nintendo",
      ourscore: "4",
      picturecard:
        "https://m.media-amazon.com/images/M/MV5BMzY2NDI1OGQtZjVlOC00ODk4LTkzMDUtOGYxNjVhYjRlOWVlXkEyXkFqcGdeQXVyODgwNjY1NjY@._V1_.jpg",
      pictureheader:
        "https://staticc.sportskeeda.com/editor/2023/06/d79e8-16873678964394-1920.jpg?w=840",
      picturebody:
        "https://media.thenerdstash.com/wp-content/uploads/2022/09/Pikmin-4-Release-1.jpg.webp",
      picturefooter:
        "https://i2-prod.mirror.co.uk/gaming/article30342116.ece/ALTERNATES/n615/0_Pikmin-4-shuttle.jpg",
      synopsis:
        "Pikmin 4 is in the series of unique and charming real-time strategy games developed by Nintendo. Players take on the role of a space explorer who befriends and commands colorful plant-like creatures called Pikmin. Together, they navigate lush environments, solve puzzles, and battle hostile creatures in order to collect resources and complete various missions to save their home planet. With its innovative gameplay mechanics, adorable characters, and immersive worlds, the Pikmin franchise offers a delightful and strategic gaming experience for players of all ages.",
      about:
        "Pikmin is a first-party Nintendo franchise, so dont expect to play the new installment on PlayStation, Xbox, or any other platforms. For now, Pikmin 4 is planned for Nintendo Switch, but it might also come to whatever the companys next console is, as well — similar to the way Pikmin 3 launched on Wii U and then later came to Nintendo Switch.",
      forgamer:
        "Pikmin is a game that can be enjoyed by a variety of gamers. It appeals to those who appreciate strategic and puzzle-solving gameplay, as the game requires planning and coordination to efficiently command and utilize different types of Pikmin. It also appeals to gamers who enjoy exploration and discovery, as the game features expansive and immersive environments to explore. Additionally, Pikmin's charming art style, endearing characters, and whimsical atmosphere make it particularly enjoyable for players who appreciate unique and imaginative game worlds.",
      notfor:
        "Pikmin 4 may not be for gamers who prefer fast-paced action, intense combat, or games with a high level of difficulty. While there are elements of combat in Pikmin, it is more focused on strategy and puzzle-solving rather than intense action. Additionally, gamers who do not enjoy slower-paced or methodical gameplay may find Pikmin less engaging. Lastly, those who prefer realistic or mature-themed games may not be as drawn to the whimsical and lighthearted nature of the Pikmin series.",
    });

    const gameLegendOfZeldaTOK = await createNewGame({
      title: "The Legend of Zelda: Tears of the Kingdom",
      platform: "Nintendo Switch",
      genre: "RPG",
      msrp: "$59.99",
      score: "4",
      ourreview: "Really cool graphics and really fun to play!",
      studio: "Nintendo",
      ourscore: "5",
      picturecard:
        "https://cdn.wccftech.com/wp-content/uploads/2023/05/WCCFzeldatearsofthekingdom8.jpg",
      pictureheader:
        "https://zelda.com/tears-of-the-kingdom/images/share-fb.jpg",
      picturebody:
        "https://media.wired.com/photos/645d15509a01d944fee35de1/master/w_2560%2Cc_limit/Zelda-Tears-Of-The-Kingdom-Culture-TotK_3rd_54.jpg",
      picturefooter:
        "https://gamingtrend.com/wp-content/uploads/2022/09/zeldatears3-e1663084674100.jpg",
      synopsis:
        "The Legend of Zelda: Tears of the Kingdom[b] is a 2023 action-adventure game developed and published by Nintendo for the Nintendo Switch. The sequel to The Legend of Zelda: Breath of the Wild (2017), Tears of the Kingdom retains aspects including the open world of Hyrule, which has been expanded to allow for more vertical exploration. The player controls Link, who must help Princess Zelda to stop Ganondorf from destroying Hyrule.",
      about:
        "After defeating Calamity Ganon, Link and Zelda investigate a mysterious illness seeping from beneath Hyrule Castle. They uncover the awakening of Ganondorf and his corruptive powers, leading to the shattering of the Master Sword and the floating of Hyrule Castle. Link embarks on a journey to restore the Master Sword, rescue Zelda, and face Ganondorf's forces with the aid of the sages' successors and Zelda's dragon form.",
      forgamer:
        "This game is likely to appeal to fans of action-adventure and role-playing games, especially those who enjoy the Legend of Zelda series. It caters to gamers who appreciate exploration, puzzle-solving, and immersive storytelling within a fantasy world. Players who enjoy uncovering the lore and unraveling the secrets of a vast and interconnected narrative will find this plot engaging.",
      notfor:
        "This game may not be suitable for gamers who prefer fast-paced, competitive gameplay or those who are not drawn to exploration and puzzle-solving. It may not appeal to players who prefer linear narratives or those who are not interested in fantasy settings. Additionally, gamers who do not enjoy investing time in a lengthy and immersive experience or those who prefer more action-oriented gameplay mechanics might not find this game as engaging.",
    });

    const gameDontStarveTogether2 = await createNewGame({
      title: "Don't Starve Together 2",
      platform: "Nintendo Switch, PC, PS5, XBOX",
      genre: "Survival",
      msrp: "$14.99",
      score: "4",
      ourreview: "Really cool graphics and really fun to play! The game has a learning curve, but it is worth the wait!",
      studio: "Klei Entertainment",
      ourscore: "4",
      picturecard:
        "https://assets-prd.ignimgs.com/2021/12/16/dont-starve-together-button-fin-1639685166951.jpg",
      pictureheader:
        "https://cdn-ext.fanatical.com/production/product/1280x720/16bea87c-5616-4452-848b-5b10bc851206.jpeg",
      picturebody:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1230830/ss_5679559e5258b81437b212a48837a726b52e4155.1920x1080.jpg?t=1620697065",
      picturefooter:
        "https://img.g2a.com/700x394/1x1x0/dont-starve-vs-dont-starve-together/7fd4ff9866f2400b98cf21f6",
      synopsis:
        "Don't Starve is an action-adventure game with a randomly generated open world and elements of survival and roguelike gameplay. Combat is handled by pointing and clicking with the mouse, or by using 'force attack' (ctrl+f), while other activities are controlled by the keyboard, or using the inbuilt gamepad support to play using a controller, giving it a console-like gameplay feel. The goal is to survive as long as possible, and a count of the number of days the player has survived is shown onscreen, as well as the season. The game keeps few records of player progress besides the total number of experience points and the playable characters unlocked. Wilson is the default playable character, unlocked upon purchase of the game, but the next character, Willow, can be unlocked with 160 experience points. Woodie, the last character unlockable with experience, requires the game's limit of 1,600. Each character has a perk that is specific to them, as well as a disadvantage. The player earns 20 experience points each in-game day and receives them after dying. Death is permanent, barring the use of several rare or expensive items like the Meat Effigy, Touch-Stone, and Life-Giving Amulet.",
      about:
        "Don't Starve is a survival video game developed by the Canadian indie video game developer Klei Entertainment.",
      forgamer:
        "The game Don't Starve is likely to appeal to gamers who enjoy survival and exploration experiences, as well as those who appreciate challenging gameplay and strategic decision-making. It is suitable for players who enjoy a dark and atmospheric art style, as well as those who appreciate open-ended gameplay and the freedom to experiment and discover new mechanics. Additionally, gamers who enjoy resource management, crafting, and a sense of progression will likely find Don't Starve enjoyable.",
      notfor:
        "The game Don't Starve may not be suitable for gamers who prefer fast-paced action or heavily story-driven experiences, as it focuses more on survival mechanics and exploration rather than narrative-driven gameplay. It may not be ideal for players who prefer games with clear objectives or linear progression, as Don't Starve offers a more open-ended and sandbox-style experience. Additionally, gamers who are not fond of challenging gameplay or games that require patience and trial-and-error may not find Don't Starve enjoyable.",
    });

    const gameEldenRing = await createNewGame({
      title: "Elden Ring",
      platform: "PC, PS5, XBOX",
      genre: "Action",
      msrp: "$59.99",
      score: "5",
      ourreview: "One of the GOATS! If you love George R. R. Martin, play this game!",
      studio: "FromSoftware Inc",
      ourscore: "5",
      picturecard: "https://i.redd.it/sqozuuuqce781.jpg",
      pictureheader: "https://i.ytimg.com/vi/JldMvQMO_5U/maxresdefault.jpg",
      picturebody:
        "https://assets-prd.ignimgs.com/2021/12/20/elden-ring-1640039956608.png",
      picturefooter:
        "https://static.bandainamcoent.eu/high/elden-ring/elden-ring/03-news/Elden_Ring_Tip1.png",
      synopsis:
        "Elden Ring is a 2022 action role-playing game developed by FromSoftware. It was directed by Hidetaka Miyazaki with worldbuilding provided by fantasy writer George R. R. Martin. It was released for PlayStation 4, PlayStation 5, Windows, Xbox One, and Xbox Series X/S on February 25 by FromSoftware in Japan and Bandai Namco Entertainment internationally. Players control a customizable player character who is on a quest to repair the Elden Ring and become the new Elden Lord.",
      about:
        "During planning, FromSoftware wanted to create an open-world game with gameplay similar to Dark Souls; the company wanted Elden Ring to act as an evolution of the self-titled debut of the series. Miyazaki admired the work of Martin, whose contributions he hoped would produce a more accessible narrative than those of the company's earlier games. Martin was given unrestricted freedom to design the backstory while Miyazaki was lead writer for the in-game narrative. The developers concentrated on environmental scale, roleplaying, and the story; the scale required the construction of several structures inside the open world.",
      forgamer:
        "Elden Ring received critical acclaim for its open-world, gameplay systems, and setting, with some criticism for its technical performance. It won multiple Game of the Year awards and sold over 20 million copies in a year. An expansion, Shadow of the Erdtree, was announced in February 2023.",
      notfor:
        "Throughout the game, players encounter non-player characters (NPCs) and enemies, including demigods who rule each main area and serve as the game's main bosses. Elden Ring also includes hidden dungeons, catacombs, tunnels, and caves where players can fight bosses and gather helpful items.",
    });

    const gameDestiny2 = await createNewGame({
      title: "Destiny 2",
      platform: "PC, XBOX",
      genre: "FPS",
      msrp: "$59.99",
      score: "5",
      ourreview:
        "Fans of Halo and Destiny will drool over the ever expanding, immersive world of Destiny 2.",
      studio: "Bungie",
      ourscore: "5",
      picturecard:
        "https://news.xbox.com/en-us/wp-content/uploads/sites/2/2020/06/Destiny2_Hero_Art.jpg",
      pictureheader:
        "https://cdn.geekwire.com/wp-content/uploads/2017/09/HORIZ_RGB_CL_A3.jpg",
      picturebody:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/ss_7fcc82f468fcf8278c7ffa95cebf949bfc6845fc.1920x1080.jpg?t=1684966156",
      picturefooter:
        "https://imageio.forbes.com/specials-images/imageserve/63c568e2bb8fbadbe4c92cf4/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds",
      synopsis:
        "Players assume the role of a Guardian, protectors of Earth's last safe city as they wield a power called Light to protect what's left of humanity from different alien races and combat the looming threat of the Darkness.",
      about:
        "Destiny 2 is a free-to-play online first-person shooter video game developed by Bungie. It was originally released as a pay to play game in 2017 for PlayStation 4, Xbox One, and Windows.",
      forgamer:
        "Destiny 2 is for fans of Bungie games, FPS games, and people who love playing online with their friends! Join a fireteam and fight your way across the stars.",
      notfor:
        "Destiny 2 is not for gamers who do not enjoy FPS games, fast competetive online play, or people that only want to play solo.",
    });

    const gameCOD = await createNewGame({
      title: "Call of Duty Modern Warfare II",
      platform: "PC, PS5, XBOX",
      genre: "FPS",
      msrp: "$39.99",
      score: "4",
      ourreview:
        "The game delivers an intense and cinematic gaming experience that pushes the boundaries of first-person shooters. With its gripping campaign, explosive multiplayer modes, and stunning visuals, the game keeps players on the edge of their seats, providing a thrilling and immersive warzone that will leave fans of the franchise wanting more.",
      studio: "Activision",
      ourscore: "5",
      picturecard:
        "https://whatifgaming.com/wp-content/uploads/2022/05/Call-of-Duty-Modern-Warfare-2-scaled.jpg",
      pictureheader:
        "https://assets.xboxservices.com/assets/a0/02/a0029671-98a2-4955-a9e7-ef32cd0eb544.jpg?n=CoD-MW-II_GLP-Page-Hero-Poster-1084_1920x1080.jpg",
      picturebody:
        "https://cdn.oneesports.gg/cdn-data/2022/10/COD_MW2_Feature.webp",
      picturefooter:
        "https://www.gameinformer.com/sites/default/files/styles/full/public/2022/06/08/87c3ff93/mw2header.jpg",
      synopsis:
        "An immersive first-person shooter that takes players on a gripping global campaign, following the intense and gritty conflicts of a modern war. With a combination of intense combat scenarios and a compelling narrative, players must navigate through various missions as they confront the complex realities and moral choices of modern warfare.",
      about:
        "Call of Duty: Modern Warfare II is a 2022 first-person shooter video game developed by Infinity Ward and published by Activision. It is a sequel to the 2019 reboot, and serves as the nineteenth installment in the overall Call of Duty series.",
      forgamer:
        "The game will appeal to gamers who enjoy high-octane, fast-paced first-person shooters with a focus on intense action, thrilling multiplayer matches, and cinematic set pieces. It caters to players who appreciate the adrenaline rush of engaging in intense firefights, mastering precise shooting mechanics, and participating in competitive online multiplayer modes.",
      notfor:
        "Call of Duty: Modern Warfare II may not be suitable for gamers who are sensitive to realistic violence or prefer games with slower-paced gameplay and intricate storytelling. It is a fast-paced, action-packed shooter that primarily caters to players who enjoy intense and adrenaline-fueled combat experiences rather than those seeking more relaxed or strategic gameplay.",
    });

    const gameResidentEvilVillage = await createNewGame({
      title: "Resident Evil: Village",
      platform: "PC, PS5, XBOX",
      genre: "Horror",
      msrp: "$39.99",
      score: "5",
      ourreview:
        "Terrifying and exhilirating, the game will leave you playing for hours and hours.... while your soul is slowly consumed by the Village.",
      studio: "CAPCOM",
      ourscore: "5",
      picturecard:
        "https://image.api.playstation.com/vulcan/ap/rnd/202101/0812/FkzwjnJknkrFlozkTdeQBMub.png",
      pictureheader: "https://img.youtube.com/vi/26tay8lMZW4/maxresdefault.jpg",
      picturebody:
        "https://techraptor.net/sites/default/files/styles/image_header/public/2021-05/RE_Village_Apr_2021_Screens_03.jpg?itok=4LD5uDfx",
      picturefooter:
        "https://www.gamespot.com/a/uploads/original/1581/15811374/3820360-re_village_mercenaries_2.jpg",
      synopsis:
        "Resident Evil Village may be remembered for its alluring antagonist, the tall lady, but this first-person survival game soon lets loose the scares.",
      about:
        "Resident Evil Village is a 2021 survival horror game developed and published by Capcom. It is the sequel to Resident Evil 7: Biohazard.",
      forgamer:
        "Players control Ethan Winters, who searches for his kidnapped daughter in a village filled with mutant creatures. Fans of RPG and Horror alike will love the jump scares and creepy narrative.",
      notfor:
        "If players cannot stomach body horror and dismemberment, this may not be the right Resident Evil, or frankly, game for you.",
    });

    const gamePhasmophobia = await createNewGame({
      title: "Phasmophobia",
      platform: "PC, PS5, XBOX",
      genre: "Horror",
      msrp: "$29.99",
      score: "5",
      ourreview:
        "Phasmophobia offers VR support, however those with motion sickness issues may have trouble with the movement mechanisms in-game. Otherwise, mouse and keyboard and controller support offer amazing gameplay and a great unfolding story.",
      studio: "Kinetic Games",
      ourscore: "5",
      picturecard:
        "https://m.media-amazon.com/images/M/MV5BNzQwZmU2MWQtODM2Ni00YTZjLWJiNzQtZTA0MDBiMzk1YjMzXkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_.jpg",
      pictureheader:
        "https://prod.assets.earlygamecdn.com/images/phasmophobia-titelbild.jpg?x=0.5&y=0.5",
      picturebody:
        "https://d1fs8ljxwyzba6.cloudfront.net/assets/article/2022/04/12/games-like-phasmophobia-featured_feature.jpg",
      picturefooter:
        "https://static1.srcdn.com/wordpress/wp-content/uploads/2020/10/phasmophobia-ghost.jpg",
      synopsis:
        "Phasmophobia is a paranormal horror game based primarily on the popular hobby of ghost hunting! Phasmophobia is a 4-player, online co-op, psychological horror game where you and your team of paranormal investigators will enter haunted locations and solve the mysteries.",
      about:
        "Developed and published by British indie game studio Kinetic Games, features VR support. The game became available in early access through Steam for Microsoft Windows with virtual reality support in September 2020.",
      forgamer:
        "Fans of horror and ghost hunting will love this creepy game where ghost hunting is your career. With VR support, players will enjoy various play styles.",
      notfor:
        "Gamers not fans of jump-scares will not enjoy this game. It also utilizes puzzles to progress the story, so gamers who are frustrated easily will not enjoy the game.",
    });

    const gameWOW = await createNewGame({
      title: "World of Warcraft",
      platform: "PC",
      genre: "MMO",
      msrp: "$59.99",
      score: "4",
      ourreview:
        "Basically the original MMO king of the globe. Servers remain full and player retention is one of the highest in the world.",
      studio: "Blizzard",
      ourscore: "4",
      picturecard:
        "https://m.media-amazon.com/images/M/MV5BNTI4MjBkMmYtNjBkNC00NmZjLWEyN2EtZTc5ZmIwMGIyYjdiXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg",
      pictureheader:
        "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/04/vanilla-world-of-warcraft-beta-screenshots.jpg",
      picturebody:
        "https://media.cnn.com/api/v1/images/stellar/prod/190823120209-02-world-of-warcraft-classic.jpg?q=w_3840,h_2160,x_0,y_0,c_fill",
      picturefooter:
        " https://s3.amazonaws.com/prod-media.gameinformer.com/styles/full/s3/2018/08/18/725c3c6a/WoW_BattleForAzeroth_IslandExpedition_3840x2160.jpg",
      synopsis:
        "World of Warcraft is an iconic massively multiplayer online role-playing game that transports players to the epic fantasy realm of Azeroth, where they can embark on quests, battle mythical creatures, and interact with a vast community of players from around the world. With its immersive world, rich lore, and endless adventures, World of Warcraft offers an unparalleled experience that captivates both longtime fans and newcomers alike.",
      about:
        "Initially released on November 23, 2004, by Blizzard Entertainment. Since then, it has seen several expansions, including The Burning Crusade, Wrath of the Lich King, Cataclysm, Mists of Pandaria, Warlords of Draenor, Legion, Battle for Azeroth, and Shadowlands, each expanding the game's universe and introducing new gameplay features and content.",
      forgamer:
        "Original fans of wow will still enjoy playing the latest expansions, and replaying the older content to gain unique armor sets, pets, mounts, and so much more. WOW appeals to a wide range of gamers, particularly those who enjoy immersive and expansive multiplayer experiences in a richly detailed fantasy world.",
      notfor:
        "WOW may not be suitable for gamers who prefer fast-paced action or competitive gameplay focused on quick reflexes, as it primarily emphasizes exploration, cooperative play, and long-term character progression.",
    });

    const gameGuildWars2 = await createNewGame({
      title: "Guild Wars 2",
      platform: "PC, PS5, XBOX",
      genre: "MMO",
      msrp: "Free",
      score: "4",
      ourreview:
        "Such a dynamic MMO experience that truly leaves the game extremely popular for both long-term and short-term gamers alike.",
      studio: "Arena Net",
      ourscore: "5",
      picturecard:
        "https://images.saymedia-content.com/.image/t_share/MTc0MjIzOTM3MTk3MDU3NTMy/guild-wars-2-a-critical-review-upon-completion.jpg",
      pictureheader:
        "https://eu-images.contentstack.com/v3/assets/blt95b381df7c12c15d/bltf985c0054b1d00d1/63eb790d26ab754785e2339e/Guild_Wars_2.png",
      picturebody:
        "https://cdn.videogamesblogger.com/wp-content/uploads/2011/12/Guild-Wars-2-Screenshot-4.jpg",
      picturefooter:
        "https://d3b4yo2b5lbfy.cloudfront.net/wp-content/uploads/2013/01/b0d4bgw084.jpg",
      synopsis:
        "Guild Wars 2 is a free-to-play, MMO RPG set in the fantasy world of Tyria, the core game follows the re-emergence of Destiny's Edge, a disbanded guild dedicated to fighting Elder Dragons, colossal Lovecraftian-esque entities that have seized control of Tyria in the time since the original Guild Wars (2005), a plot line that was concluded in the latest expansion End of Dragons (2022). A dynamic event system replaces traditional questing, utilizing the ripple effect to allow players to approach quests in different ways as part of a persistent world.",
      about:
        "Guild Wars 2 is the fourth major entry in the Guild Wars series, and claims to be unique in the MMO genre by featuring a storyline that is responsive to player actions, something which is common in single player role-playing games but rarely seen in multiplayer ones.",
      forgamer:
        "Guild Wars 2 is ideal for gamers who appreciate immersive storytelling, dynamic events, and a cooperative gameplay experience in a visually stunning fantasy world, with a focus on player choice and exploration.",
      notfor:
        "This game may not be suitable for those who prefer highly competitive PvP (player versus player) experiences or heavily structured endgame progression with vertical power scaling. GuildWars 2 can also be played either solo or in a group which may or may not appeal to some gamers.",
    });

    const gameHOTS = await createNewGame({
      title: "Heroes of the Storm",
      platform: "PC, XBOX",
      genre: "MOBA",
      msrp: "Free",
      score: "3",
      ourreview:
        "A highly competitive multiplayer online battle arena game that offers strategic depth, diverse champions, and a thriving esports scene, making it a captivating experience for players seeking intense team-based gameplay. Rotating free heroes also keeps the game interesting every session.",
      studio: "Blizzard",
      ourscore: "3",
      picturecard:
        "https://assets-prd.ignimgs.com/2022/01/28/heroes-of-the-storm-button-crop-1643355577739.jpg",
      pictureheader:
        "https://www.trustedreviews.com/wp-content/uploads/sites/54/2015/05/Heroes-of-the-Storm-1.jpg",
      picturebody:
        "https://assets-prd.ignimgs.com/2022/07/09/heroesofthestorm-blogroll-1521503788593-1657388128204.jpg",
      picturefooter:
        "https://cdn.mos.cms.futurecdn.net/f845288d54a86a0e661179381d10c841.jpg",
      synopsis:
        "Heroes of the Storm heroes are characters plucked from across the StarCraft, Warcraft, Diablo, and Overwatch universes and dropped into an all star mash-up; so if you fancy piloting D.Va from Overwatch in a battle against Jaina Proudmoore from World of Warcraft, HoTS is the MOBA for you.",
      about:
        "HOTS is a multiplayer online battle arena (MOBA) game developed and published by Blizzard Entertainment, released on June 2, 2015. It brings together iconic characters from various Blizzard franchises, offering fast-paced team-based gameplay, unique maps, and a dynamic approach to traditional MOBA mechanics, making it a distinctive experience within the genre.",
      forgamer:
        "The game was designed for gamers who enjoy team-based multiplayer experiences, strategic decision-making, and fast-paced action. It appeals to those who appreciate the diverse roster of heroes from different Blizzard franchises and the dynamic gameplay that combines elements of MOBA and teamfight-oriented mechanics.",
      notfor:
        "HOTS may not be suitable for gamers who prefer a more focused and competitive MOBA experience with a strong emphasis on individual skill and mechanical mastery. It may also be less appealing to players who prioritize a deep progression system or a highly structured esports scene, as the game's design leans more towards accessible and team-oriented gameplay rather than a hardcore competitive environment.",
    });

    const gameLOL = await createNewGame({
      title: "League of Legends",
      platform: "PC",
      genre: "MOBA",
      msrp: "Free",
      score: "3",
      ourreview:
        "A highly competitive multiplayer online battle arena game that offers strategic depth, diverse champions, and a thriving esports scene, making it a captivating experience for players seeking intense team-based gameplay. Rotating free heroes also keeps the game interesting every session.",
      studio: "Riot Games",
      ourscore: "4",
      picturecard:
        "https://m.media-amazon.com/images/M/MV5BZDQyYjc0NjQtMWExMC00YTBhLTgzYzYtMzUyY2MxNTNjZjliXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg",
      pictureheader:
        "https://i0.wp.com/highschool.latimes.com/wp-content/uploads/2021/09/league-of-legends.jpeg?fit=1607%2C895&ssl=1",
      picturebody:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1276790/ss_0ac14f00c1a0c98797c7529823fddaedcad13edf.1920x1080.jpg?t=1680125489",
      picturefooter:
        "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2022/11/Games-Like-League-of-Legends-Featured-Image.jpg",
      synopsis:
        "League of Legends follows the traditional MOBA blueprint but certainly is not lacking depth. Players choose the best League of Legends champions from a rapidly expanding roster of over 150 playable characters, upgrade them with optimal item builds, and attempt to outplay your lane opponent.",
      about:
        "League of Legends was developed by Riot Games, released on October 27, 2009. It quickly gained immense popularity, becoming one of the most played and influential esports titles worldwide, with a dedicated player base, a thriving professional competitive scene, and numerous updates and expansions over the years to keep the game fresh and engaging.",
      forgamer:
        "This game is for gamers who enjoy competitive team-based gameplay, strategic decision-making, and tactical coordination. It appeals to those who thrive in fast-paced, skill-driven matches where individual and team performance, map control, and objective-based gameplay are key factors for success.",
      notfor:
        "League may not be suitable for gamers who prefer solo play or those who are easily discouraged by a steep learning curve and the need for continuous skill improvement. Additionally, players who do not enjoy competitive environments or the team-oriented nature of the game may find it less appealing.",
    });

    const gameEternalReturn = await createNewGame({
      title: "Eternal Return",
      platform: "PC, PS5, XBOX",
      genre: "MOBA",
      msrp: "Free",
      score: "3",
      ourreview:
        "Absolutely mind-blowing game that combines elements of battle royale, survival, and MOBA genres flawlessly, offering an unparalleled experience that will keep players hooked for hours on end with its addictive gameplay and stunning visuals.",
      studio: "Nimble Neuron",
      ourscore: "4",
      picturecard: "https://cdkeyprices.com/images/games/5619440/cover.jpg",
      pictureheader:
        "https://m.media-amazon.com/images/M/MV5BYjhlNWYyMTMtOWM2Yy00MGIwLWEyZWEtMDg1MDZiMjFkNGJhXkEyXkFqcGdeQXVyMTIwODcyMzky._V1_.jpg",
      picturebody:
        "https://mmoculture.com/wp-content/uploads/2020/10/Eternal-Return-Black-Survival-screenshot-1.jpg",
      picturefooter:
        "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2021/08/Eternal-Return-Best-Playable-Characters-Ranked.jpg",
      synopsis:
        "Eternal Return is the unique multiplayer online survival arena that combines strategy, mechanics, and aesthetic characters. Choose one of the ever-growing cast of test subjects, take on Lumia Island as one of 18 test subjects - either solo or with a team, and prove your strength, ability, and wit.",
      about:
        "Eternal Return is a free-to-play multiplayer online battle royale game developed and published by Nimble Neuron initially released as an early access title on October 14, 2020, and has since been regularly updated with new content, including characters, items, and gameplay features, as the developers continue to refine and expand the game based on player feedback.",
      forgamer:
        "This game is for gamers who enjoy a unique blend of battle royale, survival, and MOBA elements in a top-down isometric perspective. It appeals to players who appreciate strategic decision-making, character abilities, crafting, and resource management, creating an engaging experience that combines both individual skill and teamwork.",
      notfor:
        "Eternal Return may not be suitable for gamers who prefer fast-paced, twitch-reflex gameplay or those who are not fond of the isometric perspective. Additionally, players who do not enjoy the combination of battle royale and MOBA mechanics or those who prefer a more traditional battle royale experience without the added complexity of character abilities and crafting, may find the game less appealing.",
    });

    const gameForzaMotorsports8 = await createNewGame({
      title: "Forza Motorsport 8",
      platform: "PC, PS5, XBOX",
      genre: "Racing",
      msrp: "$59.99",
      score: "4",
      ourreview:
        "Forza Motorsports is an absolute disaster of a racing game, with horrendous controls, bland graphics, and an incredibly dull selection of cars that will put even the most avid racing fans to sleep.",
      studio: "Xbox Games Studios",
      ourscore: "4",
      picturecard:
        "https://assets-prd.ignimgs.com/2023/06/11/forza-1686512818132.jpg",
      pictureheader:
        "https://editors.dexerto.com/wp-content/uploads/2023/06/11/forza-motorsport-reboot-2023.jpg",
      picturebody:
        "https://assets1.ignimgs.com/thumbs/userUploaded/2022/6/13/forza2-1655055146059.jpg",
      picturefooter:
        "https://www.topgear.com/sites/default/files/2022/06/Forza_Motorsport-XboxGamesShowcase2022-PressKit-10-16x9_WM-76568d3fa79d335b8293%20%281%29.jpg",
      synopsis:
        "Forza Motorsports is an ultimate racing simulator that brings the thrill of high-performance cars to your fingertips.",
      about:
        "Forza Motorsport was first announced at Xbox Showcase in 2020. The Forza Motorsport release date was previously set for 'Spring 2023', but has moved to a late 2023 launch window, with a current release date set for October 10, 2023.",
      forgamer:
        "Forza primarily appeals to gamers who enjoy realistic and immersive racing experiences. Those who appreciate precision driving, attention to detail in car mechanics and physics, and a wide range of customizable options, making it suitable for both casual racing enthusiasts and dedicated motorsport fans, will love it.",
      notfor:
        "Forza Motorsports may not be suitable for gamers who prefer arcade-style racing games with a focus on fast-paced action and less emphasis on realistic driving mechanics. Players who are not particularly interested in cars or motorsports may find the game's attention to detail and simulation aspects less engaging and boring.",
    });

    const gameGranTurismo7 = await createNewGame({
      title: "Gran Turismo 7",
      platform: "PC, PS5, XBOX",
      genre: "Racing",
      msrp: "$59.99",
      score: "4",
      ourreview:
        "Gran Turismo is a Playstation exclusive and is an absolute disappointment of a racing game, with outdated graphics, boring gameplay, and a limited selection of cars that make it feel like a relic from the past, unable to compete with other modern racing titles.",
      studio: "Sony Interactive Entertainment",
      ourscore: "2",
      picturecard:
        "https://image.api.playstation.com/vulcan/ap/rnd/202109/1321/eFGBuaRr21HUpGtsy3biwJip.png",
      pictureheader:
        "https://cdn.racinggames.gg/images/ncavvykf/racinggames/4cfa9528c1cbd5acef9c7cf308d8779af2949ca6-1280x720.jpg?auto=format",
      picturebody:
        "https://www.techspot.com/images2/news/bigimage/2022/03/2022-03-22-image-37.jpg",
      picturefooter:
        "https://www.videogameschronicle.com/files/2022/03/GT-7-VO.00_00_14_34.Still006-scaled.jpg",
      synopsis:
        "Gran Turismo 7 features the return of the single player campaign, GT Simulation Mode. Other returning features are the return of traditional racing tracks and vehicles, Special Events, Championships, Driving School, Tuning Parts Shop, Used Cars dealership, and GT Auto while still retaining the new GT Sport Mode, Brand Central, and Discover (now labelled Showcase) that were introduced in Gran Turismo Sport. The player needs to progress through tasks (Menu Books) from the GT Café to unlock features like multiplayer, and all tracks and cars.",
      about:
        "Gran Turismo 7 is a racing simulation game developed by Polyphony Digital and published by Sony Interactive Entertainment. The video game is the eighth mainline installment in the Gran Turismo series.",
      forgamer:
        "Gran Tourismo will appeal to gamers who enjoy a deep and authentic automotive experience. It caters to players who appreciate realistic driving physics, extensive car customization and tuning options, and a wide selection of meticulously recreated real-world vehicles and tracks, making it ideal for racing enthusiasts and automotive aficionados who seek a more serious and immersive racing experience.",
      notfor:
        "This game may not be suitable for gamers who prefer arcade-style racing games with a focus on fast-paced action and less emphasis on realistic driving mechanics. Additionally, players who are not particularly interested in cars or the intricacies of automotive simulation may find the game's attention to detail and the depth of its mechanics less appealing.",
    });

    const gameSims4 = await createNewGame({
      title: "The Sims 4",
      platform: "PC, PS5, XBOX",
      genre: "Simulation",
      msrp: "Free",
      score: "4",
      ourreview:
        "The Sims 4 is an incredibly tedious and monotonous game that offers little creativity or meaningful gameplay, leaving players with a dull and repetitive virtual life simulator that fails to capture any sense of excitement or engagement.",
      studio: "Electronic Arts",
      ourscore: "4",
      picturecard:
        "https://store-images.s-microsoft.com/image/apps.53697.64737940845214615.82a9a5cd-32c5-4fb1-a951-2a7b976ad460.f0e0779f-450f-421f-b0c6-7b04bf25fa60",
      pictureheader:
        "https://cdn.windowsreport.com/wp-content/uploads/2021/04/sims4.jpg",
      picturebody:
        "https://cdn2.unrealengine.com/egs-thesims4-electronicarts-g1a-00-1920x1080-acc697b40374.jpg",
      picturefooter:
        "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2019/04/The-Sims-4-DLC-cost.jpg",
      synopsis:
        "The Sims 4 builds upon the success of its predecessors, offering players the ability to create and control virtual characters, known as Sims, and guide them through various aspects of life, from relationships and careers to home design and personal aspirations. The game has multiple expansion packs available to purchase including updates since the game's release, adding new content and features to enhance the player's creative and storytelling possibilities within the virtual world.",
      about:
        "The Sims 4 is a social simulation game developed by Maxis and published by Electronic Arts. It is the fourth major title in The Sims series, and is the sequel to The Sims 3.",
      forgamer:
        "The Sims is designed for gamers who enjoy creative expression, character customization, and immersive life simulation experiences. It appeals to players who enjoy designing and building virtual homes, managing relationships and aspirations, and crafting unique stories within a virtual world.",
      notfor:
        "The Sims 4 may not be as enjoyable for gamers who prefer fast-paced action, intense competition, or highly structured gameplay. It may also be less appealing to players who prefer games with linear narratives or a strong emphasis on challenging objectives, as the game offers a more open-ended and sandbox-style experience focused on creativity and personal expression.",
    });

    const gameFlightSim = await createNewGame({
      title: "Microsoft Flight Simulator 2020",
      platform: "PC, XBOX",
      genre: "Simulation",
      msrp: "Free",
      score: "3",
      ourreview:
        "Microsoft Flight Simulator 2020 is an absolute marvel, providing an unmatched and breathtaking flight simulation experience that brings the world to your fingertips. With its stunning visuals, realistic flight physics, and a vast, meticulously recreated planet Earth to explore, it's a true testament to the wonders of modern technology and a must-play for aviation enthusiasts and curious explorers alike.",
      studio: "Xbox Games Studios",
      ourscore: "4",
      picturecard:
        "https://store-images.s-microsoft.com/image/apps.57274.13630274674230323.ef522ebd-e0ea-449e-b0c8-3271887caa67.2e92ae62-cd3e-458f-a8f8-3927865645e2",
      pictureheader:
        "https://assets.xboxservices.com/assets/ba/1d/ba1d9395-5db7-4072-b916-f276892a919c.jpg?n=Microsoft-Flight-Simulator_Poster-Image-1084_40th-Ann_1920x1080.jpg",
      picturebody:
        "https://media.cnn.com/api/v1/images/stellar/prod/191015160824-robin-dr-400-a.jpg?q=w_1600,h_900,x_0,y_0,c_fill/h_778",
      picturefooter:
        "https://cdn.akamai.steamstatic.com/steam/apps/1250410/ss_b962d1b93b3d457bc26d38e3228f60df9d877b08.1920x1080.jpg?t=1688584020",
      synopsis:
        "Microsoft Flight Simulator is a realistic flight simulation game that allows players to pilot a wide variety of aircraft and explore highly detailed and accurately recreated landscapes from around the world. With stunning visuals and a focus on authenticity, players can embark on thrilling flights, hone their piloting skills, and experience the joy of soaring through the skies in a true-to-life aviation adventure.",
      about:
        "Microsoft Flight Simulator is an amateur flight simulator developed by Asobo Studio and published by Xbox Game Studios. It is an entry in the Microsoft Flight Simulator series which began in 1982, and was preceded by Microsoft Flight Simulator X in 2006.",
      forgamer:
        "Flight Simulator is designed for gamers who have a fascination with aviation, a love for exploration, and a preference for immersive and realistic simulation experiences. It appeals to players who enjoy the challenge of mastering flight controls, appreciating breathtaking visuals, and embarking on virtual journeys to explore the world from a pilot's perspective.",
      notfor:
        "The game may not be as enjoyable for gamers who prefer action-packed and fast-paced gameplay experiences. It may also be less appealing to those who are not interested in aviation or have little patience for the meticulous attention to detail and learning curve associated with realistic flight simulation. Lastly, players seeking a structured narrative or clearly defined objectives might find the open-ended nature of the game daunting.",
    });

    const gameFootballManager = await createNewGame({
      title: "Football Manager 2023",
      platform: "PC, PS5, XBOX",
      genre: "Sports",
      msrp: "$29.99",
      score: "3",
      ourreview:
        "Football Manager 2023 offers an immersive and addictive managerial experience, providing unparalleled depth and realism for football fans. With its extensive database, realistic player interactions, and tactical decision-making, it delivers hours of strategic gameplay that will keep football enthusiasts hooked and eager to lead their favorite teams to glory.",
      studio: "SEGA",
      ourscore: "4",
      picturecard:
        "https://image.api.playstation.com/vulcan/ap/rnd/202301/0611/V9laPtwEM897lECsRxStEDxy.jpg",
      pictureheader:
        "https://cdn1.epicgames.com/offer/5c7a78e0c4d640898d690c5e38c0392f/EGS_FootballManager2023_SportsInteractive_S1_2560x1440-28187c5e17149ab967b8f3d3dd56a796",
      picturebody:
        "https://cdn.akamai.steamstatic.com/steam/apps/1904540/ss_1de15b6145de31fdc907895de2ec69a6d44e5237.1920x1080.jpg?t=1680627762",
      picturefooter:
        "https://cdn.akamai.steamstatic.com/steam/apps/1904540/ss_8d2a70ea08faf17cb96b7f9efff3bdb68d5bb425.1920x1080.jpg?t=1680627762",
      synopsis:
        "Build your dream squad, outsmart your rivals and experience the thrill of big European nights in the UEFA Champions League. Your journey towards footballing glory awaits.",
      about:
        "Football Manager 2023 is a football management simulation video game developed by Sports Interactive and published by SEGA. It is part of its very successfull Football Manager series.",
      forgamer:
        "Primarily, the game will appeal to gamers who have a strong interest in football (soccer) and enjoy strategic decision-making, team management, and in-depth gameplay. It caters to players who relish the challenge of leading a football team, making tactical choices, managing player transfers, and experiencing the intricacies of the sport from a managerial perspective.",
      notfor:
        "Football Manager not be as enjoyable for gamers who are not interested in football or sports management. It requires a significant investment of time and attention to detail, so players who prefer fast-paced or action-oriented gameplay experiences might find the game's slower pace and emphasis on strategy and statistics less engaging.",
    });

    const gameUndisputed = await createNewGame({
      title: "Undisputed",
      platform: "PC, PS5, XBOX",
      genre: "Sports",
      msrp: "$59.99",
      score: "3",
      ourreview:
        "Undisputed is a true-to-life boxing experience, with accurate physics, authentic boxing techniques, and a range of customizable options for players to create their ultimate fighter. We think it immerses players in the intensity of the ring, delivering satisfying and strategic boxing matches that will satisfy both boxing enthusiasts and sports fans everywhere.",
      studio: "Steel City Interactive",
      ourscore: "5",
      picturecard:
        "https://assets-prd.ignimgs.com/2022/10/11/undisputed-button-2-1665519933271.jpg",
      pictureheader:
        "https://itrboxing.com/wp-content/uploads/2022/10/Undisputed-logo.png",
      picturebody:
        "https://d1lss44hh2trtw.cloudfront.net/assets/article/2023/01/30/undisputed-boxer_feature.jpg",
      picturefooter:
        "https://cdn-cf-east.streamable.com/image/9vdxj6.jpg?Expires=1686978660&Signature=XMsipTh2CRhjHIyT3TKAKYn88rITVxi0MUwR7Uw4WBlxEOfca1pUURQ0-RDb7CoKcmfaf5RSLHSwtOsmLStqmSDhV-9pYTjuGuGPsFR8vWu9D09y1o5iQyQCaQaj~vfrf2BAH5Vbl2F77utyLY00JLOAVWOZvwvt3warh0FGbKFvx6SW1OOYPLmZr1FWSLANQBs8BmfI2YI6935NW1JdBigT0RnDcVf~JFAn~RZ9j4SdEQmIRXgp-4wNDwXYvrznyYM9W5oGSsQPRMu0DibWc9tRMHMzE5ovdoAGV6klLaaK4PHqYeszQIgNOgH2mMn8C~PfWm7jiFQmScPHwUAYDA__&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ",
      synopsis:
        "Boxing is not just about throwing punches anymore! In Undisputed, the ring is a strategic battlefield where fighters can choose an angle of attack, set up traps, and outsmart opponents through clever tactics. Several layers of fight mechanics were added to Undisputed, giving more control than ever to master the Sweet Science.",
      about:
        "Undisputed is the most authentic boxing game to date! Featuring true to life visuals, bone-jarring action, and more licensed boxers than ever before, Undisputed gives players unprecedented control to master every inch of the ring.",
      forgamer:
        "Undisputed would primarily appeal to gamers who have a passion for the sport of boxing and enjoy the tactical aspects, skill-based gameplay, and strategic decision-making involved in boxing matches. It will cater to players who appreciate the authenticity of the sport, including accurate physics, realistic graphics, and a deep understanding of boxing techniques and strategies.",
      notfor:
        "Undisputed may not be as enjoyable for gamers who prefer fast-paced action, flashy moves, or arcade-style gameplay experiences. Obviously players who are not interested in the sport of boxing or the intricacies of boxing mechanics and tactics may find the realistic nature of the game terrifying. Those seeking games with a broader range of gameplay options or who prefer less intense or competitive experiences may also find the game to be less appealing.",
    });

    const gameWarhammer3 = await createNewGame({
      title: "Total War: WARHAMMER III",
      platform: "PC",
      genre: "Strategy",
      msrp: "$59.99",
      score: "3",
      ourreview:
        "Total War: WARHAMMER III is an epic and immersive strategy game that combines the rich lore of the Warhammer fantasy universe with deep gameplay mechanics and captivating battles. With its diverse factions, intricate diplomacy, and massive campaign map, it offers a thrilling and rewarding experience for fans of both Warhammer and strategy gaming.",
      studio: "SEGA",
      ourscore: "4",
      picturecard:
        "https://assets-prd.ignimgs.com/2021/02/03/total-war-warhammer-3-button-02-1612376264737.jpg",
      pictureheader:
        "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2022/02/08/Warhammer-TW2.jpg",
      picturebody:
        "https://www.wargamer.com/wp-content/sites/wargamer/2022/02/total-war-warhammer-3-review-tzeentch-kairos-fateweaver-and-horrors-zoomed.jpg",
      picturefooter:
        "https://www.gameinformer.com/sites/default/files/styles/full/public/2021/05/12/9c8dee51/ksl_screenshot_asset02_final-2510226082c4f55a9259.42400474.png",
      synopsis:
        "The cataclysmic conclusion to the Total War: WARHAMMER trilogy is here. Rally your forces and step into the Realm of Chaos, a dimension of mind-bending horror where the very fate of the world will be decided. ",
      about:
        "Total War: Warhammer III is a turn-based strategy and real-time tactics video game developed by Creative Assembly and published by Sega. It is part of the Total War series, and the third to be set in Games Workshop's Warhammer Fantasy fictional universe.",
      forgamer:
        "Warhammer may appeal to gamers who enjoy strategic gameplay, immersive fantasy worlds, and a rich lore. It caters to players who appreciate tactical decision-making, deep customization options, and engaging battles in a dark and expansive universe, whether they are fans of the Warhammer tabletop game or newcomers to the franchise.",
      notfor:
        "The latest Warhammer video game may not be as enjoyable for gamers who prefer fast-paced action or instant gratification. It requires a strategic mindset, careful planning, and a willingness to invest time in learning the intricacies of the game mechanics. Additionally, players who are not interested in the fantasy genre, the Warhammer universe, or turn-based strategy gameplay may find the game less appealing.",
    });

    const gameCivilizationVI = await createNewGame({
      title: "Sid Meier's Civilization VI",
      platform: "PC, PS5, XBOX",
      genre: "Strategy",
      msrp: "$59.99",
      score: "5",
      ourreview:
        "Sid Meier's Civilization VI is an epic and immersive strategy game that combines the rich lore of the Warhammer fantasy universe with deep gameplay mechanics and captivating battles. With its diverse factions, intricate diplomacy, and massive campaign map, it offers a thrilling and rewarding experience for fans of both Warhammer and strategy gaming.",
      studio: "Firaxis Games",
      ourscore: "4",
      picturecard:
        "https://cdn1.epicgames.com/cd14dcaa4f3443f19f7169a980559c62/offer/EGS_SidMeiersCivilizationVI_FiraxisGames_S2-860x1148-bffad83909595b7c5c60489a17056a59.jpg",
      pictureheader:
        "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000013704/918c0badde3aeba760e2185f382a2402248a1292322cf540fd8d098eeb292e1e",
      picturebody:
        "https://cdn.2kgames.com/civilization.com/Beginners_Civ_hero.jpg",
      picturefooter:
        "https://www.digitaltrends.com/wp-content/uploads/2016/11/CivilizationVI-MediumMedium.png?p=1",
      synopsis:
        "Civ VI is a turn-based strategy game where players lead a civilization from its early beginnings to achieving global domination. With its intricate gameplay, diverse civilizations, and strategic decision-making, the game offers a captivating experience as players explore, expand, exploit, and exterminate their way to victory throughout history.",
      about:
        "The game was developed by Firaxis Games and published by 2K Games. It was initially released on October 21, 2016, and has since received multiple expansions and updates, introducing new civilizations, gameplay mechanics, and enhancing the overall experience for players as they shape the destiny of their civilization through the ages.",
      forgamer:
        "Civilization VI is for gamers who enjoy strategic gameplay, deep empire-building, and immersive historical experiences. It appeals to players who relish the challenge of managing resources, exploring new technologies, engaging in diplomacy, and competing against other civilizations to create a thriving society from scratch. The game caters to those who appreciate a blend of long-term planning, tactical decision-making, and the thrill of building and shaping a civilization throughout the ages.",
      notfor:
        "Civ VI may not be as enjoyable for gamers who prefer fast-paced action, immediate gratification, or games with a strong emphasis on intense combat. The game's turn-based nature and focus on strategy and long-term planning may not appeal to players seeking quick and adrenaline-fueled gameplay experiences. Additionally, players who are not interested in history, resource management, or complex systems may find the game's depth and intricacy less engaging.",
    });

    const gameStellaris = await createNewGame({
      title: "Stellaris",
      platform: "PC, PS5, XBOX",
      genre: "Strategy",
      msrp: "$9.99",
      score: "5",
      ourreview:
        "Stellaris is a stellar grand strategy game that takes players on a captivating journey through the vast expanse of space. With its deep and complex gameplay, vast customization options, and the thrill of exploring unknown galaxies, it offers an immersive and addictive experience for strategy enthusiasts and fans of science fiction.",
      studio: "Paradox Interactive",
      ourscore: "5",
      picturecard:
        "https://image.api.playstation.com/vulcan/img/rnd/202009/3014/Duaw5GDGGTUKSB17we8CzRfZ.png",
      pictureheader: "https://img.opencritic.com/game/1713/o/gtoOzXem.jpg",
      picturebody:
        "https://cdn.akamai.steamstatic.com/steam/apps/281990/ss_f844372cc220e3858aa17205e9fec0ae79a4e665.1920x1080.jpg?t=1687453160",
      picturefooter:
        "https://cdn.akamai.steamstatic.com/steam/apps/281990/ss_034b0d55a5c370bec4709f09d0914f9d131b7788.1920x1080.jpg?t=1687453160",
      synopsis:
        "A grand strategy game set in space, where players lead a civilization in their quest for galactic dominance. From exploring the cosmos and encountering diverse alien species to managing interstellar diplomacy and engaging in epic space battles, the game offers a vast and dynamic universe for players to shape and conquer.",
      about:
        "Stellaris was developed by Paradox Development Studio and published by Paradox Interactive. It was initially released on May 9, 2016, and has since received multiple expansions, updates, and DLCs, expanding the game's content, mechanics, and depth over time. These additions have further enriched the player's experience and provided ongoing support to the game's vibrant community.",
      forgamer:
        "Stellaris is for gamers who enjoy deep and immersive grand strategy experiences set in space. It appeals to players who relish the exploration of vast galaxies, strategic decision-making, diplomacy with alien civilizations, and managing the complexities of a growing interstellar empire. It is suitable for those who appreciate a combination of expansive sandbox gameplay, complex systems, and a sense of epic scale in their gaming experiences.",
      notfor:
        "The game may not be as enjoyable for gamers who prefer fast-paced action, immediate gratification, or linear storytelling and it requires a significant investment of time and patience to fully grasp its complex mechanics, manage the intricacies of empire-building, and navigate the complexities of interstellar politics. Additionally, players who prefer more focused and narrow gameplay experiences or are not particularly interested in space exploration and strategy may find the game's expansive scope and depth less engaging.",
    });

    console.log("Finished seed games.");
    const allGames = await fetchAllGames();
    const findSpecificGame = await fetchGameById(1);
    // console.log(findSpecificGame);

    //Start of user seed data
    const seedUser1 = await createUsers({
      username: "sarahadmin",
      fname: "sarah",
      lname: "admin",
      password: "adminPass1",
      email: "sadmin1@gmail.com",
      profilepic: "https://source.unsplash.com/bexwsdM5BCw",
      is_admin: true,
    });

    const seedUser2 = await createUsers({
      username: "coltonadmin",
      fname: "colton",
      lname: "admin",
      password: "adminPass2",
      email: "sadmin2@gmail.com",
      profilepic: "https://source.unsplash.com/P0YeIVOyvSI",
      is_admin: true,
    });

    const seedUser3 = await createUsers({
      username: "kelseyadmin",
      fname: "kelsey",
      lname: "admin",
      password: "adminPass3",
      email: "sadmin3@gmail.com",
      profilepic: "https://source.unsplash.com/8CItx_c0CkI",
      is_admin: true,
    });

    const seedUser4 = await createUsers({
      username: "jessieadmin",
      fname: "jessie",
      lname: "admin",
      password: "adminPass4",
      email: "sadmin4@gmail.com",
      profilepic: "https://source.unsplash.com/3POMgLjfYv0",
      is_admin: true,
    });

    const seedUser5 = await createUsers({
      username: "tmedhurst",
      fname: "Ted",
      lname: "Medhurst",
      password: "somethingDumb123",
      email: "atuny0@sohu.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser6 = await createUsers({
      username: "SlaBing",
      fname: "Slater",
      lname: "Bingly",
      password: "slaterhater234",
      email: "hbingley1@gmail.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser7 = await createUsers({
      username: "CarlyButtonedUp",
      fname: "Carly",
      lname: "Button",
      password: "ljfkej24",
      email: "button12349590x@sohu.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser8 = await createUsers({
      username: "RashadW",
      fname: "Rashad",
      lname: "Weeks",
      password: "hienig89",
      email: "rshawe2@eharmony.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
            is_admin: false,
    });

    const seedUser9 = await createUsers({
      username: "DemCork",
      fname: "Demetrius",
      lname: "Corkery",
      password: "L89Nbbje3",
      email: "nloiterton8@aol.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
         is_admin: false,
    });

    const seedUser10 = await createUsers({
      username: "ThermanU",
      fname: "Umma",
      lname: "Therman",
      password: "hionwlHHIPN950",
      email: "umcgourty9@jalbum.net",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
        is_admin: false,
    });

    const seedUser11 = await createUsers({
      username: "RathAssunta",
      fname: "Assunta",
      lname: "Rath",
      password: "Kinw&^045tG",
      email: "rhallawellb@dropbox.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
           is_admin: false,
    });

    const seedUser12 = await createUsers({
      username: "SkilesG",
      fname: "Skiles",
      lname: "Goodwin",
      password: "post235jKKl2h",
      email: "lgribbinc@posterous.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
       is_admin: false,
    });

    const seedUser13 = await createUsers({
      username: "MikeT123",
      fname: "MikeT",
      lname: "Turley",
      password: "jIowne82JlwJJI",
      email: "mturleyd@tumblr.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
        is_admin: false,
    });

    const seedUser14 = await createUsers({
      username: "MichKimi",
      fname: "Michelle",
      lname: "Kimichi",
      password: "LnwkOhspwh928!!",
      email: "kminchelle@qicktrip.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
        is_admin: false,
    });

    const seedUser15 = await createUsers({
      username: "ACardigan",
      fname: "Aubrey",
      lname: "Cardigan",
      password: "KlwhII928K",
      email: "acc@robohash.org",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
         is_admin: false,
    });

    const seedUser16 = await createUsers({
      username: "BarryF1",
      fname: "Barry",
      lname: "Faye",
      password: "lng-86.58",
      email: "bleveragei@xinjianguni.edu",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
       is_admin: false,
    });

    const seedUser17 = await createUsers({
      username: "RennerL22",
      fname: "Lenna",
      lname: "Renner",
      password: "szWAG6hc",
      email: "aeatockj@psu.edu",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
         is_admin: false,
    });

    const seedUser18 = await createUsers({
      username: "ErnserDoylful31",
      fname: "Doyle",
      lname: "Ernser",
      password: "tq920JJI7kPXyf",
      email: "ckeernser@pen.io",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser19 = await createUsers({
      username: "TWeber25",
      fname: "Teresa Weber",
      lname: "Teresa Weber",
      password: "928arecusandaeest020",
      email: "froachel@howstuffworks.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
        is_admin: false,
    });

    const seedUser20 = await createUsers({
      username: "C_KensleyStar",
      fname: "Chelsea",
      lname: "Kensleyk",
      password: "ipsumut&GGEof28",
      email: "ckensleyk@pen.io",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",

      is_admin: false,
    });

    const seedUser21 = await createUsers({
      username: "FRosenbaum",
      fname: "Felicity Rosenbaum",
      lname: "Felicity Rosenbaum",
      password: "zQwaHTHbuZyr",
      email: "beykelhofm@wikispaces.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
          is_admin: false,
    });

    const seedUser22 = await createUsers({
      username: "KeardRk",
      fname: "Richard",
      lname: "Keard",
      password: "bMQnPttV",
      email: "brickeardn@fema.gov",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
       is_admin: false,
    });

    const seedUser23 = await createUsers({
      username: "GronaverL",
      fname: "Laura",
      lname: "Gronaver",
      password: "4a1dAKDv9KB9",
      email: "lgronaverp@cornell.edu",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
         is_admin: false,
    });

    const seedUser24 = await createUsers({
      username: "SchowalterP",
      fname: "Piper",
      lname: "Schowalter",
      password: "xZnWSWnqH",
      email: "fokillq@amazon.co",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
           is_admin: false,
    });

    const seedUser25 = await createUsers({
      username: "KTLarkin",
      fname: "Kody",
      lname: "Tern Larkin",
      password: "HLDqN59vCF",
      email: "xisherwoodr@ask.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
        is_admin: false,
    });

    const seedUser26 = await createUsers({
      username: "MacyGreen8",
      fname: "Macy",
      lname: "Greenfelder",
      password: "ePawWgrnZR8L",
      email: "jissetts@hostgator.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
          is_admin: false,
    });

    const seedUser27 = await createUsers({
      username: "MStracke",
      fname: "Maurine",
      lname: "Stracke",
      password: "5t6q4KC7O",
      email: "kdulyt@umich.edu",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
        is_admin: false,
    });

    const seedUser28 = await createUsers({
      username: "J_ohNbabyJ",
      fname: "John",
      lname: "Mulaney",
      password: "llkjd$392j",
      email: "jmulaney@notsnl.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
          is_admin: false,
    });

    const seedUser29 = await createUsers({
      username: "UngangweP",
      fname: "Phinn",
      lname: "Ungangwe",
      password: "L*hwU2H",
      email: "ungangugn@nsu.edu",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
         is_admin: false,
    });

    const seedUser30 = await createUsers({
      username: "GaleJaxJax2222",
      fname: "Jaxon",
      lname: "Gale",
      password: "Heni288&lwj",
      email: "glaej@gmail.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser31 = await createUsers({
      username: "JumboJohn",
      fname: "John",
      lname: "Smith",
      password: "xY3bP@w&8Zs!",
      email: "Jj@gmail.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser32 = await createUsers({
      username: "DayPants92",
      fname: "Oliver",
      lname: "Harris",
      password: "9$L*j6E#zFv2",
      email: "DanceDreamer92@gmail.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser33 = await createUsers({
      username: "RhythmJunkie92",
      fname: "Ava",
      lname: "Mitchell",
      password: "Q7dG@k1S!5cP",
      email: "TheDangel92@gmail.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser34 = await createUsers({
      username: "WhimsicalJumper",
      fname: "Emma",
      lname: "Sullivan",
      password: "X3@#gBp!29",
      email: "sunnyblue12@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser35 = await createUsers({
      username: "ElectricShadow",
      fname: "Ava",
      lname: "Carter",
      password: "Qw2@9#nL4!",
      email: "wanderlust87@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser36 = await createUsers({
      username: "SapphireWanderer",
      fname: "Noah",
      lname: "Thompson",
      password: "7^f$1Mz@8!",
      email: "radiantflower45@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",

      is_admin: false,
    });

    const seedUser37 = await createUsers({
      username: "CosmicDreamer",
      fname: "Olivia",
      lname: "Foster",
      password: "H@6g#9yT3!",
      email: "techgeek21@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",

      is_admin: false,
    });

    const seedUser38 = await createUsers({
      username: "VelvetRaven",
      fname: "Liam",
      lname: "Mitchell",
      password: "D5@*x!2oY7",
      email: "whimsicaldreamer98@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
           is_admin: false,
    });

    const seedUser39 = await createUsers({
      username: "EnigmaticWhisper",
      fname: "Sophia",
      lname: "Gray",
      password: "J6%v#1tA@4",
      email: "adventureseeker55@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser40 = await createUsers({
      username: "RadiantGlimmer",
      fname: "Benjamin",
      lname: "Richardson",
      password: "R3#s@5vP*9",
      email: "creativeartist77@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser41 = await createUsers({
      username: "MidnightProwler",
      fname: "Isabella",
      lname: "Cooper",
      password: "2@L4c9Y$1%",
      email: "sportsfanatic23@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser42 = await createUsers({
      username: "QuirkyDoodle",
      fname: "James",
      lname: "Murphy",
      password: "K@9&b6Tq#8",
      email: "bookworm89@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
            is_admin: false,
    });

    const seedUser43 = await createUsers({
      username: "NebulaSparkle",
      fname: "Mia",
      lname: "Brookes",
      password: "F@2g7I$4%",
      email: "musiclover42@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",

      is_admin: false,
    });

    const seedUser44 = await createUsers({
      username: "SereneBreeze",
      fname: "Ethan",
      lname: "Adams",
      password: "6J@4p!8K#2",
      email: "fitnessenthusiast61@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
            is_admin: false,
    });

    const seedUser45 = await createUsers({
      username: "MysticalSphinx",
      fname: "Charolette",
      lname: "Peterson",
      password: "B#5&v4Rm!9",
      email: "foodiechef36@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",

      is_admin: false,
    });

    const seedUser46 = await createUsers({
      username: "SilverLuna",
      fname: "Alexander",
      lname: "Morgan",
      password: "T@7s#2qF3%",
      email: "natureexplorer79@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
          is_admin: false,
    });

    const seedUser47 = await createUsers({
      username: "WhisperingWillow",
      fname: "Amelia",
      lname: "Bennett",
      password: "M4!j#5vK@9",
      email: "animallover14@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",

      is_admin: false,
    });

    const seedUser48 = await createUsers({
      username: "InfiniteJourney",
      fname: "Jacob",
      lname: "Campbell",
      password: "8N@9p!7B#3",
      email: "thrillseeker27@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser49 = await createUsers({
      username: "EmberGazer",
      fname: "Harper",
      lname: "Reed",
      password: "G@3d5Rq*7%",
      email: "fashionista88@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
          is_admin: false,
    });

    const seedUser50 = await createUsers({
      username: "DreamyGlimpse",
      fname: "William",
      lname: "Phillips",
      password: "V$2!g5N@9#",
      email: "techsavvy73@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser51 = await createUsers({
      username: "BrightStar22",
      fname: "Emily",
      lname: "Anderson",
      password: "P@ssw0rd123",
      email: " emily.anderson@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
            is_admin: false,
    });

    const seedUser52 = await createUsers({
      username: "AquaWave16",
      fname: "Liam",
      lname: "Roberts",
      password: "Secret@987",
      email: "liam.roberts@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
          is_admin: false,
    });

    const seedUser53 = await createUsers({
      username: "SilverArrow99",
      fname: "Juan",
      lname: "Nunez",
      password: "StrongPass#1",
      email: "Crusher6X@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser54 = await createUsers({
      username: "SwiftTiger11",
      fname: "Ethan",
      lname: "Davis",
      password: "TigerEyes@3",
      email: "TangyWinger15@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
            is_admin: false,
    });

    const seedUser55 = await createUsers({
      username: "MidnightRose44",
      fname: "Dialgo",
      lname: "Luna",
      password: "RoseBloom$8",
      email: "Jester15@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser56 = await createUsers({
      username: "StellarGazer88",
      fname: "Phila",
      lname: "Dentonic",
      password: "GazeStars@12",
      email: "Phickle324@#@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser57 = await createUsers({
      username: "WildSerenade77",
      fname: "Kino",
      lname: "Grapp",
      password: "Melody$321",
      email: "Sunodo23@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser58 = await createUsers({
      username: "ElectricDreams55",
      fname: "Lucy",
      lname: "Wong",
      password: "Lightning@789",
      email: "rippalla@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    const seedUser59 = await createUsers({
      username: "LunaWhisper66",
      fname: "Tullua",
      lname: "Bistro",
      password: "Moonlight*567",
      email: "XYZ321@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",

      is_admin: false,
    });

    const seedUser60 = await createUsers({
      username: "CosmicJourney33",
      fname: "Gerny",
      lname: "George",
      password: "GalaxyQuest!9",
      email: "GernySkywalker@example.com",
      profilepic: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      is_admin: false,
    });

    console.log("Finished seed users");

    const allUsers = await fetchAllUsers();
    console.log(allUsers);

    //Start of reviews seed data
    const seedReview1 = await createReviews({
      reviewbody:
        "With stunning graphics and immersive gameplay, this video game transports players to a breathtaking world filled with endless possibilities.",
      userscore: 3,
      reviewUserId: 2,
      reviewGameId: 1,
    });
    const seedReview2 = await createReviews({
      reviewbody:
        "From its gripping storyline to its intense combat mechanics, this game keeps players on the edge of their seats, craving for more.",
      userscore: 4,
      reviewUserId: 16,
      reviewGameId: 15,
    });
    const seedReview3 = await createReviews({
      reviewbody:
        "With a vast open world to explore and countless quests to embark on, this game offers an unparalleled sense of adventure.",
      userscore: 4,
      reviewUserId: 14,
      reviewGameId: 6,
    });
    const seedReview4 = await createReviews({
      reviewbody:
        "The game's innovative multiplayer mode allows players to team up with friends and engage in exhilarating battles, creating unforgettable gaming moments.",
      userscore: 3,
      reviewUserId: 27,
      reviewGameId: 22,
    });
    const seedReview5 = await createReviews({
      reviewbody:
        "Featuring a rich character customization system and deep skill trees, this game offers a truly personalized gaming experience.",
      userscore: 3,
      reviewUserId: 18,
      reviewGameId: 29,
    });
    const seedReview6 = await createReviews({
      reviewbody:
        "With its intuitive controls and smooth gameplay mechanics, this game is a joy to play, appealing to both casual and hardcore gamers.",
      userscore: 4,
      reviewUserId: 30,
      reviewGameId: 18,
    });
    const seedReview7 = await createReviews({
      reviewbody:
        "The game's breathtaking soundtrack and immersive sound effects enhance the overall gaming experience, bringing the virtual world to life.",
      userscore: 4,
      reviewUserId: 24,
      reviewGameId: 7,
    });
    const seedReview8 = await createReviews({
      reviewbody:
        "The strategic gameplay mechanics and tactical decision-making required in this game make it a must-play for fans of the genre.",
      userscore: 3,
      reviewUserId: 6,
      reviewGameId: 12,
    });
    const seedReview9 = await createReviews({
      reviewbody:
        "This game's unique art style and vibrant visuals create a visually stunning and captivating gaming experience.",
      userscore: 4,
      reviewUserId: 22,
      reviewGameId: 28,
    });
    const seedReview10 = await createReviews({
      reviewbody:
        "From its emotionally charged cutscenes to its well-developed characters, this game immerses players in a compelling narrative.",
      userscore: 4,
      reviewUserId: 3,
      reviewGameId: 4,
    });
    const seedReview11 = await createReviews({
      reviewbody:
        "With its challenging puzzles and brain-teasing obstacles, this game keeps players engaged and entertained for hours.",
      userscore: 4,
      reviewUserId: 12,
      reviewGameId: 19,
    });
    const seedReview12 = await createReviews({
      reviewbody:
        "With its challenging puzzles and brain-teasing obstacles, this game keeps players engaged and entertained for hours.",
      userscore: 3,
      reviewUserId: 9,
      reviewGameId: 10,
    });
    const seedReview13 = await createReviews({
      reviewbody:
        "Featuring an array of memorable boss battles and epic showdowns, this game delivers adrenaline-pumping excitement.",
      userscore: 4,
      reviewUserId: 20,
      reviewGameId: 30,
    });
    const seedReview14 = await createReviews({
      reviewbody:
        "The game's realistic physics engine and lifelike animations make every action and movement feel satisfyingly authentic.",
      userscore: 2,
      reviewUserId: 26,
      reviewGameId: 25,
    });
    const seedReview15 = await createReviews({
      reviewbody:
        "This game's seamless integration of virtual reality technology creates an unparalleled level of immersion for players.",
      userscore: 1,
      reviewUserId: 5,
      reviewGameId: 2,
    });
    const seedReview16 = await createReviews({
      reviewbody:
        "The game's intuitive user interface and helpful tutorials make it accessible to players of all skill levels.",
      userscore: 3,
      reviewUserId: 7,
      reviewGameId: 14,
    });
    const seedReview17 = await createReviews({
      reviewbody:
        "With its branching storyline and multiple endings, this game offers high replay value and encourages exploration.",
      userscore: 3,
      reviewUserId: 15,
      reviewGameId: 5,
    });
    const seedReview18 = await createReviews({
      reviewbody:
        "The game's vast arsenal of weapons and equipment allows for endless customization and strategic gameplay.",
      userscore: 4,
      reviewUserId: 8,
      reviewGameId: 20,
    });
    const seedReview19 = await createReviews({
      reviewbody:
        "From its breathtaking landscapes to its meticulously designed environments, this game is a visual masterpiece.",
      userscore: 3,
      reviewUserId: 23,
      reviewGameId: 3,
    });
    const seedReview20 = await createReviews({
      reviewbody:
        "The game's witty dialogue and memorable characters bring humor and charm to an already fantastic gaming experience.",
      userscore: 4,
      reviewUserId: 19,
      reviewGameId: 8,
    });
    const seedReview21 = await createReviews({
      reviewbody:
        "With its well-crafted level design and challenging obstacles, this game keeps players engaged and motivated to succeed.",
      userscore: 2,
      reviewUserId: 28,
      reviewGameId: 16,
    });
    const seedReview22 = await createReviews({
      reviewbody:
        "The game's addictive multiplayer mode ensures hours of competitive fun and intense online battles.",
      userscore: 3,
      reviewUserId: 4,
      reviewGameId: 27,
    });
    const seedReview23 = await createReviews({
      reviewbody:
        "Featuring a deep crafting system and resource management mechanics, this game offers a satisfying sense of progression.",
      userscore: 1,
      reviewUserId: 11,
      reviewGameId: 9,
    });
    const seedReview24 = await createReviews({
      reviewbody:
        "This game's intricate lore and rich world-building captivate players, leaving them eager to unravel its mysteries.",
      userscore: 4,
      reviewUserId: 17,
      reviewGameId: 23,
    });
    const seedReview25 = await createReviews({
      reviewbody:
        "With its compelling moral choices and branching storylines, this game provides a truly immersive and thought-provoking experience.",
      userscore: 1,
      reviewUserId: 29,
      reviewGameId: 11,
    });
    const seedReview26 = await createReviews({
      reviewbody:
        "The game's extensive character development options and diverse playstyles cater to a wide range of player preferences.",
      userscore: 2,
      reviewUserId: 21,
      reviewGameId: 26,
    });
    const seedReview27 = await createReviews({
      reviewbody:
        "Featuring stunning cinematics and breathtaking set pieces, this game feels like an interactive blockbuster movie.",
      userscore: 5,
      reviewUserId: 1,
      reviewGameId: 13,
    });
    const seedReview28 = await createReviews({
      reviewbody:
        "The game's intuitive and responsive controls make it easy for players to pick up and play, regardless of their experience level.",
      userscore: 3,
      reviewUserId: 13,
      reviewGameId: 17,
    });
    const seedReview29 = await createReviews({
      reviewbody:
        "With its addictive gameplay loop and satisfying progression system, this game keeps players hooked for hours on end.",
      userscore: 2,
      reviewUserId: 25,
      reviewGameId: 24,
    });
    const seedReview30 = await createReviews({
      reviewbody:
        "The game's dynamic and reactive world creates a sense of realism and immersion rarely seen in the gaming industry.",
      userscore: 4,
      reviewUserId: 1,
      reviewGameId: 21,
    });
    const seedReview31 = await createReviews({
      reviewbody:
        "Featuring a deep and engaging storyline, this game keeps players invested in the fates of its characters from beginning to end.",
      userscore: 2,
      reviewUserId: 16,
      reviewGameId: 1,
    });
    const seedReview32 = await createReviews({
      reviewbody:
        "The game's diverse cast of playable characters and unique abilities adds a layer of strategic depth to the gameplay.",
      userscore: 5,
      reviewUserId: 14,
      reviewGameId: 35,
    });
    const seedReview33 = await createReviews({
      reviewbody:
        "This game's multiplayer modes offer endless fun and excitement, whether players are competing or cooperating with each other.",
      userscore: 4,
      reviewUserId: 27,
      reviewGameId: 6,
    });
    const seedReview34 = await createReviews({
      reviewbody:
        "The game's attention to detail and meticulous craftsmanship shine through in every aspect of its design.",
      userscore: 3,
      reviewUserId: 18,
      reviewGameId: 22,
    });
    const seedReview35 = await createReviews({
      reviewbody:
        "Featuring breathtaking boss battles and challenging encounters, this game tests players' skills and reflexes to the limit.",
      userscore: 3,
      reviewUserId: 30,
      reviewGameId: 29,
    });
    const seedReview36 = await createReviews({
      reviewbody:
        "The game's well-implemented cooperative gameplay allows friends to team up and tackle challenges together, fostering camaraderie.",
      userscore: 4,
      reviewUserId: 24,
      reviewGameId: 18,
    });
    const seedReview37 = await createReviews({
      reviewbody:
        "With its captivating storytelling and memorable dialogue, this game creates an emotional connection with players.",
      userscore: 4,
      reviewUserId: 6,
      reviewGameId: 47,
    });
    const seedReview38 = await createReviews({
      reviewbody:
        "The game's expansive and immersive world begs to be explored, rewarding players with hidden treasures and secrets.",
      userscore: 3,
      reviewUserId: 22,
      reviewGameId: 12,
    });
    const seedReview39 = await createReviews({
      reviewbody:
        "Featuring a variety of gameplay modes and unlockable content, this game offers endless replayability.",
      userscore: 5,
      reviewUserId: 3,
      reviewGameId: 28,
    });
    const seedReview40 = await createReviews({
      reviewbody:
        "The game's well-balanced difficulty curve provides a satisfying challenge without feeling overly frustrating.",
      userscore: 4,
      reviewUserId: 12,
      reviewGameId: 4,
    });
    const seedReview41 = await createReviews({
      reviewbody:
        "This game's attention to historical accuracy and period detail brings a unique educational aspect to the gaming experience.",
      userscore: 3,
      reviewUserId: 9,
      reviewGameId: 19,
    });
    const seedReview42 = await createReviews({
      reviewbody:
        "With its jaw-dropping graphics and smooth frame rates, this game is a visual feast for the eyes.",
      userscore: 3,
      reviewUserId: 26,
      reviewGameId: 30,
    });
    const seedReview43 = await createReviews({
      reviewbody:
        "The game's dynamic weather system and day-night cycle create a living, breathing world that evolves with each playthrough.",
      userscore: 3,
      reviewUserId: 26,
      reviewGameId: 30,
    });
    const seedReview44 = await createReviews({
      reviewbody:
        "Featuring an epic and memorable soundtrack, this game's music enhances the atmosphere and immerses players in its universe.",
      userscore: 2,
      reviewUserId: 5,
      reviewGameId: 25,
    });
    const seedReview45 = await createReviews({
      reviewbody:
        "The game's deep and complex narrative tackles mature themes, offering a thought-provoking and emotionally resonant experience.",
      userscore: 4,
      reviewUserId: 7,
      reviewGameId: 2,
    });
    const seedReview46 = await createReviews({
      reviewbody:
        "With its intuitive level editor and robust modding support, this game allows players to unleash their creativity and share their creations with others.",
      userscore: 5,
      reviewUserId: 15,
      reviewGameId: 14,
    });
    const seedReview47 = await createReviews({
      reviewbody:
        "The game's responsive and satisfying combat mechanics make every battle a thrilling and adrenaline-fueled experience.",
      userscore: 2,
      reviewUserId: 8,
      reviewGameId: 5,
    });
    const seedReview48 = await createReviews({
      reviewbody:
        "Featuring a vast array of unique and diverse enemies, this game keeps players on their toes, adapting their strategies to each encounter.",
      userscore: 3,
      reviewUserId: 23,
      reviewGameId: 20,
    });
    const seedReview49 = await createReviews({
      reviewbody:
        "The game has no seamless integration of cooperative and competitive multiplayer modes to provide a well-rounded and enjoyable online experience.",
      userscore: 1,
      reviewUserId: 19,
      reviewGameId: 3,
    });
    const seedReview50 = await createReviews({
      reviewbody:
        "With its addictive loot system and rewarding progression, this game keeps players engaged as they constantly strive for better gear and upgrades.",
      userscore: 2,
      reviewUserId: 28,
      reviewGameId: 8,
    });
    const seedReview51 = await createReviews({
      reviewbody:
        "The game's well-designed and challenging puzzles encourage critical thinking and problem-solving, keeping players engaged and entertained.",
      userscore: 4,
      reviewUserId: 4,
      reviewGameId: 16,
    });
    const seedReview52 = await createReviews({
      reviewbody:
        "Featuring a deep and branching skill tree, this game allows players to customize their characters to suit their preferred playstyle.",
      userscore: 4,
      reviewUserId: 11,
      reviewGameId: 27,
    });
    const seedReview53 = await createReviews({
      reviewbody:
        "The game's impressive attention to detail and realistic physics create a sense of immersion and authenticity.",
      userscore: 5,
      reviewUserId: 17,
      reviewGameId: 9,
    });
    const seedReview54 = await createReviews({
      reviewbody:
        "With its breathtaking visuals and expansive open world, this game offers players a true sense of freedom and exploration.",
      userscore: 3,
      reviewUserId: 29,
      reviewGameId: 23,
    });
    const seedReview55 = await createReviews({
      reviewbody:
        "The game's thoughtfully designed boss encounters and epic battles provide exhilarating and memorable gaming moments.",
      userscore: 4,
      reviewUserId: 21,
      reviewGameId: 11,
    });
    const seedReview56 = await createReviews({
      reviewbody:
        "Featuring a compelling and well-written story, this game keeps players invested in its world and characters from start to finish.",
      userscore: 5,
      reviewUserId: 1,
      reviewGameId: 26,
    });
    const seedReview57 = await createReviews({
      reviewbody:
        "The game's seamless blend of action, stealth, and exploration provides a diverse and engaging gameplay experience.",
      userscore: 4,
      reviewUserId: 13,
      reviewGameId: 13,
    });
    const seedReview58 = await createReviews({
      reviewbody:
        "With its well-balanced multiplayer matchmaking and competitive ranking system, this game offers a fair and satisfying online competition.",
      userscore: 3,
      reviewUserId: 25,
      reviewGameId: 17,
    });
    const seedReview59 = await createReviews({
      reviewbody:
        "The game's rich lore and world-building elements create a captivating and immersive gaming experience.",
      userscore: 4,
      reviewUserId: 4,
      reviewGameId: 24,
    });
    const seedReview60 = await createReviews({
      reviewbody:
        "Featuring a variety of game modes and a thriving community, this game offers endless hours of multiplayer fun and social interaction.",
      userscore: 5,
      reviewUserId: 18,
      reviewGameId: 21,
    });
    const seedReview61 = await createReviews({
      reviewbody:
        "A disappointing release that falls short in terms of content and replay value.",
      userscore: 2,
      reviewUserId: 14,
      reviewGameId: 30,
    });
    const seedReview62 = await createReviews({
      reviewbody:
        "A fun multiplayer experience with friends, perfect for endless hours of gaming.",
      userscore: 4,
      reviewUserId: 27,
      reviewGameId: 31,
    });
    const seedReview63 = await createReviews({
      reviewbody:
        "An exhilarating experience with breathtaking visuals and seamless gameplay.",
      userscore: 5,
      reviewUserId: 18,
      reviewGameId: 33,
    });
    const seedReview64 = await createReviews({
      reviewbody:
        "Challenging gameplay experience that rewards skill and strategy.",
      userscore: 2,
      reviewUserId: 3,
      reviewGameId: 35,
    });
    const seedReview65 = await createReviews({
      reviewbody:
        "An innovative title that introduces fresh mechanics to the genre.",
      userscore: 3,
      reviewUserId: 12,
      reviewGameId: 36,
    });
    const seedReview66 = await createReviews({
      reviewbody:
        "Very forgettable game that fails to leave a lasting impression.",
      userscore: 1,
      reviewUserId: 9,
      reviewGameId: 40,
    });
    const seedReview67 = await createReviews({
      reviewbody:
        "A terrible journey that won't pay homage to classic games of the past, not in a good way.",
      userscore: 2,
      reviewUserId: 20,
      reviewGameId: 41,
    });
    const seedReview68 = await createReviews({
      reviewbody: "A lackluster game that fails to deliver on its promises.",
      userscore: 4,
      reviewUserId: 26,
      reviewGameId: 44,
    });
    const seedReview69 = await createReviews({
      reviewbody:
        "A captivating narrative that keeps you engaged until the very end.",
      userscore: 5,
      reviewUserId: 5,
      reviewGameId: 42,
    });
    const seedReview70 = await createReviews({
      reviewbody:
        "Not a visually stunning world that invites exploration or discovery.",
      userscore: 2,
      reviewUserId: 7,
      reviewGameId: 48,
    });

    const allReviews = await fetchAllReviews();
    console.log(allReviews);
    console.log("Finished seed reviews");

    //Begin seed comment data
    const seedComment1 = await createComments({
      commentbody: "Graphics are out of this world!",
      origUserId: 2,
      origReviewId: 19,
    });
    const seedComment2 = await createComments({
      commentbody: "I couldn't put the controller down!",
      origUserId: 16,
      origReviewId: 10,
    });
    const seedComment3 = await createComments({
      commentbody: "I got lost in its vastness.",
      origUserId: 14,
      origReviewId: 7,
    });
    const seedComment4 = await createComments({
      commentbody: "Multiplayer battles were pure adrenaline.",
      origUserId: 27,
      origReviewId: 28,
    });
    const seedComment5 = await createComments({
      commentbody: "I felt like the ultimate hero!",
      origUserId: 18,
      origReviewId: 15,
    });
    const seedComment6 = await createComments({
      commentbody: "Gameplay was smooth as butter.",
      origUserId: 30,
      origReviewId: 21,
    });
    const seedComment7 = await createComments({
      commentbody: "The sound design blew me away!",
      origUserId: 24,
      origReviewId: 13,
    });
    const seedComment8 = await createComments({
      commentbody: "Tactical gameplay at its finest.",
      origUserId: 6,
      origReviewId: 26,
    });
    const seedComment9 = await createComments({
      commentbody: "I couldn't stop staring, simply beautiful.",
      origUserId: 22,
      origReviewId: 9,
    });
    const seedComment10 = await createComments({
      commentbody: "The story had me emotionally invested.",
      origUserId: 3,
      origReviewId: 4,
    });
    const seedComment11 = await createComments({
      commentbody: "Puzzles challenged my brain, loved it!",
      origUserId: 12,
      origReviewId: 23,
    });
    const seedComment12 = await createComments({
      commentbody: "I made so many friends online.",
      origUserId: 9,
      origReviewId: 30,
    });
    const seedComment13 = await createComments({
      commentbody: "Boss battles left me breathless!",
      origUserId: 20,
      origReviewId: 5,
    });
    const seedComment14 = await createComments({
      commentbody: "Movements were so realistic, wow!",
      origUserId: 26,
      origReviewId: 17,
    });
    const seedComment15 = await createComments({
      commentbody: "VR made it an unforgettable experience.",
      origUserId: 5,
      origReviewId: 3,
    });
    const seedComment16 = await createComments({
      commentbody: "User-friendly interface, perfect for beginners.",
      origUserId: 7,
      origReviewId: 12,
    });
    const seedComment17 = await createComments({
      commentbody: "I kept replaying to explore more.",
      origUserId: 15,
      origReviewId: 25,
    });
    const seedComment18 = await createComments({
      commentbody: "Weapons galore, endless customization options!",
      origUserId: 8,
      origReviewId: 1,
    });
    const seedComment19 = await createComments({
      commentbody: "I felt like I was there!",
      origUserId: 23,
      origReviewId: 20,
    });
    const seedComment20 = await createComments({
      commentbody: "Characters had me laughing out loud.",
      origUserId: 19,
      origReviewId: 6,
    });
    const seedComment21 = await createComments({
      commentbody: "Level design kept me engaged.",
      origUserId: 28,
      origReviewId: 29,
    });
    const seedComment22 = await createComments({
      commentbody: "Online battles were intense and addictive.",
      origUserId: 4,
      origReviewId: 16,
    });
    const seedComment23 = await createComments({
      commentbody: "Crafting added a whole new dimension.",
      origUserId: 20,
      origReviewId: 5,
    });
    const seedComment24 = await createComments({
      commentbody: "The lore had me hooked!",
      origUserId: 17,
      origReviewId: 14,
    });
    const seedComment25 = await createComments({
      commentbody: "Morally challenging decisions kept me guessing.",
      origUserId: 29,
      origReviewId: 8,
    });
    const seedComment26 = await createComments({
      commentbody: "So many playstyles, endless possibilities.",
      origUserId: 21,
      origReviewId: 22,
    });
    const seedComment27 = await createComments({
      commentbody: "Cinematics were like watching a movie.",
      origUserId: 1,
      origReviewId: 19,
    });
    const seedComment28 = await createComments({
      commentbody: "Controls were intuitive, easy to learn.",
      origUserId: 13,
      origReviewId: 10,
    });
    const seedComment29 = await createComments({
      commentbody: "I lost track of time playing.",
      origUserId: 25,
      origReviewId: 7,
    });
    const seedComment30 = await createComments({
      commentbody: "The world felt alive and interactive.",
      origUserId: 19,
      origReviewId: 6,
    });
    const seedComment31 = await createComments({
      commentbody: "The storyline captivated me throughout.",
      origUserId: 16,
      origReviewId: 15,
    });
    const seedComment32 = await createComments({
      commentbody: "Playing different characters was exhilarating.",
      origUserId: 14,
      origReviewId: 21,
    });
    const seedComment33 = await createComments({
      commentbody: "Multiplayer brought friends closer, loved it.",
      origUserId: 27,
      origReviewId: 13,
    });
    const seedComment34 = await createComments({
      commentbody: "Attention to detail was simply stunning.",
      origUserId: 18,
      origReviewId: 26,
    });
    const seedComment35 = await createComments({
      commentbody: "Boss battles tested my gaming skills.",
      origUserId: 30,
      origReviewId: 9,
    });
    const seedComment36 = await createComments({
      commentbody: "Co-op mode created unforgettable memories.",
      origUserId: 24,
      origReviewId: 4,
    });
    const seedComment37 = await createComments({
      commentbody: "The dialogue added depth and emotion.",
      origUserId: 6,
      origReviewId: 23,
    });
    const seedComment38 = await createComments({
      commentbody: "Exploration rewarded me at every turn.",
      origUserId: 22,
      origReviewId: 30,
    });
    const seedComment39 = await createComments({
      commentbody: "I kept coming back for more!",
      origUserId: 3,
      origReviewId: 5,
    });
    const seedComment40 = await createComments({
      commentbody: "Challenging but not overly frustrating.",
      origUserId: 12,
      origReviewId: 17,
    });
    const seedComment41 = await createComments({
      commentbody: "I learned so much from playing.",
      origUserId: 9,
      origReviewId: 3,
    });
    const seedComment42 = await createComments({
      commentbody: "Graphics were jaw-dropping, blew me away.",
      origUserId: 20,
      origReviewId: 12,
    });
    const seedComment43 = await createComments({
      commentbody: "Weather effects made the game realistic.",
      origUserId: 26,
      origReviewId: 25,
    });
    const seedComment44 = await createComments({
      commentbody: "The soundtrack elevated the experience.",
      origUserId: 5,
      origReviewId: 1,
    });
    const seedComment45 = await createComments({
      commentbody: "The mature themes resonated with me.",
      origUserId: 7,
      origReviewId: 20,
    });
    const seedComment46 = await createComments({
      commentbody: "Creating my own levels was awesome! Go download the mods.",
      origUserId: 15,
      origReviewId: 6,
    });
    const seedComment47 = await createComments({
      commentbody: "Combat felt satisfying and exhilarating.",
      origUserId: 8,
      origReviewId: 29,
    });
    const seedComment48 = await createComments({
      commentbody: "Enemy variety kept me on edge.",
      origUserId: 23,
      origReviewId: 16,
    });
    const seedComment49 = await createComments({
      commentbody: "Multiplayer modes were a blast!",
      origUserId: 19,
      origReviewId: 27,
    });
    const seedComment50 = await createComments({
      commentbody: "Loot system kept me addicted, always upgrading.",
      origUserId: 28,
      origReviewId: 14,
    });
    const seedComment51 = await createComments({
      commentbody: "Loot system kept me addicted, always upgrading.",
      origUserId: 4,
      origReviewId: 8,
    });
    const seedComment52 = await createComments({
      commentbody: "Skill tree let me personalize gameplay.",
      origUserId: 11,
      origReviewId: 22,
    });
    const seedComment53 = await createComments({
      commentbody: "Realistic physics made it feel authentic.",
      origUserId: 17,
      origReviewId: 19,
    });
    const seedComment54 = await createComments({
      commentbody: "Exploring the open world was freedom.",
      origUserId: 29,
      origReviewId: 10,
    });
    const seedComment55 = await createComments({
      commentbody: "Boss battles had me at awe.",
      origUserId: 21,
      origReviewId: 7,
    });
    const seedComment56 = await createComments({
      commentbody: "The story kept me hooked!",
      origUserId: 1,
      origReviewId: 28,
    });
    const seedComment57 = await createComments({
      commentbody: "Action, stealth, and exploration combined!",
      origUserId: 13,
      origReviewId: 29,
    });
    const seedComment58 = await createComments({
      commentbody: "Online competition was fair and thrilling.",
      origUserId: 25,
      origReviewId: 3,
    });
    const seedComment59 = await createComments({
      commentbody: "The lore immersed me completely.",
      origUserId: 4,
      origReviewId: 5,
    });
    const seedComment60 = await createComments({
      commentbody: "Multiplayer created a lively gaming community.",
      origUserId: 18,
      origReviewId: 13,
    });

    console.log("Finished seed comments.");
    //end of seed comments section

    client.end();
    console.log("Finished running build database with all seed data.");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  fetchAllGames,
  fetchGameById,
  fetchGameByStudio,
  createNewGame,
  fetchGameByOurscore,
  fetchAllGamesByTitle,
  fetchGameByGenre,
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
  deleteReview,
  fetchAllReviewsByUserId,
  fetchAllReviewsByGameId,

  createComments,
  fetchAllComments,
  fetchAllCommentsByUserId,
  fetchAllCommentsByReviewId,
  fetchCommentById,
  updateComment,
  deleteComment,

  buildDatabase,
};
