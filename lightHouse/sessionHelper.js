const { v4: uuidv4 } = require('uuid');

let sessionToken;

const generateSessionToken = () => {
  sessionToken = uuidv4();
};

const getSessionToken = () => `(sessionId-${sessionToken})`;

const compareFileName = (extFileName, newFileName) => {
  const newSessionName = newFileName.substring(newFileName.lastIndexOf('(') + 1, newFileName.lastIndexOf(')'));
  const extSessionName = extFileName.substring(extFileName.lastIndexOf('(') + 1, extFileName.lastIndexOf(')'));
  const newFname = newFileName.substring(0, newFileName.lastIndexOf('('));
  const extFname = extFileName.substring(0, extFileName.lastIndexOf('('));
  return (newSessionName !== extSessionName && newFname === extFname);
};

module.exports = {
  generateSessionToken,
  getSessionToken,
  compareFileName,
};
