// Configurations for Frontend
const env = (process.env.NODE_ENV === 'production') ? 'production' : 'development';

let config;
try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    config = require(`./${env}.json`);
} catch (_) {
    // eslint-disable-next-line global-require
    config = require('./development.json');
}

export default config;