const crypto = require("crypto");
const { success, failure } = require("../utils/response");

function createAuthController(tokens, username, password) {
  const login = (req, res) => {
    const suppliedUsername = String(req.body.username || "").trim();
    const suppliedPassword = String(req.body.password || "");
    if (suppliedUsername !== username || suppliedPassword !== password) {
      return failure(res, 401, "Invalid admin username or password");
    }
    const token = crypto.randomBytes(24).toString("hex");
    tokens.add(token);
    return success(res, 200, { token, username }, "Admin login successful");
  };

  const logout = (req, res) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (token) tokens.delete(token);
    return success(res, 200, null, "Logged out");
  };

  return { login, logout };
}

module.exports = { createAuthController };
