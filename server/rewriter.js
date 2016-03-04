exports = module.exports = function(rules) {
  rules = (rules || []).map(function(rule) {
    var parts = rule.split(' ');

    return {
      regex: new RegExp(parts[0]),
      replace: parts[1],
      last: !!parts[2]
    };
  });

  return function(req, res, next) {
    rules.some(function(rewrite) {
      if(req.host.match(rewrite.regex)) {
        req.url = rewrite.replace;
      }
      return rewrite.last;
    });
    next();
  };
};