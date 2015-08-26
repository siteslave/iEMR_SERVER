var Q = require('q');

module.exports = {
  getServiceLab: function (db, hospcode, hn, seq) {
    var q = Q.defer();

    var sql = 'select l.LNAME as lname, l.LRESULT as lresult, l.LUNIT as lunit from lab as l ' +
      'where l.HN=? and l.SEQ=? and l.HOSPCODE=?';

    db.raw(sql, [hn, seq, hospcode])
    .then(function (rows) {
      q.resolve(rows[0]);
    })
    .catch(function (err) {
      q.reject(err);
    });

    return q.promise;
  }
};
