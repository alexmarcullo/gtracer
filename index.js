const express = require('express');
const tracer = require('./routes/tracer');
const app = express();

require("appdynamics").profile({
    controllerHostName: 'cloud2019011711580214.saas.appdynamics.com',
    controllerPort: 443, 

    // If SSL, be sure to enable the next line
    controllerSslEnabled: true,
    accountName: 'cloud2019011711580214',
    accountAccessKey: 'nbal2rcil57e',
    applicationName: '.NET',
    tierName: 'Node',
    nodeName: 'process' // The controller will automatically append the node name with a unique number
});
   


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
app.use('/api/v1/tracer', tracer);


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));