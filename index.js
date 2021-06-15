'use strict';

const pino = require('pino')
const createApp = require('./src/app');

const PORT = 3000;

async function start() {
    const logger = pino({ level: 'info' });
    try {
        const app = await createApp(logger);

        registerGracefulShutdown(logger, app);
        registerSignalHandlers(logger, app);

        const address = await app.listen(PORT, '::');
        logger.info({ message: `Server is listening on ${address}` });
    } catch (err) {
        logger.error({ message: `Uncaught exception: ${err.message}, shutting down the server`, err });
        setImmediate(() => {
            throw err;
        });
    }
}

// Add signal handlers to handle being interrupted, eg. with a Ctrl+C, "docker stop".
function registerSignalHandlers(logger, server) {
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    function shutdown() {
        logger.info({ message: 'Gracefully stopping server' });
        server.close(() => {
            process.exit(0);
        });
    }
}

function registerGracefulShutdown(logger, server) {
    process.on('uncaughtException', err => {
        logger.error({ message: `Uncaught exception: ${err.message}, shutting down the server`, err });
        server.close(() => {
            process.exit(1);
        });
    });
}

start();
