'use strict';

const healthHandler = {
    async handler() {
        const { statusCode } = await this.elastic.ping();
        return { elastic: statusCode };
    }
};

module.exports = healthHandler;
