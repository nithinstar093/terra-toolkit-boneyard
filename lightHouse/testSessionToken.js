const uuidv4 = require('uuid');

let sessionToken;

const generateSessionToken = () => {
  sessionToken = uuidv4();
};

const getSessionToken = () => `(sessionId-${sessionToken})`;

module.exports = {
  generateSessionToken,
  getSessionToken,
};
