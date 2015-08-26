var Q = require('q');

module.exports = {
  getServiceProced: function (db, hospcode, hn, seq) {
    var q = Q.defer();

    var sql = 'select p.PROCED as proced_code, icd.DESC_R as proced_name, ' +
      'p.PRICE as price ' +
      'from proced as p ' +
      'left join icd9 as icd on icd.CODE=p.PROCED ' +
      'where p.HN=? and p.SEQ=? and p.HOSPCODE=?';

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
