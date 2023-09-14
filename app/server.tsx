import axios from "axios";

// Make a GET request to retrieve data from the server
axios
  .get("http://your_server_ip:3000/api/getData")
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
  
const express = require("express");
const mysql = require("mysql");

const app = express();

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "muniserve",
});

// Define API endpoints
app.get("/api/getData", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Other endpoints can be added similarly

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
