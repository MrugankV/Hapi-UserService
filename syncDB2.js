// syncDb.js
const { sequelize } = require("./dbConfig"); // Import your sequelize instance
const AuditLog = require("./models/auditLog"); // Import the AuditLog model

// Define a sample audit log entry
const sampleAuditLogEntry = {
  action: "Deplyment",
  entity: "User",
  entityId: 1, // ID of the created user (use actual ID if available)
  changes: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "user",
  },
  userId: 1, // ID of the user who performed the action (use actual ID if available)
  createdAt: new Date(),
};

// Sync the database and insert the sample record
async function syncDb() {
  try {
    await sequelize.sync(); // Sync the database (create tables if not exist)
    await AuditLog.create(sampleAuditLogEntry); // Create the audit log entry
    console.log("Audit log entry created successfully.");
  } catch (error) {
    console.error("Error creating audit log entry:", error);
  } finally {
    await sequelize.close(); // Close the database connection
  }
}

syncDb();
