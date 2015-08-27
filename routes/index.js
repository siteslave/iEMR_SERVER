var express = require('express');
var router = express.Router();
var importor = require('../libs/importor');
var auth = require('../libs/auth');
var service = require('../libs/service');
var diag = require('../libs/diag');
var proced = require('../libs/proced');
var drug = require('../libs/drug');
var lab = require('../libs/lab');
var charge = require('../libs/charge');

var fse = require('fs-extra');
var path = require('path');
var moment = require('moment');
var Finder = require('fs-finder');
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ok: true, msg: "Welcome to iEMR"});
});

router.post('/service_list', function (req, res, next) {
  var hospcode = req.body.hospcode,
    key = req.body.key,
    cid = req.body.cid;

  auth.doAuth(req.db, hospcode, key)
  .then(function (success) {
    if (success > 0) {
      // Get service list
      service.getServiceList(req.db, cid)
      .then(function (rows) {
        res.send({ok: true, rows: rows});
      }, function (err) {
        res.send({ok: false, msg: err});
      })
    } else {
      res.send({ok: false, msg: 'Authentication failed.'});
    }
  }, function (err) {
    res.send({ok: false, msg: err});
  });

});

// Get service history list
router.post('/service_history', function (req, res, next) {
  var hospcode = req.body.hospcode,
    key = req.body.key,
    cid = req.body.cid;

  auth.doAuth(req.db, hospcode, key)
    .then(function (success) {
      if (success > 0) {
        service.getServiceList(req.db, cid)
          .then(function (rows) {
            res.send({ok: true, rows: rows});
          })
      } else {
        res.send({ok: false, msg: 'Authentication failed.'});
      }
    }, function (err) {
      res.send({ok: false, msg: err});
    })
});

router.post('/service_detail', function (req, res, next) {
  var hospcode = req.body.hospcode,
    key = req.body.key,
    seq = req.body.seq,
    date_serv = req.body.date_serv,
    service_hospcode = req.body.service_hospcode,
    hn = req.body.hn;

  var results = {};

  auth.doAuth(req.db, hospcode, key)
  .then(function (success) {
    if (success > 0) {
      // Get service list
      service.getServiceDetail(req.db, service_hospcode, hn, date_serv, seq)
      .then(function (data) {
        results.detail = data;
        return diag.getServiceDiag(req.db, service_hospcode, hn, seq);
      })
      .then(function (data) {
        results.diag = data;
        return proced.getServiceProced(req.db, service_hospcode, hn, seq);
      })
      .then(function (data) {
          results.proced = data;
          return drug.getServiceDrug(req.db, service_hospcode, hn, seq);
      })
      .then(function (data) {
          results.drug = data;
          return lab.getServiceLab(req.db, service_hospcode, hn, seq);
      })
      .then(function (data) {
        results.lab = data;
        return charge.getServiceCharge(req.db, service_hospcode, hn, seq);
      })
      .then(function (data) {
        results.charge = data;
        res.send({ok: true, rows: results});
      }, function (err) {
        res.send({ok: false, msg: err});
      })
    } else {
      res.send({ok: false, msg: 'Authentication failed.'});
    }
  }, function (err) {
    res.send({ok: false, msg: err});
  });

});

router.post('/upload', function (req, res) {
  // console.log(req.body);
  // console.log(req.files.files.path);

  // extracted path
  var extractDirectory = path.join('./extracted', moment().format('YYYYMMDDHHmmss'));
  // Create extracted dir
  fse.ensureDirSync(extractDirectory);

  importor.doExtract(req.files.files.path, extractDirectory)
  .then(function () {
    // Get file list
    var files = Finder.from(extractDirectory).findFiles('*.txt');
    var objFiles = {};

    if (_.size(files)) {
      _.forEach(files, function (file) {
        var fileName = path.basename(file).toUpperCase();

        if (fileName == 'PERSON.TXT') objFiles.person = file;
        if (fileName == 'SERVICE.TXT') objFiles.service = file;
        if (fileName == 'DIAG.TXT') objFiles.diag = file;
        if (fileName == 'PROCED.TXT') objFiles.proced = file;
        if (fileName == 'DRUG.TXT') objFiles.drug = file;
        if (fileName == 'LAB.TXT') objFiles.lab = file;
        if (fileName == 'CHARGE.TXT') objFiles.charge = file;
      });

      var promise = importor.doImportPerson(req.db, objFiles.person)
      promise.then(function () {
        return importor.doImportService(req.db, objFiles.service);
      })
      .then(function () {
        return importor.doImportDiag(req.db, objFiles.diag);
      })
      .then(function () {
        return importor.doImportDrug(req.db, objFiles.drug);
      })
      .then(function () {
        return importor.doImportCharge(req.db, objFiles.charge);
      })
      .then(function () {
        return importor.doImportLab(req.db, objFiles.lab);
      })
      .then(function () {
        return importor.doImportProced(req.db, objFiles.proced);
      })
      .then(function () {
        // Remove extracted directory
        fse.removeSync(extractDirectory);
        res.send({ok: true});
      }, function (err) {
        console.log(err);
        res.send({ok: false, msg: err});
      });
    }

  }, function (err) {
    console.log(err);
    res.send({ok: false, msg: err});
  });

});

module.exports = router;
