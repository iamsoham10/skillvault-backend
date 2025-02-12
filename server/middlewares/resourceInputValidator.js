const joi = require('joi');

const newResourceSchema = joi.object({
    title: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9\\s.,!?&+#@()\'":-]{3,200}$', 'u'))
        .trim()
        .max(200)
        .required(),
    url: joi.string()
        .uri({ scheme: ['http', 'https'] })
        .required(),
    description: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9\\s.,!?&+#@()\'":-]{3,200}$', 'u'))
        .trim()
        .max(2000),
    tags: joi.array()
        .items(joi.string().trim())
        .unique(),
});

const newResourceParamSchema = joi.object({
    collection_id: joi.string()
        .required()
});

const getResourceSchema = joi.object({
    page: joi.number()
        .required(),
    limit: joi.number()
        .required()
});

const updateResourceSchema = joi.object({
    title: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9\\s.,!?&+#@()\'":-]{3,200}$', 'u')),
    url: joi.string(),
    description: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9\\s.,!?&+#@()\'":-]{3,200}$', 'u'))
        .trim(),
    tags: joi.array()
        .items(joi.string()),
});

const updateResourceParamSchema = joi.object({
    _id: joi.string()
        .required()
        .pattern(new RegExp('^[0-9a-fA-F]{24}$')),
});

const deleteResourceParamSchema = joi.object({
    _id: joi.string()
        .required()
        .pattern(new RegExp('/^[0-9a-fA-F]{24}$/')),
});

const searchResourcesSchema = joi.object({
    collection_id: joi.string()
        .required(),
    search: joi.string()
        .trim()
        .required()
})

const validateInputSchema = (req, res, next) => {
    const bodyValidation = newResourceSchema.validate(req.body);
    const queryValidation = newResourceParamSchema.validate(req.query);
    if (bodyValidation.error || queryValidation.error) {
        return res.status(400).json({
            success: false,
            message: bodyValidation.error ? bodyValidation.error.details[0].message : queryValidation.error.details[0].message
        });
    }
    next();
}

const validateGetResourceSchema = (req, res, next) => {
    const queryValidation = getResourceSchema.validate(req.query);
    if (queryValidation.error) {
        return res.status(400).json({
            success: false,
            message: queryValidation.error.details[0].message
        });
    }
    next();
}

const validateUpdateResourceSchema = (req, res, next) => {
    const bodyValidation = updateResourceSchema.validate(req.body);
    const queryValidation = updateResourceParamSchema.validate(req.query);
    if (bodyValidation.error || queryValidation.error) {
        return res.status(400).json({
            success: false,
            message: bodyValidation.error ? bodyValidation.error.details[0].message : queryValidation.error.details[0].message
        });
    }
    next();
}

const validateDeleteResourceSchema = (req, res, next) => {
    const queryValidation = deleteResourceParamSchema.validate(req.query);
    if (queryValidation.error) {
        return res.status(400).json({
            success: false,
            message: queryValidation.error.details[0].message
        });
    }
    next();
}

const validateSearchResourceSchema = (req, res, next) => {
    const queryValidation = searchResourcesSchema.validate(req.query);
    if (queryValidation.error) {
        return res.status(400).json({
            success: false,
            message: queryValidation.error.details[0].message
        });
    }
    next();
}

module.exports = { validateInputSchema, validateGetResourceSchema, validateUpdateResourceSchema, validateDeleteResourceSchema, validateSearchResourceSchema };