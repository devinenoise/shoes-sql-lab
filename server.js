require('dotenv').config();
const express = require('express');
const request = require('superagent');
const app = express();

const cors = require('cors');
app.use(cors());

// location route
app.get('/api/shoes', async (req, res) => {
    try {

        const URL = (`${process.env.DATABASE_URL}`);
        const shoeData = await request.get(URL);

        const result = shoeData.body[0];

        // update the state of the lat and long

        res.json(
            {
                name: result.name,
                type: result.type,
                image: result.url,
                brand: result.type,
                laces: result.laces,
            });
    } catch (err) {
        res.status(500).send('Sorry something went wrong, please try again');
    }
});