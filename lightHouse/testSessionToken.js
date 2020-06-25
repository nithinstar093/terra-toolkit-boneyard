import { v4 as uuidv4 } from 'uuid';

let sessionToken;

const generateSessionToken = () => {
  sessionToken = uuidv4();
};

const getSessionToken = () => `(sessionId-${sessionToken})`;

export {
  generateSessionToken,
  getSessionToken,
};
