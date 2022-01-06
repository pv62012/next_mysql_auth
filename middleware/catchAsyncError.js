module.exports = (theFuncPas) => (req, res, next) => {
  Promise.resolve(theFuncPas(req, res, next)).catch(next);
};
