// Configurations for Frontend
const NODE_ENV = 'development';// (process.env.NODE_ENV === 'production') ? 'production' : 'development';

export default require(`./${NODE_ENV}.json`);