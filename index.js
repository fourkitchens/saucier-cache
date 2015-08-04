var redis = require('redis'),
    debug = require('debug')('saucier:cache'),
    crypto = require('crypto'),
    qs = require('qs'),
    client;

module.exports = function (port, host, options) {
  port = port || 6379;
  host = host || '127.0.0.1';
  options = options || {};

  return {
    db: redis.createClient(port, host, options),
    get: function (req, res, next) {
      req.saucier.db.mget([req.saucier.cache.keys.routeKey, req.saucier.cache.keys.jsonKey], function (err, results){
        req.saucier.cache.nid = results[0];
        req.saucier.cache.cacheSet = results[1] === null ? true : false;
        req.saucier.cache.apiGet = results[1] === null ? true : false;
        req.saucier.cache.body = results[1] === null ? {} : JSON.parse(results[1]);
        return next();
      });
    },
    set: function (ttl) {
      var ttl = ttl || 800,
          f = function (req, res, next) {
            if (req.saucier.cache.cacheSet) {
              ttl = req.saucier.cache.body.hasOwnProperty('_ttl') ? req.saucier.cache.body._ttl : ttl;
                req.saucier.db.multi([
                  ['set', req.saucier.cache.keys.jsonKey, JSON.stringify(req.saucier.cache.body)],
                  ['expire', req.saucier.cache.keys.jsonKey, ttl]
                ]).exec(function (error, replies) {
                  if (error) {
                    return next(new Error(error));
                  }
                  return next();
                });
            }
            else {
              return next();
            }
          };
      return f;
    },
    create: function () {
      var client = this.db,
          cacheKey = function (req) {
        var jsonKey = ':json',
            routeKey = crypto.createHash('sha1').update(req.path).digest('hex');
        if (Object.keys(req.query).length !== 0) {
          routeKey += ':' + crypto.createHash('sha1').update(qs.stringify(req.query)).digest('hex');
        }
        return {'routeKey': routeKey, 'jsonKey': routeKey + jsonKey};
      },
      f = function (req, res, next) {
        req.saucier = {};
        req.saucier.db = client;
        req.saucier.cache = {};

        req.saucier.cache.keys = cacheKey(req);
        return next();
      };

      return f;
    }
  };
}
