var Q = require('q');

module.exports = {
  doAuth: function (db, hospcode, key) {
    var q = Q.defer();

    db('auth')
    .count('* as total')
    .where('hospcode', hospcode)
    .where('auth_key', key)
    .then(function (rows) {
      q.resolve(rows[0].total);
    })
    .catch(function (err) {
      q.reject(err);
    });

      return q.promise;
  }
};
