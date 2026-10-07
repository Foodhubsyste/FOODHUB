const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

const config = {
  isProduction,
  port: Number(process.env.PORT) || 4444,
  adminUsername: process.env.ADMIN_USERNAME || (isProduction ? "" : "admin"),
  adminPassword: process.env.ADMIN_PASSWORD || (isProduction ? "" : "foodhub123"),
  dataFile: process.env.DATA_FILE
    ? path.resolve(process.env.DATA_FILE)
    : path.join(__dirname, "..", "data", "db.json")
};

function validateProductionConfig() {
  if (!config.isProduction) return;

  const missing = [];
  if (!config.adminUsername) missing.push("ADMIN_USERNAME");
  if (!config.adminPassword) missing.push("ADMIN_PASSWORD");

  if (missing.length) {
    throw new Error(
      "Production configuration is incomplete. Set: " + missing.join(", ")
    );
  }
}

module.exports = { config, validateProductionConfig };
