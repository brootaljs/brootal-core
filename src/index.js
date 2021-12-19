import datasource from './initialization/datasource.js';
import service from './initialization/service.js';
import swagger from './initialization/swagger.js';

import fileUpload from 'express-fileupload';

import Remote from './service/Remote';
import RemoteService from './service/RemoteClass';

import use from './use';

const defaultOptions = {
    initDatasources: true,
    initServices: true,
    initSwagger: true,
    useFileUpload: true,
    fileUploadOpts: {
        limits: { fileSize: 50 * 1024 * 1024 }
    }
};

export {
    Remote,
    RemoteService,
    use
};

export default {
    async init(app, options) {
        options = {
            ...defaultOptions,
            ...(options || {})
        };

        if (options.useFileUpload) {
            app.use(fileUpload(options.fileUploadOpts));
        }

        if (options.initDatasources) {
            await datasource(app, options);
        }
        if (options.initServices) {
            await service(app, options);
        }
        if (options.initSwagger) {
            swagger(app, options);
        }
    }
};
