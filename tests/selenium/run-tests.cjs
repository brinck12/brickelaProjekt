const Mocha = require("mocha");
const fs = require("fs");
const path = require("path");

// Create a new Mocha instance
const mocha = new Mocha({
  timeout: 30000, // Increase timeout for Selenium tests
  reporter: "spec",
});

// Note: The application is running at http://localhost:5173
// The API endpoints are at http://localhost/project/src/api

// Get all test files
const testDir = __dirname;
fs.readdirSync(testDir)
  .filter((file) => file.endsWith(".test.cjs"))
  .forEach((file) => {
    mocha.addFile(path.join(testDir, file));
  });

// Run the tests
mocha.run((failures) => {
  process.exitCode = failures ? 1 : 0;
});
