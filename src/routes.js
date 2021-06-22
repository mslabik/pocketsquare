'use strict';

const healthHandler = require('./routes/health');
const offersHandler = require('./routes/offers');

module.exports = async (app) => {
    app.get('/health', healthHandler);
    app.get('/offers', offersHandler(this.elastic));
};
