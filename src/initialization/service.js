import path from 'path';
import fs from 'fs';
import _ from 'lodash';

import { URL } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

import fetch from 'node-fetch';

import acl from '../acl';

const debug = require('debug');
const error = debug('Engine:Service:ERROR');
const log = debug('Engine:Service');

const getArgsFromReq = function(req, accepts) {
    return accepts.map(accept => {
        let http = accept.http || {};
        switch (http.source) {
            case 'body':
                return req.body[accept.arg]
            case 'params':
                return req.params[accept.arg]
            case 'file':
                return req.files[accept.arg]
            case 'query':
            default:
                // parse filter from qs
                let buf = req.query[accept.arg];
                try {
                    buf = JSON.parse(buf);
                } catch(e) { }
                return buf;
        }
    });
}

// express router don't check all routes to find corresponding to request,
// it checks routes from first registered to last, until it find first that match and drops rest
// this logic breaks on parameterized routes, because 'Service/:id' and 'Service/findOne' matches
// by the same criteria and one of them will be selected based on who was registered first
// decision - sort routes depending on their length, so that the most specialized ones are in front
const sortRoutes = function(remotes, serviceName) {
    return Object.keys(remotes).sort((a,b) => {
        const ar = remotes[a];
        const ap = ar.static ? "/".concat(serviceName).concat(ar.remote) : "/".concat(serviceName, "/:__id").concat(ar.remote);
  
        const br = remotes[b];
        const bp = br.static ? "/".concat(serviceName).concat(br.remote) : "/".concat(serviceName, "/:__id").concat(br.remote);
  
        return bp.length - ap.length;
    });
}

const createService = async function(app, serviceName, service, options) {
    app.services[serviceName] = service;
    const remotes = require(`../../../../services/${serviceName}/${serviceName}.remote.js`).default;
    app.get(`/remotes/${serviceName}`, async (req, res) => {
        try {
            res.send(remotes);
        } catch(error) {
            res.status(500).json({ error });
        }
    });
    const remoteServiceMethods = sortRoutes(remotes, serviceName);
    remoteServiceMethods.forEach(function (remoteServiceMethod) {
        let remote = remotes[remoteServiceMethod];
        if (remote.static) { 
            app[remote.method](`/${serviceName}${remote.remote}`, async (req, res) => {
                try {
                    if (options.acl && (!options.acl.onlyIfHeader || req.headers[options.acl.onlyIfHeader.toLowerCase()])) {
                        if (!req.user) {
                            let permission = await app.__aclHelper.checkPermissionByUserAndRemote(app, serviceName, {}, remoteServiceMethod, remote, ['$unauthorized']);
                            if (!permission.granted) {
                                return res.status(401).json({
                                    error: 'Unauthorized'
                                });
                            }
                        } else {
                            let permission = await app.__aclHelper.checkPermissionByUserAndRemote(app, serviceName, req.user, remoteServiceMethod, remote, ['$authorized']);
                            if (!permission.granted) {
                                return res.status(403).json({
                                    error: 'Permission denied'
                                })
                            };
                        }
                    }

                    let result = await service[remoteServiceMethod](...getArgsFromReq(req, remote.accepts), req, res);

                    log(`Result of /${serviceName}${remote.remote}`, result);
                    res.send(remote.prepare ? remote.prepare(result) : result);
                } catch(err) {
                    error(`Error of /${serviceName}${remote.remote}`, err);
                    res.status(500).json({
                        error: err ? (typeof err === 'object' ? err.toString() : err) : 'Something went wrong, please try again later'
                    });
                }
            });
        } else {
            app[remote.method](`/${serviceName}/:__id${remote.remote}`, async (req, res) => {
                try {
                    if (options.acl && (!options.acl.onlyIfHeader || req.headers[options.acl.onlyIfHeader.toLowerCase()])) {
                        if (!req.user) {
                            let permission = await app.__aclHelper.checkPermissionByUserAndRemote(app, serviceName, {}, remoteServiceMethod, remote, ['$unauthorized']);
                            if (!permission.granted) {
                                return res.status(401).json({
                                    error: 'Unauthorized'
                                });
                            }
                        } else {
                            let permission = await app.__aclHelper.checkPermissionByUserAndRemote(app, serviceName, req.user, remoteServiceMethod, remote, ['$authorized']);
                            if (!permission.granted) {
                                return res.status(403).json({
                                    error: 'Permission denied'
                                })
                            };
                        }
                    }

                    let item = await service.findById(req.params.__id);
                    let result = await item[remoteServiceMethod](...getArgsFromReq(req, remote.accepts), req, res);

                    log(`Result of /${serviceName}/:__id${remote.remote}`, result);
                    res.send(remote.prepare ? remote.prepare(result) : result);
                } catch(err) {
                    error(`Error of /${serviceName}/:__id${remote.remote}`, err);
                    res.status(500).json({
                        error: err ? (typeof err === 'object' ? err.toString() : err) : 'Something went wrong, please try again later'
                    });
                }
            });
        }
    });

}

const createRemoteService = async function(app, serviceName, service) {
    let remotes = await fetch(`http://${service.__url}/remotes/${service.__service}`);
    remotes = await remotes.json();
    service.__remotes = remotes;
    app.get(`/remotes/${serviceName}`, async (req, res) => {
        try {
            res.send(remotes);
        } catch(error) {
            res.status(500).json({ error });
        }
    });

    let pathRewrite = {};
    pathRewrite[`^/${serviceName}`] = '/';
    app.use(`/${serviceName}`, createProxyMiddleware({ 
        target: `http://${service.__url}/${service.__service}`, 
        changeOrigin: true,
        pathRewrite
    }));

    const remoteServiceMethods = sortRoutes(remotes, serviceName);
    remoteServiceMethods.forEach((remoteServiceMethod) => {
        const remote = remotes[remoteServiceMethod];

        service[remoteServiceMethod] = async (...args) => {
            let remote = service.__remotes[remoteServiceMethod];
            let path = `http://${service.__url}/${service.__service}${remote.static?'':`/${args.shift()}`}${remote.remote}`;
            let queryParameters = {};
            let body;

            for(let i=0; i<args.length && i<remote.accepts.length; i++) {
                switch (remote.accepts[i].http.source) {
                    case 'params':
                        path = path.replace(new RegExp(`:${remote.accepts[i].arg}\/`, 'g'), `${args[i]}/`);
                        path = path.replace(new RegExp(`:${remote.accepts[i].arg}$`, 'g'), `${args[i]}`);
                        break;
                    case 'body':
                        if (!body) body = {};
                        body[remote.accepts[i].arg] = args[i];
                        break;
                    case 'query':
                    default:
                        // fix filter=[Object object]
                        queryParameters[remote.accepts[i].arg] = JSON.stringify(args[i]);
                        break;
                }
            }

            let url = new URL(path);

            let queryParamsKeys = Object.keys(queryParameters);
            for (let i=0; i<queryParamsKeys.length; i++) {
                url.searchParams.append(queryParamsKeys[i], queryParameters[queryParamsKeys[i]]);
            }

            
            const opts = {
                method: remote.method,
                headers: { 'Content-Type': 'application/json' }
            };
            // Fix error for GET requests with body
            if (body) opts.body = JSON.stringify(body);
            let result = await fetch(url, opts);

            return result.json();
        }
    })


    
    app.services[serviceName] = service;
}

export default async function(app, options) {
    app.services = {};
    
    const directoryPath = path.join(__dirname, '../../../../services');
    let serviceNames = fs.readdirSync(directoryPath);
    log('Service Names', serviceNames);
    if (options.acl) {
        let roleServiceName = options.acl.roleService || 'Role';
        let removed = _.remove(serviceNames, (s) => s === roleServiceName);
        if (removed.length === 0) throw 'No Role Service Find';

        let roleService = require(`../../../../services/${roleServiceName}/${roleServiceName}.class.js`).default;
        if (roleService.__isRemote) {
            await createRemoteService(app, roleServiceName, roleService);
        }
        await createService(app, roleServiceName, roleService);

        app.__aclHelper = acl;
        await app.__aclHelper.initialize(app, roleServiceName);
    }
    await Promise.all(serviceNames.map(async function (serviceName) {
        if (serviceName != '.DS_Store') {
            const service = require(`../../../../services/${serviceName}/${serviceName}.class.js`).default;
            if (service.__isRemote) {
                return await createRemoteService(app, serviceName, service, options);
            }
            return await createService(app, serviceName, service, options);
        }
    }));

    
}