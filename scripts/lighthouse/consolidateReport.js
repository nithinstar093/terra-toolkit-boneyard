const reportHtml = (metrics, tableRows) => (
    `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Lighthouse Report</title>
          <style>
            .header {
              background-color: #014979;
              border: 1px solid #bfbfbf;
              box-shadow: 0 0 2px 1px rgb(170, 170, 170);
              color: #fff;
              font-family: arial, sans-serif;
              font-weight: bold;    
              text-align: center;
              width: 100%;
            }
            .perf_score_pass a {
              color: #0cce6b;
            }
            .perf_score_fail a {
              color: #ff4e42;
            }
            .perf_score_avg a {
              color: #ffa400;
            }
            .pass_status {
              color: #0cce6b;
            }
            .fail_status {
              color: #ff4e42;
            }
            table {
              font-family: arial, sans-serif;
              border-collapse: collapse;
              width: 100%;
            }
            th {
              background: #f1f1f2;
              border: 2px solid #bfbebe;
              padding: 8px;
              text-align: left;
            }
            td{
              border: 1px solid #bfbebe;
              text-align: left;
              padding: 8px;
            }
            tr:nth-child(even) {
              background-color: #f3f3f3;
            }
         </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h4> Light House Consolidate Report </h4>
              <p> Total number of Tests : ${metrics.numberOfTestsAboveAvg + metrics.numberOfTestsBelowAvg + metrics.numberOfTestsEqualToAvg} </p>
              <p> Number of tests equal / above 90 : ${metrics.numberOfTestsAboveAvg} </p>
              <p> Number of tests equal / above 70 : ${metrics.numberOfTestsEqualToAvg} </p>
              <p> Number of tests below 70 : ${metrics.numberOfTestsBelowAvg} </p>
            </div>
            <table>
              <tr>
                <th>Test Name</th>
                <th>Performance Score</th>
              </tr>
              ${tableRows}
            </table>
          </div>
        </body>
      </html>`
  );
  
  module.exports = reportHtml;
