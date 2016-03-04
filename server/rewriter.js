exports = module.exports = function(rules) {
  rules = (rules || []).map(function(rule) {
    var parts = rule.split(' ');

    return {
      hostRegex: new RegExp(parts[0]),
      pathRegex: new RegExp(parts[1]),
      replace: parts[2],
      last: !!parts[3]
    };
  });

  return function(req, res, next) {
    rules.some(function(rewrite) {
      if(req.host.match(rewrite.hostRegex)) {
        if(req.path.match(rewrite.pathRegex)) {
          req.url = req.url.replace(rewrite.pathRegex, rewrite.replace);
        }
      }
      return rewrite.last;
    });
    next();
  };
};