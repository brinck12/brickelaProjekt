const fs = require("fs");
const path = require("path");
const markdownpdf = require("markdown-pdf");

const options = {
  cssPath: path.join(__dirname, "pdf-style.css"),
  remarkable: {
    html: true,
    breaks: true,
    syntax: ["code", "fence"],
  },
  paperFormat: "A4",
  paperBorder: "1in",
};

const inputFile = path.join(__dirname, "../docs/documentation.md");
const outputFile = path.join(
  __dirname,
  "../docs/BrickElaCuts-Documentation.pdf"
);

markdownpdf(options)
  .from(inputFile)
  .to(outputFile, function () {
    console.log("PDF generated successfully!");
  });
