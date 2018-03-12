// pages
var express = require('express');
var router = express.Router();

// page connect

router.get('/', function(req, res) {
  if (req.is_mobile) {
      res.render('mobile_main', { title: 'Express' });
  } else {
      res.render('main', { title: 'Express' });
  }
});

router.get('/admin', function(req, res, next) {
  if (req.session.admin) {
    res.render('admin');
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/admin/login', function(req, res, next) {
  if (req.session.admin) {
    res.redirect('/admin');
  } else {
    res.render('login');
  }
});


router.get('/privacy',function(req,res){
    res.render('privacy');
});

module.exports = router;
