const fs = require("fs");
const pool = require('./db')
const fastcsv = require("fast-csv");
const express = require('express');

const app = express();
app.use(express.json());

// Storing countries.csv file into database
let stream1 = fs.createReadStream("countries.csv");
let csvData1 = [];
let csvStream1 = fastcsv
  .parse()
  .on("data", function(data) {
    csvData1.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData1.shift();

    const query = "INSERT INTO countries (code,name,native,phone,continent,capital,currency,languages) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";

    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData1.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              //console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });
stream1.pipe(csvStream1);

// Storing languages.csv file into database
let stream2 = fs.createReadStream("languages.csv");
let csvData2 = [];
let csvStream2 = fastcsv
  .parse()
  .on("data", function(data) {
    csvData2.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData2.shift();

    const query = "INSERT INTO languages (code,name,native, rtf) VALUES ($1, $2, $3, $4)";

    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData2.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              //console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });
stream2.pipe(csvStream2);

// Storing continents.csv file into database
let stream = fs.createReadStream("continents.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    const query = "INSERT INTO continents (code, name) VALUES ($1, $2)";

    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              //console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);

// Performing query through express route
app.get('/info' , (req , res) => {
    const {code} = req.body;
    //console.log(code);
    pool.query('SELECT name, native, capital, currency, languages FROM countries WHERE code = $1' , [code], (error, result) => {
        if (error) {
          throw error
        }
        res.status(200).json(result.rows)
    })
})

const port = 8000

app.listen(port , () => {
    console.log(`App is running at ${port}`)
})