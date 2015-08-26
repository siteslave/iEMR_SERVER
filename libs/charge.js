var Q = require('q');

module.exports = {
  getServiceCharge: function (db, hospcode, hn, seq) {
    var q = Q.defer();

    var sql = 'select c.CHARGE_CODE as charge_code, c.CHARGE_NAME as charge_name, ' +
      'c.PRICE as price, c.QTY as qty, c.PRICE*c.QTY as totalPrice from charge as c ' +
      'where c.HN=? and c.SEQ=? and c.HOSPCODE=?';

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
