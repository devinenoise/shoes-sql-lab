require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;

// import our seed data:
const types = require('./types.js');
const shoes = require('./shoes.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();

        // First save types and get each returned row which has
        // the id of the type. Notice use of RETURNING:
        const savedTypes =

            await Promise.all(
                types.map(async type => {
                    const result = await client.query(`
                    INSERT INTO types (name)
                    VALUES ($1)
                    RETURNING *;`, [type]);

                    return result.rows[0];
                })
            );


        await Promise.all(
            shoes.map(shoe => {

                // Find the corresponding type id
                // find the id of the matching shoe type!
                const type = savedTypes.find(type => {
                    console.log(type);
                    return type.name === shoe.type;
                });

                return client.query(`
                    INSERT INTO shoes (name, type_id, url, brand, laces)
                    VALUES ($1, $2, $3, $4, $5);`, [shoe.name, type.id, shoe.url, shoe.brand, shoe.laces]);

            })
        );

        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }

}