import path from 'path';
import fs from 'fs';
import { forEach } from 'lodash';
import m2s from 'mongoose-to-swagger';

function getInfoData(swaggerData) {
    let packageInfo = require('../../../../../package.json');

    swaggerData.info = {
        'description': packageInfo.description,
        'version': packageInfo.version,
        'title': packageInfo.name.toUpperCase()
    };
}

function getPathsData(swaggerData, serviceNames) {
    swaggerData.tags = [];
    swaggerData.paths = {};

    forEach(serviceNames, (serviceName) => {
        swaggerData.tags.push({
            name: serviceName
        });

        const remotes = require(`../../../../../services/${serviceName}/${serviceName}.remote.js`).default;

        const remoteServiceMethods = Object.keys(remotes);
        remoteServiceMethods.forEach(function (remoteServiceMethod) {
            let remote = remotes[remoteServiceMethod];
            let path = remote.static
                ? `/${serviceName}${remote.remote}`
                : `/${serviceName}/{id}${remote.remote}`;

            let parameters = remote.accepts.map((accept) => {
                if (accept.http.source === 'params' ) {
                    path = path.replace(new RegExp(`:${accept.arg}\/`, 'g'), `{${accept.arg}}`);
                    path = path.replace(new RegExp(`:${accept.arg}$`, 'g'), `{${accept.arg}}`);
                }

                let param = {
                    'name': accept.arg,
                    'in': accept.http.source === 'params'
                        ? 'path'
                        : accept.http.source,
                    'description': accept.description,
                    'required': accept.required,
                    'type': accept.type,
                    'schema': accept.isCurrentModelSchema
                        ? {
                            '$ref': `#/definitions/${serviceName}`
                        }
                        : (accept.modelSchema
                            ? {
                                '$ref': `#/definitions/${accept.modelSchema}`
                            }
                            : accept.schema)
                };

                if (param.type === 'array') {
                    param.items = {};
                }
                if (param.type === 'file') {
                    param.type = 'string';
                    param.format = 'binary';
                }

                return param;
            });

            if (!swaggerData.paths[path]) {
                swaggerData.paths[path] = {};
            }

            swaggerData.paths[path][remote.method] = {
                'security': [
                    {
                        'Bearer': []
                    }
                ],
                tags: [serviceName],
                summary: `Service method ${remoteServiceMethod}`,
                description: `Service method ${remoteServiceMethod}`,
                operationId: remoteServiceMethod,
                produces: [
                    'application/json'
                ],
                consumes: [
                    'application/json'
                ],
                parameters: remote.static
                    ? parameters
                    : [
                        {
                            name: 'id',
                            in: 'path',
                            description: `ID of ${serviceName}`,
                            required: true,
                            type: 'string'
                        },
                        ...parameters
                    ],
                responses: {
                    '200': {
                        'description': 'Successful operation'
                    }
                }
            };
        });
    });
}

function getModelData(swaggerData, serviceNames) {
    swaggerData.definitions = {};

    forEach(serviceNames, (serviceName) => {
        let model;
        try {
            model = require(`../../../../../services/${serviceName}/${serviceName}.model.js`).model;
        } catch (err) {}

        if (model) {
            swaggerData.definitions[serviceName] = m2s(model);
        }
    });
}

export default function(app, options = {}) {
    const swaggerData = {
        'swagger': '2.0',
        'basePath': options.basePath || '/',
        'schemes': [
            'http',
            'https'
        ],
        'securityDefinitions': {
            'Bearer': {
                'type': 'apiKey',
                'in': 'header',
                'name': 'Authorization',
                'template': 'Bearer {apiKey}'
            }
        }
    };

    const directoryPath = path.join(__dirname, '../../../../../services');
    let serviceNames = fs.readdirSync(directoryPath);

    getInfoData(swaggerData);
    getPathsData(swaggerData, serviceNames);
    getModelData(swaggerData, serviceNames);

    const swaggerUi = require('swagger-ui-express');

    var options = {
        swaggerOptions: {
            docExpansion:'none'
        }
    };
    app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerData, options));
}
