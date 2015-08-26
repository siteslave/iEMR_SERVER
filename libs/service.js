var Q = require('q');

module.exports = {
  getServiceList: function (db, cid) {
    var q = Q.defer();

    var sql = 'select s.HOSPCODE as hospcode, h.hospname, s.DATE_SERV as date_serv, ' +
        's.SEQ as seq, s.HN as hn ' +
        'from service as s ' +
        'left join hospital as h on h.hospcode=s.HOSPCODE '+
        'where concat(s.HOSPCODE, s.HN) in ( ' +
        'select concat(p.HOSPCODE, p.HN) as hn ' +
        'from person as p ' +
        'where p.CID=? ' +
        ') order by s.DATE_SERV asc';

        db.raw(sql, [cid])
        .then(function (rows) {
          q.resolve(rows[0]);
        })
        .catch(function (err) {
          q.reject(err);
        });

      return q.promise;
  },

  getServiceDetail: function (db, hospcode, hn, date_serv, seq) {
    var q = Q.defer();
    var sql = 'select s.SEQ as seq, h.hospcode, h.hospname, ' +
      's.DATE_SERV as date_serv, s.TIME_SERV as time_serv, ' +
      's.HEIGHT as height, s.WEIGHT as weight, s.BPD as bpd, s.BPS as bps, s.CC as cc ' +
      'from service as s ' +
      'left join hospital as h on h.hospcode=s.HOSPCODE ' +
      'where s.HOSPCODE=? and s.DATE_SERV=? and s.SEQ=? and s.HN=?';

      db.raw(sql, [hospcode, date_serv, seq, hn])
      .then(function (rows) {
        q.resolve(rows[0][0]);
      })
      .catch(function (err) {
        q.reject(err);
      });

    return q.promise;
  }
};
