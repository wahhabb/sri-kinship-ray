const env = process.env.NODE_ENV || "local";
const credentials = require(`./.credentials.${env}.json`);
module.exports = { credentials };
