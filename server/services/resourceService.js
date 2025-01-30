const Resource = require('../models/Resource');

const createResource = async({title, url, description}) => {
    const resourceExist = await Resource.findOne({url: url});
    if(resourceExist){
        throw new Error('Resouce already exists');
    }
    const newResource = new Resource({
        title,
        url,
        description        
    });
    await newResource.save();
    return newResource;
}

module.exports = {createResource};