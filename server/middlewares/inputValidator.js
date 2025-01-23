const joi  = require('joi');

const inputSchema = joi.object({
    username: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={};<>?,./-]{6,30}$'))
        .required()
});

const paramSchema = joi.object({
    user_id: joi.string()
        .required()
        .pattern(new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'))
})

const checkInput = (req, res, next) => {
    const {error} = inputSchema.validate(req.body);
    if(error){
        return res.status(400).json({success: false, error: error.details[0].message})
    }
    next();
};

const checkParam = (req, res, next) => {
    const {error} = paramSchema.validate(req.params);
    if(error){
        return res.status(400).json({success: false, error: error.details[0].message});
    }
    next();
}
module.exports = {checkInput, checkParam};