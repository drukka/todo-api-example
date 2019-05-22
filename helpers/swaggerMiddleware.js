const swaggerTools = require('swagger-tools');
const jsonMerger = require('json-merger');

const userController = require('../controllers/v1/UserController');
const dirHelper = require('./dir');

// ensuring there are no parameters that aren't defined in swagger file because of db reserved keywords
exports.throwErrorOnUnknownBodyParameters = () => {
    return (req, res, next) => {
        let allowedProperties = {};
        if (req.swagger && req.swagger.params.body && req.swagger.params.body.schema.schema.properties) {
            allowedProperties = req.swagger.params.body.schema.schema.properties;
        }
        
        const properties = Object.keys(req.body);
        properties.forEach(property => {
            if (!allowedProperties[property]) {
                res.statusCode = 400;
                return next(new Error());
            }
        });
        
        next();
    };
};

//exports.authenticateUser = () => (req, res, next) => userController.authenticateUser(req, res, next);


// it creates req.pathParams object with path parameters
exports.populateRequestParams = () => {
    return (req, res, next) => {
        req.pathParams = {};
        if (req.swagger) {
            for (let param in req.swagger.params) {
                if (req.swagger.params[param].schema.in === 'path') {
                    req.pathParams[param] = req.swagger.params[param].value;
                }
            }
        }
        
        next();
    };
};


exports.trimStrings = () => {
    return (req, res, next) => {
        if (req.swagger && req.swagger.params.body && req.swagger.params.body.schema.schema.properties) {
            const properties = req.swagger.params.body.schema.schema.properties;
            for (let key in properties) {
                if ((properties[key].type === 'string' || (Array.isArray(properties[key].type) && properties[key].type.indexOf('string') >= 0)) && properties[key]['x-trim'] && req.body[key]) {
                    req.body[key] = req.body[key].trim();
                }
            }
        }
        
        next();
    };
};

exports.initialize = (version = '/v1') => new Promise((resolve, reject) => {
    const dir = `${__dirname}/../config/swagger${version}`;
    console.log(dir);
    const paths = jsonMerger.mergeFiles(dirHelper.getFilesInDirectoryRecursively(`${dir}/paths`));
    const definitions = jsonMerger.mergeFiles(dirHelper.getFilesInDirectoryRecursively(`${dir}/definitions`));
    const info = jsonMerger.mergeFile(`${dir}/swagger.json`);
    
    const swagger = jsonMerger.mergeObjects([info, { paths }, { definitions }]);
    
    swaggerTools.initializeMiddleware(swagger, function (middleware) {
        resolve({ version, middleware });
    });
});
