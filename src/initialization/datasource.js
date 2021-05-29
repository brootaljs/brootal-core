const mongoose = require('mongoose');
mongoose.set('returnOriginal', false);

const connect = async (datasource) => {
    return mongoose.createConnection(datasource.url, datasource.options);
}

const connectTest = async (MongoMemoryServer, datasource) => {

    const mongod = new MongoMemoryServer();
    const uri = await mongod.getUri();

    return mongoose.createConnection(uri, datasource.options);
}

export default async (app, options) => {
    const datasources = require('../../../../server/datasources.json')
    let datasourceNames = Object.keys(datasources);
    app.datasources = {};
    if (process.env.NODE_ENV === 'test' || options.isTest) {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        console.log('Initialize Test DB');
        for (let i=0; i<datasourceNames.length; i++) {
            app.datasources[datasourceNames[i]] = await connectTest(MongoMemoryServer, datasources[datasourceNames[i]]);
        }
    } else {
        for (let i=0; i<datasourceNames.length; i++) {
            app.datasources[datasourceNames[i]] = await connect(datasources[datasourceNames[i]]);
        }
    }
}