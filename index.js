const express = require('express');
const tracer = require('./routes/tracer');
const app = express();

app.use(express.json());
app.use('/api/v1/tracer', tracer);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));