const { sequelize, DataTypes } = require("../dbConfig");
const User = require("./user"); // Import the User model to create association

// Define the UserDetail model
const UserDetail = sequelize.define(
  "UserDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    aadhar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [10, 15], // Ensures mobile number is between 10 and 15 digits
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User, // Reference the User model
        key: "id",
      },
    },
  },
  {
    tableName: "user_details",
    timestamps: true,
  }
);

// Establish association: One User can have one UserDetail
User.hasOne(UserDetail, {
  foreignKey: "userId",
  as: "userDetail", // Alias for association
});
UserDetail.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = UserDetail;
