const reportHtml = (numberOfTestsFailed, numberOfTestsPassed, averageScore, tableRows) => (
  `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
        <title>Lighthouse Report</title>
        <style>
          .header {
            border: 1px solid #BFBFBF;
            background-color: #014979;
            box-shadow: 0px 0px 2px 1px #aaaaaa;
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
            text-align: left;
            padding: 8px;
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
            <h4> Light House Consildate Report </h4>
            <p> Average performance score : ${averageScore} </p>
            <p> Number of tests equal / above average performance score : ${numberOfTestsPassed} </p>
            <p> Number of tests below average performance score : ${numberOfTestsFailed} </p>
          </div>
          <table>
            <tr>
              <th>TestName</th>
              <th>Existing/Avg PerfScore</th>
              <th>New PerfScore</th>
              <th>TestStatus</th>
            </tr>
            ${tableRows}
          </table>
        </div>
      </body>
    </html>`);

module.exports = reportHtml;
