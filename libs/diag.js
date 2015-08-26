var Q = require('q');

module.exports = {
  getServiceDiag: function (db, hospcode, hn, seq) {
    var q = Q.defer();

    var sql = 'select d.DIAG_CODE as diag_code, ' +
      'icd.DESC_R as diag_name, concat(d.DIAG_TYPE, " - ", t.name) as diag_type ' +
      'from diag as d ' +
      'left join icd10 as icd on icd.CODE=d.DIAG_CODE ' +
      'left join diagtype as t on t.diagtype=d.DIAG_TYPE ' +
      'where d.HN=? and d.SEQ=? and d.HOSPCODE=?';

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
