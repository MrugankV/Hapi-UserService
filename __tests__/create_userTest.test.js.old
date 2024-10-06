// Import necessary modules
const { createUser } = require("../handlers/userHandlers"); // Update the path as needed
const User = require("../models/user"); // Ensure correct path to User model
const UserDetail = require("../models/userDetail"); // Ensure correct path to UserDetail model
const bcrypt = require("bcrypt");
const { userSchema } = require("../validations/validations"); // Update the path as needed

// Mocking necessary functions and modules
jest.mock("../models/user", () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    hasOne: jest.fn(), // Mock association
  };
});

jest.mock("../models/userDetail", () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    belongsTo: jest.fn(), // Mock association
  };
});

jest.mock("bcrypt");
jest.mock("../validations/validations"); // Update the path as needed

describe("createUser", () => {
  const h = {
    response: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 403 if user is not admin and does not have create:user scope", async () => {
    const request = {
      auth: {
        credentials: {
          role: "user",
          scopes: [],
        },
      },
      payload: {},
    };

    const response = await createUser(request, h);

    expect(h.response).toHaveBeenCalledWith({
      message:
        "You need to be an admin to access this resource/Permission Missing",
      role: "user",
    });
    expect(h.code).toHaveBeenCalledWith(403);
    expect(response).toBe(h);
  });

  it("should return 400 for validation error", async () => {
    const request = {
      auth: {
        credentials: {
          role: "admin",
          scopes: ["create:user"],
        },
      },
      payload: {},
    };

    userSchema.validate.mockReturnValue({
      error: { details: "Validation error" },
    });

    const response = await createUser(request, h);

    expect(h.response).toHaveBeenCalledWith({
      message: "Error",
      data: "Validation error",
      // detail: { error: { details: "Validation error" } },
    });
    expect(h.code).toHaveBeenCalledWith(400);
  });

  it("should create a user successfully", async () => {
    const request = {
      auth: {
        credentials: {
          role: "admin",
          scopes: ["create:user"],
        },
      },
      payload: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: Buffer.from("password").toString("base64"), // Base64 encoded password
        aadhar: "1234-5678-9123",
        pan: "ABCDE1234F",
        mobile: "9876543210",
      },
    };

    const userPayload = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "admin",
      password: "hashedPassword",
    };

    const userDetailPayload = {
      id: 1,
      aadhar: "encryptedAadhar",
      pan: "encryptedPan",
      mobile: "9876543210",
      userId: 1,
    };

    userSchema.validate.mockReturnValue({
      error: null,
      value: request.payload,
    });

    bcrypt.hash.mockResolvedValue("hashedPassword");

    User.findOne.mockResolvedValue(null); // No duplicate user
    UserDetail.findOne.mockResolvedValue(null); // No duplicate user detail

    User.create.mockResolvedValue(userPayload);
    UserDetail.create.mockResolvedValue(userDetailPayload);

    const response = await createUser(request, h);

    expect(h.response).toHaveBeenCalledWith({
      message: `User John Doe created successfully !`,
    });
    expect(h.code).toHaveBeenCalledWith(201);
  });

  it("should return 402 for database error", async () => {
    const request = {
      auth: {
        credentials: {
          role: "admin",
          scopes: ["create:user"],
        },
      },
      payload: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        password: Buffer.from("password").toString("base64"), // Base64 encoded password
        aadhar: "1234-5678-9123",
        pan: "ABCDE1234F",
        mobile: "9876543210",
      },
    };

    userSchema.validate.mockReturnValue({
      error: null,
      value: request.payload,
    });

    bcrypt.hash.mockResolvedValue("hashedPassword");

    User.findOne.mockResolvedValue(null); // No duplicate user
    UserDetail.findOne.mockResolvedValue(null); // No duplicate user detail

    User.create.mockRejectedValue(new Error("Database Error")); // Simulate database error

    const response = await createUser(request, h);

    expect(h.response).toHaveBeenCalledWith({
      message: "Database Error",
      data: expect.any(Error),
    });
    expect(h.code).toHaveBeenCalledWith(402);
  });
});
