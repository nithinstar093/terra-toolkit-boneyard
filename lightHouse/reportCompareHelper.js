const Logger = require('../scripts/utils/logger');

const allowedVariance = 5;

const validateSession = (extFileName, newFileName) => {
  const newSessionName = newFileName.substring(newFileName.lastIndexOf('('), newFileName.lastIndexOf(')') + 1);
  const extSessionName = extFileName.substring(extFileName.lastIndexOf('('), extFileName.lastIndexOf(')') + 1);
  const newFname = newFileName.substring(0, newFileName.lastIndexOf('('));
  const extFname = extFileName.substring(0, extFileName.lastIndexOf('('));
  return (newSessionName !== extSessionName && newFname === extFname);
};

const compareReports = (newFile, extFile, testTitle) => {
  if (newFile && extFile) {
    const newPerfScore = (newFile.categories.performance.score) * 100;
    const extPerfScore = (extFile.categories.performance.score) * 100;
    // Returns false if score is same
    if (newPerfScore === extPerfScore) {
      return false;
    }
    // Returns true if new performance score is greater than previous performance score
    if (newPerfScore > extPerfScore) {
      return true;
    }
    // Returns true if difference between new performance score and previous performance score is greater than the allowed varaince(5).
    const diff = Math.abs(extPerfScore - newPerfScore);
    if (diff > allowedVariance) {
      Logger.warn(`Perfomance Score of ${testTitle} reduced to ${newPerfScore} from ${extPerfScore}. Check the report for more info.`);
      return true;
    }
  }
  return false;
};

export {
  compareReports,
  validateSession,
};
