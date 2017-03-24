var express = require('express');
var router = express.Router();

/* either set these environment variables, or replace as strings */
var user = process.env.RDS_USER,
    pass = process.env.RDS_PASS,
    addr = process.env.RDS_ADDR;

var pg = require("pg");

var conString = "postgres://"+user+":"+pass+"@"+addr;

var languages_query = "\
	SELECT row_to_json(fc) \
	FROM ( SELECT 'FeatureCollection' \
	As type, array_to_json(array_agg(f)) \
	As features FROM ( SELECT 'Feature' \
	As type, ST_AsGeoJSON(lg.geom)::json \
	As geometry, row_to_json((id, name, fill)) \
	As properties FROM mapgeo \
	As lg) As f) As fc";

/* GET the main page */
router.get('/', function(req, res) {
    var client = new pg.Client(conString); // Setup our Postgres Client
    client.connect(); // connect to the client
    var query = client.query(languages_query); // Run our Query
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    // Pass the result to the map page
    query.on("end", function (result) {
        var data = result.rows[0].row_to_json // Save the JSON as variable data
        res.render('map', {
            title: "First People's Lanauge Map of BC in Leaflet/PostGIS", // Give a title to our page
            jsonData: data // Pass data to the View
        });
    });
});

/* GET Postgres JSON data */
router.get('/data', function (req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(languages_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows[0].row_to_json);
        res.end();
    });
});

module.exports = router;
