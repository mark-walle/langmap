This nodeJS express-gen Leaflet app recreates the presentation and is based on source KML files accessed at [First Peoples' Language Map of B.C.](http://maps.fphlcc.ca/) and JSONified with help from [mapbox/togeojson](https://github.com/mapbox/togeojson) and manually sanitized to correct names.

The demo solution accesses the data from an AWS RDS PostGIS database, the credentials for which are hidden from this repository.

First run `npm install` and then set the following environment variables:

```
RDS_USER=...
RDS_PASS=...
RDS_ADDR=...
```