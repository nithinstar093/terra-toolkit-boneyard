const allowedVariance = 5;

const compareReports = (newFile, extFile, testTitle, averagePerfScore) => {
  if (newFile && extFile) {
    const newPerfScore = (newFile.categories.performance.score) * 100;
    const extPerfScore = (extFile.categories.performance.score) * 100;
    // Returns false if score is same
    if (newPerfScore === extPerfScore || newPerfScore > extPerfScore) {
      return false;
    }
    // Returns true if new performance score is greater than previous performance score OR if it is less than average score.
    if (newPerfScore < averagePerfScore) {
      return true;
    }
    // Returns true if difference between new performance score and previous performance score is greater than the allowed varaince(5).
    const diff = Math.abs(extPerfScore - newPerfScore);
    if (diff > allowedVariance) {
      return true;
    }
  }
  return false;
};

module.exports = {
  compareReports,
};
