const express = require('express');
const Moniker = require('moniker'); // Used to generate random names
const mysql = require('mysql');
const app = express();
const port = 3000;

// Database configuration
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

// Create a connection to the database
const connection = mysql.createConnection(config);

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the application if DB connection fails
    }
    console.log('Successfully connected to the database.');
});

// Route to handle requests
app.get('/', (req, res) => {
    // Generate a random name
    const name = Moniker.choose();

    // Insert the new name into the database
    const insertQuery = `INSERT INTO people(name) VALUES(?)`;
    connection.query(insertQuery, [name], (insertErr) => {
        if (insertErr) {
            console.error('Error inserting data:', insertErr);
            res.status(500).send('Error inserting data.');
            return;
        }

        console.log(`Name "${name}" inserted into the database.`);

        // Fetch all names from the database
        const selectQuery = `SELECT id, name FROM people`;
        connection.query(selectQuery, (selectErr, results) => {
            if (selectErr) {
                console.error('Error fetching data:', selectErr);
                res.status(500).send('Error fetching data.');
                return;
            }

            // Construct HTML response
            let markup = `<h1>Full Cycle Rocks!</h1>`;
            results.forEach(row => {
                markup += `<p>${row.name}</p>\n`;
            });

            res.send(markup);
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
