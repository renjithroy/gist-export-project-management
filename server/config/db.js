const mysql = require('mysql2/promise');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const caCert = fs.readFileSync('./mysql-ca.crt');

// Set up the MySQL connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: caCert
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


async function queryDatabase() {
  try {
      const connection = await db.getConnection();
    //   const [result] = await connection.query('SELECT * FROM users');

    //   console.log(result);

      connection.release();
      if(connection) console.log("Connected to Aiven MySQL");
  } catch (error) {
      console.error('Error connecting to Aiven MySQL:', error);
  }
}

// Call the function
queryDatabase();

module.exports = db;