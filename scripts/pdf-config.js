export default {
  stylesheet: `
    body {
      font-family: 'Arial', sans-serif;
      font-size: 12px;
      line-height: 1.6;
      max-width: 100%;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      font-size: 24px;
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }

    h2 {
      font-size: 20px;
      color: #2c3e50;
      margin-top: 30px;
    }

    h3 {
      font-size: 16px;
      color: #34495e;
      margin-top: 25px;
    }

    h4 {
      font-size: 14px;
      color: #34495e;
      margin-top: 20px;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 11px;
      background-color: #f7f9fa;
      padding: 2px 5px;
      border-radius: 3px;
    }

    pre {
      background-color: #f7f9fa;
      padding: 15px;
      border-radius: 5px;
      white-space: pre-wrap;
    }

    ul, ol {
      padding-left: 25px;
    }

    li {
      margin: 5px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f7f9fa;
    }
  `,
  pdf_options: {
    format: "A4",
    margin: "20mm",
    printBackground: true,
    headerTemplate: "<div></div>",
    footerTemplate:
      '<div style="font-size: 10px; margin: 0 auto; text-align: center; color: #666;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    displayHeaderFooter: true,
    preferCSSPageSize: true,
  },
  dest: "docs/BrickElaCuts-Documentation.pdf",
};
