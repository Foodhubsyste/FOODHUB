const fs = require("fs");
const path = require("path");
const { config, validateProductionConfig } = require("./config");

describe("Week 11 — release readiness", () => {
  test("configuration exposes the expected production controls", () => {
    expect(typeof config.port).toBe("number");
    expect(typeof config.dataFile).toBe("string");
    expect("adminUsername" in config).toBe(true);
    expect("adminPassword" in config).toBe(true);
  });

  test("development configuration retains local demo credentials", () => {
    expect(config.isProduction).toBe(false);
    expect(config.adminUsername).toBe("admin");
    expect(config.adminPassword).toBe("foodhub123");
  });

  test("production validation refuses missing admin credentials", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalUser = process.env.ADMIN_USERNAME;
    const originalPass = process.env.ADMIN_PASSWORD;

    try {
      process.env.NODE_ENV = "production";
      delete process.env.ADMIN_USERNAME;
      delete process.env.ADMIN_PASSWORD;

      jest.resetModules();
      const freshConfig = require("./config");
      expect(() => freshConfig.validateProductionConfig()).toThrow("Production configuration is incomplete");
    } finally {
      if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = originalNodeEnv;

      if (originalUser === undefined) delete process.env.ADMIN_USERNAME;
      else process.env.ADMIN_USERNAME = originalUser;

      if (originalPass === undefined) delete process.env.ADMIN_PASSWORD;
      else process.env.ADMIN_PASSWORD = originalPass;
    }
  });

  test("environment example is tracked and real env files stay ignored", () => {
    expect(fs.existsSync(path.join(__dirname, ".env.example"))).toBe(true);
    const ignore = fs.readFileSync(path.join(__dirname, ".gitignore"), "utf8");
    expect(ignore).toContain(".env");
    expect(ignore).toContain("!.env.example");
  });

  test("deployment documentation is present", () => {
    expect(fs.existsSync(path.join(__dirname, "docs", "deployment.md"))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, "docs", "RELEASE_CHECKLIST.md"))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, "docs", "ai-notes", "week-11.md"))).toBe(true);
  });
});
