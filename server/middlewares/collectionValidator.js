const joi = require('joi');

const createCollectionSchema = joi.object({
    title: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9\\s.,!?&+#@()\'":-]{3,200}$', 'u'))
        .trim()
        .max(200)
        .required(),
});

const createCollectionParamsSchema = joi.object({
    _id: joi.string()
        .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
        .required(),
});

const getCollectionsSchema = joi.object({
    page: joi.number()
        .required(),
    limit: joi.number()
        .required(),
});

const shareCollectionSchema = joi.object({
    email: joi.string()
        .email()
        .required(),
});

const shareCollectionParamSchema = joi.object({
    collection_id: joi.string()
        .required(),
    role: joi.string()
        .valid('viewer', 'editor')
        .required(),
});


const searchCollectionSchema = joi.object({
    search: joi.string()
        .trim()
        .required(),
});

const createCollectionInputSchema = (req, res, next) => {
    const bodyValidation = createCollectionSchema.validate(req.body);
    const paramValidation = createCollectionParamsSchema.validate(req.query);
    if (bodyValidation.error || paramValidation.error) {
        return res.status(400).json({
            success: false,
            message: bodyValidation.error ? bodyValidation.error.details[0].message : paramValidation.error.details[0].message
        });
    }
    next();
}

const validateGetCollections = (req, res, next) => {
    const queryValidation = getCollectionsSchema.validate(req.query);
    if (queryValidation.error) {
        return res.status(400).json({
            success: false,
            message: queryValidation.error.details[0].message
        });
    }
    next();
}

const shareCollectionInputSchema = (req, res, next) => {
    const bodyValidation = shareCollectionSchema.validate(req.body);
    const paramValidation = shareCollectionParamSchema.validate(req.query);
    if (bodyValidation.error || paramValidation.error) {
        return res.status(400).json({
            success: false,
            message: bodyValidation.error ? bodyValidation.error.details[0].message : paramValidation.error.details[0].message
        });
    }
    next();
}

const validateSearchCollection = (req, res, next) => {
    const queryValidation = searchCollectionSchema.validate(req.query);
    if (queryValidation.error) {
        return res.status(400).json({
            success: false,
            message: queryValidation.error.details[0].message
        });
    }
    next();
}

module.exports = { createCollectionInputSchema, validateGetCollections, shareCollectionInputSchema, validateSearchCollection }