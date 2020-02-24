require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');

// Database Client
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();

// Application Setup
const app = express();

app.use(express.json()); // enable reading incoming json data
app.use(express.urlencoded({ extended: true }));// for parsing application/x-www-form-urlencoded
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request

// type and shoes table route
app.get('/api/shoes', async (req, res) => {
    try {
        const result = await client.query(`
            SELECT shoes.*, type.name AS type
            From shoes 
            JOIN types
            ON shoe.type_id = types.id;`);
        res.json(result.rows);
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            error: err.message || err
        });
    }
});

// POST to the shoes Tables
app.post('/api/shoes', async (req, res) => {
    // using req.body instead of req.params or req.query (which belong to /GET requests)
    try {
        console.log(req.body);
        const result = await client.query(`
            INSERT INTO shoes (name, type_id, url, brand, laces)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *; `,
            // pass the values in an array so that pg.Client can sanitize them
            [req.body.name, req.body.typeId, req.body.url, req.body.brand, req.body.laces]
        );
        res.json(result.rows[0]); // return just the first result of our query
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

// shoes search query by id
// LOOK AT shoe instead of shoes on Monday
app.get('/api/shoes/:shoeId', async (req, res) => {
    try {

        const result = await client.query(
            `SELECT * from shoes WHERE shoes.id=$1, [req.params.shoeId]`);

        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

// shoes route
app.get('/api/types', async (req, res) => {
    try {
        const result = await client.query(`SELECT * FROM types ORDER by name;`);

        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});


// 404 catch all
app.get('*', (req, res) => res.send('404 error!!'));


module.exports = { app, };