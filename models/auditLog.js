// models/AuditLog.js
const { sequelize, DataTypes } = require("../dbConfig");

const AuditLog = sequelize.define(
  "AuditLog",
  {
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Type of action performed (e.g., CREATE, UPDATE, DELETE)",
    },
    entity: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Entity that the action was performed on (e.g., User, Order)",
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID of the entity record that was changed",
    },
    changes: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "JSON object describing the changes made",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID of the user who performed the action",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "Timestamp when the action was performed",
    },
  },
  {
    tableName: "audit_logs",
    timestamps: false,
  }
);

module.exports = AuditLog;
