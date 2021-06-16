'use strict';

const fastify = require('fastify');
const elasticsearch = require('fastify-elasticsearch');

const routes = require('./routes')

async function createApp(logger) {
    const app = fastify({
        logger
    });

    app.register(elasticsearch, {
        node: 'http://elasticsearch:9200',
        healthcheck: false
    });


    app.register(routes);

    await app.ready();

    return app;
}

module.exports = createApp;

