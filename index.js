const config = require('config');
const express = require('express');
const tracer = require('./routes/tracer');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
app.use('/api/v1/tracer', tracer);

const port = config.get('express.port');
app.listen(port, () => console.log(`Listening on port ${port}...`));