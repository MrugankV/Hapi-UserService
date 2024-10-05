const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
// const { sequelize, DataTypes } = require("../index");
const { encryptdata } = require("../helpers/encrypt");
const { decryptdata } = require("../helpers/decrypt");
const User = require("../models/user");
const UserDetail = require("../models/userDetail");

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required(),
  mobile: Joi.string().min(10).max(10).optional(),
  aadhar: Joi.string().required(),
  pan: Joi.string().required(),
  // contact_no: Joi.number().integer().min(10).max(10).optional,
  role: Joi.string().valid("user", "admin").optional(),
  // password: Joi.string().min(8).required(),
});

//
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
    const { error, value } = userSchema.validate(request.payload);
    console.log(value);
    if (error) {
      console.error("Validation Error:", error);
      throw { error: "Validation error" };
    }

    const { firstName, lastName, email, password, aadhar, pan, role, mobile } =
      value;
    const saltRounds = 10;

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
    let base64_pass = Buffer.from(password, "base64").toString("utf-8");
    const hashedPassword = await bcrypt.hash(base64_pass, saltRounds);
    const encryptedaadhar = await encryptdata(aadhar);
    const encryptedpan = await encryptdata(pan);
    try {
      let usercheck = await User.findOne({
        where: {
          email: email,
        },
      });

      let aadharcheck = await UserDetail.findOne({
        where: {
          aadhar: aadhar,
        },
      });

      let pancheck = await UserDetail.findOne({
        where: {
          pan: pan,
        },
      });
      if (usercheck || pancheck || aadharcheck) {
        throw { error: "Duplicate Data" };
      }
      const newUser = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        password: hashedPassword,
      });

      await UserDetail.create({
        aadhar: encryptedaadhar,
        pan: encryptedpan,
        mobile: mobile,
        userId: newUser.id, // Use the userId from the created User
      });
    } catch (e) {
      console.log(e);
      return h.response({ message: "Database Error", data: e }).code(402);
    }

    return h
      .response({
        message: `User ${firstName} ${lastName} created successfully !`,
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
