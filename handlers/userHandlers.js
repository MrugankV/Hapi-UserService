const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { sequelize, DataTypes } = require("../dbConfig");
const { encryptdata } = require("../helpers/encrypt");

const sendWelcomeEmail = require("../helpers/emailService");
const AuditLog = require("../models/auditLog");
const User = require("../models/user");
const UserDetail = require("../models/userDetail");
const customJoi = require("../validations/customValidators"); // Import the custom Joi instance if you want to use it for different schemas
const userSchema = require("../validations/validations"); // Import the user schema directly if you created it separately

const createUser = async (request, h) => {
  console.log(`Request Nody-${request}`);
  const { role, scopes } = request.auth.credentials;
  if (role !== "admin" && !scopes.includes("create:user")) {
    return h
      .response({
        message:
          "You need to be an admin to access this resource/Permission Missing",
        role,
      })
      .code(403);
  }

  // Proceed with the creation logic
  try {
    let userNew;
    const { error, value } = userSchema.validate(request.payload);

    if (error) {
      console.error("Validation Error:", error);
      throw { error: "Validation error" };
    }

    const { firstName, lastName, email, password, aadhar, pan, role, mobile } =
      value;
    const saltRounds = 10;
    let base64_pass = Buffer.from(password, "base64").toString("utf-8");
    const passwordComplexity =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordComplexity.test(password)) {
      return h
        .response({
          message:
            "Password must be at least 8 characters long and include a mix of letters, numbers, and special characters.",
        })
        .code(400);
    }
    //Password AES Decryption check
    // try {
    //   const decryptpass = await decryptdata(password);
    // } catch (derror) {
    //   return h
    //     .response({
    //       message:
    //         "Password in Plain Text.Decrypt Error",
    //       role,
    //     })
    //     .code(412);
    // }

    const hashedPassword = await bcrypt.hash(base64_pass, saltRounds);
    const encryptedaadhar = await encryptdata(aadhar);
    const encryptedpan = await encryptdata(pan);
    try {
      // let usercheck = await User.findOne({
      //   where: {
      //     email: email,
      //   },
      // });

      // let aadharcheck = await UserDetail.findOne({
      //   where: {
      //     aadhar: aadhar,
      //   },
      // });

      // let pancheck = await UserDetail.findOne({
      //   where: {
      //     pan: pan,
      //   },
      // });
      // if (usercheck || pancheck || aadharcheck) {
      //   throw { error: "Duplicate Data" };
      // }

      const [usercheck, aadharcheck, pancheck] = await Promise.all([
        User.findOne({ where: { email } }),
        UserDetail.findOne({ where: { aadhar } }),
        UserDetail.findOne({ where: { pan } }),
      ]);

      if (usercheck || pancheck || aadharcheck) {
        return h
          .response({
            message: "Duplicate Data",
            details: {
              emailExists: !!usercheck,
              aadharExists: !!aadharcheck,
              panExists: !!pancheck,
            },
          })
          .code(409);
      }

      // const newUser = await User.create({
      //   firstName: firstName,
      //   lastName: lastName,
      //   email: email,
      //   role: role,
      //   password: hashedPassword,
      // });

      // await UserDetail.create({
      //   aadhar: encryptedaadhar,
      //   pan: encryptedpan,
      //   mobile: mobile,
      //   userId: newUser.id, // Use the userId from the created User
      // });

      const newUser = await sequelize.transaction(async (t) => {
        const createdUser = await User.create(
          { firstName, lastName, email, role, password: hashedPassword },
          { transaction: t }
        );

        await UserDetail.create(
          {
            aadhar: encryptedaadhar,
            pan: encryptedpan,
            mobile,
            userId: createdUser.id,
          },
          { transaction: t }
        );
        userNew = createdUser;
        return createdUser;
      });
    } catch (e) {
      console.log(e);

      return h.response({ message: "Database Error", data: e }).code(402);
    }
    await AuditLog.create({
      action: "User Created",
      entity: "User",
      entityId: userNew.id, // Assuming `newUser` is the newly created user object
      changes: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
      }), // Use appropriate fields to log the changes
      userId: request.auth.credentials.userId, // Assuming this is the authenticated user's ID
      createdAt: new Date(), // Timestamp when the action was performed
    });

    await sendWelcomeEmail(userNew.email);

    return h
      .response({
        message: `User ${userNew.firstName} ${userNew.lastName} created successfully !`,
      })
      .code(201);
  } catch (errors) {
    console.log(errors);
    return h.response({ message: "Error", data: errors.error }).code(400);
  }
};

const loginUser = async (request, h) => {
  const { username, password } = request.payload;

  const user = users[username];
  if (!user) {
    return h.response({ error: "User not found" }).code(404);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return h.response({ error: "Invalid credentials" }).code(401);
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return h.response({ message: "Login successful", token }).code(200);
};

const getUser = async (request, h) => {
  const { id } = request.params;

  const user = users[id];
  if (!user) {
    return h.response({ error: "User not found" }).code(404);
  }

  return h.response(user).code(200);
};

module.exports = {
  createUser,
  loginUser,
  getUser,
};
