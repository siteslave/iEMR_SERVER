var Q = require('q');
var fs = require('fs');
var path = require('path');
var Zip = require('jszip');
var _ = require('lodash');
var moment = require('moment');


module.exports = {
  doExtract: function (zipFile, extractPath) {
    var q = Q.defer();

    fs.readFile(zipFile, function (err, data) {
      if (err) q.reject(err);
      else {
        zip = new Zip();
        zip.folder(extractPath).load(data);
        Object.keys(zip.files).forEach(function (filename) {

          if(path.extname(filename) == '.txt') {
            var content = zip.files[filename].asNodeBuffer();
            fs.writeFileSync(filename, content);
          }
        });
        q.resolve();
        // _.forEach(zip.files, function (filename) {
        //   console.log(filename);
        //   //console.log(zip.files[filename]);
        // })
      }
    });

    return q.promise;
  },

  doImportPerson: function (db, file) {
    var q = Q.defer();
    var sql = 'LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE person ' +
      'FIELDS TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS ' +
      '(HOSPCODE, CID, HN, FNAME, LNAME, @BIRTH, SEX, TYPEAREA, @D_UPDATED) ' +
      'SET BIRTH=STR_TO_DATE(@BIRTH, "%Y%m%d"), D_UPDATED=STR_TO_DATE(@D_UPDATED, "%Y%m%d%H%i%s")';

    db.raw(sql, [file])
    .then(function () {
      q.resolve();
    })
    .catch(function (err) {
      q.reject(err);
    });

    return q.promise;
  },

  doImportService: function (db, file) {
    var q = Q.defer();
    var sql = 'LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE service ' +
      'FIELDS TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS ' +
      '(HOSPCODE, HN, SEQ, @DATE_SERV, TIME_SERV, BPS, BPD, WEIGHT, HEIGHT, CC, @D_UPDATED) ' +
      'SET DATE_SERV=STR_TO_DATE(@DATE_SERV, "%Y%m%d"), D_UPDATED=STR_TO_DATE(@D_UPDATED, "%Y%m%d%H%i%s")';

    db.raw(sql, [file])
    .then(function () {
      q.resolve();
    })
    .catch(function (err) {
      q.reject(err);
    });

    return q.promise;
  },

  doImportDiag: function (db, file) {
    var q = Q.defer();
    var sql = 'LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE diag ' +
      'FIELDS TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS ' +
      '(HOSPCODE, HN, SEQ, DIAG_CODE, DIAG_TYPE, @D_UPDATED) ' +
      'SET D_UPDATED=STR_TO_DATE(@D_UPDATED, "%Y%m%d%H%i%s")';

    db.raw(sql, [file])
    .then(function () {
      q.resolve();
    })
    .catch(function (err) {
      q.reject(err);
    });

    return q.promise;
  },

  doImportDrug: function (db, file) {
    var q = Q.defer();
    var sql = 'LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE drug ' +
      'FIELDS TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS ' +
      '(HOSPCODE, HN, SEQ, ICODE, QTY, PRICE, DRUG_NAME, UNIT, STDCODE, USAGE_NAME, @D_UPDATED) ' +
      'SET D_UPDATED=STR_TO_DATE(@D_UPDATED, "%Y%m%d%H%i%s")';

    db.raw(sql, [file])
    .then(function () {
      q.resolve();
    })
    .catch(function (err) {
      q.reject(err);
    });

    return q.promise;
  },

  doImportCharge: function (db, file) {
    var q = Q.defer();
    var sql = 'LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE charge ' +
      'FIELDS TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS ' +
      '(HOSPCODE, HN, SEQ, CHARGE_CODE, CHARGE_NAME, QTY, PRICE, @D_UPDATED) ' +
      'SET D_UPDATED=STR_TO_DATE(@D_UPDATED, "%Y%m%d%H%i%s")';

    db.raw(sql, [file])
    .then(function () {
      q.resolve();
    })
    .catch(function (err) {
      q.reject(err);
    });

    return q.promise;
  },

  doImportLab: function (db, file) {
    var q = Q.defer();
    var sql = 'LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE lab ' +
      'FIELDS TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS ' +
      '(HOSPCODE, HN, SEQ, LCODE, LNAME, LRESULT, LUNIT, @D_UPDATED) ' +
      'SET D_UPDATED=STR_TO_DATE(@D_UPDATED, "%Y%m%d%H%i%s")';

    db.raw(sql, [file])
    .then(function () {
      q.resolve();
    })
    .catch(function (err) {
      q.reject(err);
    });

    return q.promise;
  },

  doImportProced: function (db, file) {
    var q = Q.defer();
    var sql = 'LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE proced ' +
      'FIELDS TERMINATED BY "|" LINES TERMINATED BY "\n" IGNORE 1 ROWS ' +
      '(HOSPCODE, HN, SEQ, PROCED, PRICE, @D_UPDATED) ' +
      'SET D_UPDATED=STR_TO_DATE(@D_UPDATED, "%Y%m%d%H%i%s")';

    db.raw(sql, [file])
    .then(function () {
      q.resolve();
    })
    .catch(function (err) {
      q.reject(err);
    });

    return q.promise;
  }
};
