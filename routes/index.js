// restAPIs
var express = require('express');
var router = express.Router();
var xlsx = require('node-xlsx').default;
var fs = require('fs');

var serviceURL = 'http://www.sakura.com/';

var getDateString = function(data) {
  var date = new Date(data);
  var dateString = '';
  var month = (date.getMonth() + 1).toString();
      month = month.length == 1 ? '0' + month : month;
  var _date = date.getDate().toString();
      _date = _date.length == 1 ? '0' + _date : _date;
  var day = date.getDay();
      switch (day) {
        case 0:
          day = '일';
          break;
        case 1:
          day = '월';
          break;
        case 2:
          day = '화';
          break;
        case 3:
          day = '수';
          break;
        case 4:
          day = '목';
          break;
        case 5:
          day = '금';
          break;
        case 6:
          day = '토';
          break;
      }
  var hours = date.getHours().toString();
      hours = hours.length == 1 ? '0' + hours : hours;
  var minutes = date.getMinutes().toString();
      minutes = minutes.length == 1 ? '0' + minutes : minutes;
  var seconds = date.getSeconds().toString();
      seconds = seconds.length == 1 ? '0' + seconds : seconds;
      dateString += date.getFullYear();
      dateString += '-';
      dateString += month;
      dateString += '-';
      dateString += _date;
      dateString += ' ';
      dateString += '(' + day + ')';
      dateString += ' ';
      dateString += hours;
      dateString += ':';
      dateString += minutes;
      dateString += ':';
      dateString += seconds;
      return dateString;
}

router.post('/test', function(req, res, next) {
  res.json(true);
});

// booking
router.post('/book', function(req, res, next) {
  // res.json(true);
  var phoneNumber = req.body.phoneNumber; // send string!!!!
  var platform = req.body.platform;
  var userIp =  req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

  /*----------------------------------------------

    error code list

    code  1 : db find error
          2 : already booked phoneNumber
          3 : db save error

  ----------------------------------------------*/

  db.book.find({
    'phoneNumber': phoneNumber
  }).limit(1).exec(function(err, data) {
    if (err) {
      res.json({
        'result': false,
        'code': 1
      });
    } else {
      if (data.length) {
        res.json({
          'result': false,
          'code': 2,
          'inviteURL': data[0].inviteURL
        });
      } else {
        var newBook = new db.book({
          'phoneNumber': phoneNumber,
          'ip': userIp,
          'platform': platform,
          'device': req.is_mobile ? 'mobile' : 'web',
          'timeStamp': new Date()
        });

        newBook.save(function(err) {
          if (err) {
            res.json({
              'result': false,
              'code': 3
            });
          } else {
            res.json({
              'result': true
            });
          } 
        });
      }
    }
  });
});

// get book list pagination
router.get('/book', function(req, res, next) {
  if (req.session.admin) {
    var sortQuery = {};
    sortQuery[req.query.columns[req.query.order[0].column].data] = req.query.order[0].dir == 'asc' ? 1 : -1;

    db.book.count(function(err, count) {
      db.book.find({})
      .sort(sortQuery)
      .skip(parseInt(req.query.start, 10))
      .limit(parseInt(req.query.length, 10))
      .exec(function(err, data) {
        var obj = {
          "draw": req.query.draw,
          "recordsTotal": count,
          "recordsFiltered": count,
          'data': JSON.stringify(data)
        }
        res.json(obj);
      });
    });
  } else {
    res.json(false);
  }
});

// download xlsx
router.get('/book/xlsx', function(req, res, next) {
  db.book.find({}).exec(function(err, data) {
    if (err) {
      res.json(false);
    } else {
      var xlsxData = [['참여번호', '전화번호', '시간', '접속기기', 'OS',' IP']];
      for (var i = 0 ; i < data.length; i++) {
        xlsxData.push([
          data[i].orderNumber,
          data[i].phoneNumber,
          getDateString(data[i].timeStamp),
          data[i].device,
          data[i].platform,
          data[i].ip
        ]);
      }

      var xlsxBuffer = xlsx.build([{name: "data", data: xlsxData}]);

      fs.writeFile('list.xlsx', xlsxBuffer, function(err) {
        res.download('list.xlsx', function() {
          fs.unlink('list.xlsx');
        });
      });
    }
  });
});

router.post('/login', function(req, res, next) {
  var id = req.body.id;
  var password = req.body.password;

  db.user.find({
    'id': id,
    'password': password
  }).limit(1).exec(function(err, data) {
    if (!err && data.length && data[0].level > 1) {
      req.session.admin = true;
      res.json(true);
    } else {
      res.json(false);
    }
  });
});

router.post('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});

module.exports = router;
