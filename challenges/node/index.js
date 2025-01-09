const express = require('express')
var Moniker = require('moniker');
const mysql = require('mysql');
const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

// Create MySQL connection
const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password
});

// Ensure the database and table exist
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');

    // Create the database if it doesn't exist
    connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`, (err) => {
        if (err) throw err;
        console.log(`Database "${config.database}" ensured.`);

        // Switch to the created database
        connection.changeUser({ database: config.database }, err => {
            if (err) throw err;

            // Create the "people" table if it doesn't exist
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS people (
                    id INT NOT NULL AUTO_INCREMENT,
                    name VARCHAR(255) NOT NULL,
                    PRIMARY KEY (id)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
            `;
            connection.query(createTableQuery, (err) => {
                if (err) throw err;
                console.log('Table "people" ensured.');

                // Insert a new record
                const name = Moniker.choose();
                const sqlInsert = `INSERT INTO people(name) VALUES ('${name}')`;
                connection.query(sqlInsert, (err) => {
                    if (err) throw err;
                    console.log(`Inserted: ${name}`);
                });
            });
        });
    });
});

// Query and serve data
app.get('/', (req, res) => {
    const sqlQuery = `SELECT id, name FROM people`;
    connection.query(sqlQuery, (err, result) => {
        if (err) throw err;

        let markup = `<h1>Full Cycle</h1>`;
        result.forEach(row => {
            markup += `<p>${row.name}</p>\n`;
        });

        res.send(markup);
    });
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
