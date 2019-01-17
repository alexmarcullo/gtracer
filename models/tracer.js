const Joi = require('joi');

const schema = {
    trackId: Joi.string().required(),
    messageId: Joi.allow(),
    date: Joi.date().required(),
    step: Joi.string().required(),
    payload: Joi.allow(),
    appName: Joi.string().required(),
    aditionalInformations: Joi.allow(),
    from: Joi.string().required()
};

function validateTracer(tracer)
{
    return Joi.validate(tracer, schema);
}

exports.validate = validateTracer;