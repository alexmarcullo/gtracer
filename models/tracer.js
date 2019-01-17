const Joi = require('joi');

const schema = {
    trackId: Joi.string().required(),
    messageId: Joi.string(),
    date: Joi.date().required(),
    step: Joi.string().required(),
    payload: Joi.object(),
    appName: Joi.string().required(),
    aditionalInformations: Joi.object(),
    from: Joi.string().required()
};

function validateTracer(tracer)
{
    return Joi.validate(tracer, schema);
}

exports.validate = validateTracer;