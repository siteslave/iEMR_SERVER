var Q = require('q');

module.exports = {
  getServiceDrug: function (db, hospcode, hn, seq) {
    var q = Q.defer();

    var sql = 'select d.DRUG_NAME as drug_name, d.USAGE_NAME as usage_name, ' +
      'd.STDCODE as stdcode, d.UNIT as unit, d.PRICE as price , d.QTY as qty, d.PRICE*d.QTY as totalPrice ' +
      'from drug as d ' +
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
