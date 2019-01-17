const {validate} = require('../models/tracer');
const express = require('express');
const router = express.Router();
const request = require('request')


router.post('/', (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let tracer = {
        trackId: req.body.trackId,
        messageId: req.body.messageId,
        date: new Date(req.body.date),
        step: req.body.step,
        payload: req.body.payload,
        appName: req.body.appName,
        aditionalInformations: req.body.aditionalInformations,
        from: req.body.from
    };
    
    request.post('https://brg-elastic.2d1f.gsat-corp.openshiftapps.com/tracer/logentry', {
            json: tracer
        }, (error, resp, body) => {
        if (error) {
            console.error(error)
            return
        }
        res.status(resp.statusCode).send(body);
    });
});

router.get('/:id', (req, res) => {
    let tracer = {
        query: {
            match: {
                trackId: req.params.id
            }
        },
        sort: "date"
    };

    request.post('https://brg-elastic.2d1f.gsat-corp.openshiftapps.com/tracer/_search', {
            json: tracer
        }, (error, resp, body) => {
        if (error) {
            console.error(error)
            return
        }
        res.status(resp.statusCode).send(body);
    });
});






module.exports = router; 