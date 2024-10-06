const { sequelize } = require("./dbConfig");
const User = require("./models/user");
const UserDetail = require("./models/userDetail");

const syncDatabase = async () => {
  try {
    // await sequelize.sync({ force: true }); // Use force: true to drop and recreate tables
    console.log("Database synced successfully.");

    // Optional: Create sample data for testing
    const newUser = await User.create({
      firstName: "Mv",
      lastName: "1234",
      email: "bk123@gmail.com",
      role: "admin",
      password: "$2b$10$CuH6Io7Tlxz4HugU4.tXYeOSm0JOZ73G31Y1sMUVGSFnxqhbuoveK",
    });

    await UserDetail.create({
      aadhar: "123q4534646464",
      pan: "3343424242424",
      mobile: "7977401967",
      userId: newUser.id, // Use the userId from the created User
    });

    console.log("Sample user and user detail created.");
  } catch (err) {
    console.error("Error syncing database: ", err);
  } finally {
    await sequelize.close(); // Close the connection when done
  }
};

syncDatabase();
