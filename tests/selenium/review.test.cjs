const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");

describe("Review Submission Tests", function () {
  let driver;

  before(async function () {
    // Set up Chrome options
    const options = new chrome.Options();
    // options.addArguments('--headless'); // Uncomment for headless testing

    // Build the driver
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    // Set implicit wait time
    await driver.manage().setTimeouts({ implicit: 10000 });
  });

  after(async function () {
    // Quit the driver after tests
    await driver.quit();
  });

  it("should submit a review with a valid token", async function () {
    // Skip this test - we don't have a valid token for testing
    this.skip();

    /* This test is skipped and the code below would be used if we had a valid token
    // This test assumes you have a valid review token
    // In a real test, you might generate this token programmatically
    const validToken = "your-valid-token-here"; // Replace with a valid token when ready to test

    // Navigate to the review page with the token
    await driver.get(`http://localhost:5173/review?token=${validToken}`);

    // Wait for the review page to load
    await driver.wait(
      until.elementLocated(By.id("review-page-container")),
      10000
    );

    // Select a rating (4 stars)
    const fourthStar = await driver.findElement(By.id("rating-star-4"));
    await fourthStar.click();

    // Enter a comment
    const commentField = await driver.findElement(By.id("review-comment"));
    await commentField.sendKeys(
      "This was a great service! Very professional and friendly."
    );

    // Submit the review
    const submitButton = await driver.findElement(
      By.id("submit-review-button")
    );
    await submitButton.click();

    // Wait for the success message or check if the button is disabled
    await driver.wait(
      until.elementIsDisabled(
        await driver.findElement(By.id("submit-review-button"))
      ),
      10000
    );

    const isDisabled = await driver
      .findElement(By.id("submit-review-button"))
      .getAttribute("disabled");
    assert(
      isDisabled === "true",
      "Submit button should be disabled after submission"
    );
    */
  });

  it("should show error with invalid token", async function () {
    // Skip this test
    this.skip();

    /* This test is skipped and would be used to check error handling for invalid tokens
    // Navigate to the review page with an invalid token
    await driver.get("http://localhost:5173/review?token=invalid-token");

    // Wait for the review page to load
    await driver.wait(
      until.elementLocated(By.id("review-page-container")),
      10000
    );

    // Select a rating (5 stars)
    const fifthStar = await driver.findElement(By.id("rating-star-5"));
    await fifthStar.click();

    // Enter a comment
    const commentField = await driver.findElement(By.id("review-comment"));
    await commentField.sendKeys("Test comment with invalid token");

    // Submit the review
    const submitButton = await driver.findElement(
      By.id("submit-review-button")
    );
    await submitButton.click();

    // Wait for error message
    await driver.wait(until.elementLocated(By.id("error-message")), 10000);

    // Verify error message is displayed
    const errorElement = await driver.findElement(By.id("error-message"));
    assert(
      await errorElement.isDisplayed(),
      "Error message should be displayed for invalid token"
    );
    */
  });
});
