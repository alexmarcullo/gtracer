const config = require('config');
const {validate} = require('../models/tracer');
const express = require('express');
const router = express.Router();
const request = require('request')


router.post('/:index', (req, res) => {
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
    
    request.post(config.get('elasticsearch.host') + '/' + req.params.index + '/logentry', {
            json: tracer
        }, (error, resp, body) => {
        if (error) {
            console.error(error)
            return
        }
        res.status(resp.statusCode).send({"status":"created"});
    });
});

router.get('/:index/track/:id', (req, res) => {
    let params = {
        query: {
            match_phrase: { 
                "trackId": '"' + req.params.id + '"'
            }
        },
        sort: "date"
    };
    Get(req.params.index, params)
        .then(result => {
            res.status(result.code).send(ParseHitsResponse(result.body));
        })
        .catch(error => {
            res.status(400).send(error)
        });
});

router.get('/:index/message/:id', (req, res) => {
    let params = {
        "_source": ["trackId","date"],
        "query": {
            "match_phrase": {"messageId": req.params.id}
        },
        "sort":"date",
        "aggs":{
            "group_by_trackId":{
                "terms": {
                    "field": "trackId.keyword"
                }
            }
        }
    };
    Get(req.params.index, params)
        .then(result => {
            var aggregations = ParseAggregationResponse(result.body);
            if(aggregations.length == 0) result.code = 404;
            res.status(result.code).send(aggregations);
        })
        .catch(error => {
            res.status(400).send(error)
        });
});

function Get(index, params)
{
    return new Promise((resolve, reject) => {
        request.post(config.get('elasticsearch.host') + '/' + index + '/_search', {
            json: params
        }, 
        (error, resp, body) => {
            if (error) {
                reject(error);
                return
            }
            resolve({code: resp.statusCode, body:body});
        });
    })
}

function ParseHitsResponse(body)
{
    var response = new Array();

    body.hits.hits.forEach(x => {
        response.push(x._source);
    });

    return response;
}

function ParseAggregationResponse(body)
{
    var response = new Array();

    body.aggregations.group_by_trackId.buckets.forEach(x => {
        var get = false;
        body.hits.hits.forEach(y=> {
            if(x.key == y._source.trackId && !get){
                response.push({trackId: x.key, date: y._source.date})
                get = true;
            }
        });
    });

    return response;
}

module.exports = router; 