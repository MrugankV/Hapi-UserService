// Import necessary modules
const { createUser } = require("../handlers/userHandlers"); // Update the path as needed
const User = require("../models/user"); // Ensure correct path to User model
const UserDetail = require("../models/userDetail"); // Ensure correct path to UserDetail model
const AuditLog = require("../models/auditLog"); // Ensure correct path to AuditLog model if applicable
const bcrypt = require("bcrypt");
const { userSchema } = require("../validations/validations"); // Update the path as needed
const { sendWelcomeEmail } = require("../helpers/emailService"); // Update the path to utility function

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

jest.mock("../models/auditLog", () => {
  return {
    create: jest.fn(),
  };
});

jest.mock("bcrypt");
jest.mock("../validations/validations"); // Update the path as needed
jest.mock("../helpers/emailService", () => ({
  sendWelcomeEmail: jest.fn(),
}));

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
    });
    expect(h.code).toHaveBeenCalledWith(400);
  });

  it("should return 400 for password complexity failure", async () => {
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
        password: Buffer.from("simplepassword").toString("base64"), // Password not meeting complexity
        aadhar: "123456789123",
        pan: "ABCDE1234F",
        mobile: "9876543210",
      },
    };

    userSchema.validate.mockReturnValue({
      error: null,
      value: request.payload,
    });

    const response = await createUser(request, h);

    expect(h.response).toHaveBeenCalledWith({
      message:
        "Password must be at least 8 characters long and include a mix of letters, numbers, and special characters.",
    });
    expect(h.code).toHaveBeenCalledWith(400);
  });

  it("should return 409 if duplicate user data is found", async () => {
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
        password: Buffer.from("Mrugank@123").toString("base64"),
        aadhar: "123456789123",
        pan: "ABCDE1234F",
        mobile: "9876543210",
      },
    };

    userSchema.validate.mockReturnValue({
      error: null,
      value: request.payload,
    });

    User.findOne.mockResolvedValue({ id: 1 });
    UserDetail.findOne.mockResolvedValue(null);

    const response = await createUser(request, h);

    expect(h.response).toHaveBeenCalledWith({
      message: "Duplicate Data",
      details: {
        emailExists: true,
        aadharExists: false,
        panExists: false,
      },
    });
    expect(h.code).toHaveBeenCalledWith(409);
  });

  it("should create a user successfully", async () => {
    const request = {
      auth: {
        credentials: {
          role: "admin",
          scopes: ["create:user"],
          userId: 1,
        },
      },
      payload: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: Buffer.from("Mrugank@123").toString("base64"), // Base64 encoded password
        aadhar: "123456789123",
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

    const auditLogMock = {
      action: "User Created",
      entity: "User",
      entityId: userPayload.id,
      changes: JSON.stringify({
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        role: request.payload.role,
      }),
      userId: request.auth.credentials.userId,
      createdAt: expect.any(Date), // Check for a date type
    };

    AuditLog.create.mockResolvedValue(auditLogMock);

    const response = await createUser(request, h);

    // Verify that the AuditLog.create was called with the correct parameters
    expect(AuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining(auditLogMock)
    );

    // Verify that the welcome email was sent
    expect(sendWelcomeEmail).toHaveBeenCalledWith(userPayload.email);
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
        password: Buffer.from("Mrugank@123").toString("base64"),
        aadhar: "123456789123",
        pan: "ABCDE1234F",
        mobile: "9876543210",
      },
    };

    userSchema.validate.mockReturnValue({
      error: null,
      value: request.payload,
    });

    bcrypt.hash.mockResolvedValue("hashedPassword");

    User.findOne.mockResolvedValue(null);
    UserDetail.findOne.mockResolvedValue(null);
    User.create.mockRejectedValue(new Error("Database Error")); // Simulate database error

    const response = await createUser(request, h);

    expect(h.response).toHaveBeenCalledWith({
      message: "Database Error",
      data: expect.any(Error),
    });
    expect(h.code).toHaveBeenCalledWith(402);
  });
});
