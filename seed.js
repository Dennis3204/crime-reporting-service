import { dbConnection, closeConnection } from "./src/config/mongoConnection.js";
import * as collections from "./src/config/mongoCollections.js";
import * as usersData from "./src/data/users.js";
import * as reportsData from "./src/data/reports.js";

const seed = async () => {
  const db = await dbConnection();
  console.log("Connected to database");


  const usersCollection = await collections.users();
  const reportsCollection = await collections.reports();

  console.log("Dropping existing data...");
  await usersCollection.deleteMany({});
  await reportsCollection.deleteMany({});

  // Create some users

  console.log("Creating users...");

  const user1 = await usersData.createUser(
    "alice",
    "Alice",
    "Smith",
    23,
    "Password123!",
    "alice@example.com",
    "NYC",
    "Some State",
    "11211"
  );

  const user2 = await usersData.createUser(
    "bob",
    "Bob",
    "Johnson",
    30,
    "Password123!",
    "bob@example.com",
    "NYC",
    "Some State",
    "11211"
  );

  console.log("Users created:", user1._id.toString(), user2._id.toString());

  // Create some reports

  console.log("Creating reports...");

  const report1 = await reportsData.createReport(user1._id.toString(),
    "Suspicious activity near my block",
    "Saw a person checking car door handles around 2am.",
    "SUSPICIOUS ACTIVITY",
    "NY",
    "Brooklyn",
    "Williamsburg",
    "11211",
    [],
    false
  );

  const report2 = await reportsData.createReport(user2._id.toString(),
    "Attempted bike theft",
    "Someone tried cutting my bike lock. They ran when confronted.",
    "LARCENY",
    "NY",
    "Manhattan",
    "Upper East Side",
    "10021",
    ["/public/uploads/reports/example1.jpg"],
    true
  );

  console.log("Reports created:", report1._id.toString(), report2._id.toString());


  await closeConnection();
  console.log("Database connection closed");
};

seed()
  .then(() => {
    console.log("Seeding complete");
  })
  .catch((e) => {
    console.error("Error during seeding:", e);
    closeConnection().then(() => {
      console.log("Connection closed due to error");
    });
  });
