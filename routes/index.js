var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;

// twilio
var accountSid = ''//auth;
var authToken = ''//auth;

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);



router.post('/notify', function(req, res, next){
  var phonenum = req.body.phone;
  var nombre = req.body.name;
  console.log(phonenum);

  client.messages.create({
      to: phonenum,
      from: "+13479527379",
      body: "Hi "+ nombre+", are you ready to LAZZZZZZZZZER?!?!?!?!",
  }, function(err, message) {
    if(err){
      console.log(err)
    }else{
      console.log(message.body);
      console.log(message.sid);
    }
  });
});


var userDataSchema = new Schema({
  name: {type: String, required: true},
  phone: String,
  email: String
}, {collection: 'user-data'});

var UserData = mongoose.model('UserData', userDataSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  UserData.find()
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.post('/insert', function(req, res, next) {
  var item = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email
  };

  var data = new UserData(item);
  data.save();

  res.redirect('/');
});

router.post('/update', function(req, res, next) {
  var id = req.body.id;

  UserData.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.name = req.body.name;
    doc.phone = req.body.phone;
    doc.email= req.body.email;
    doc.save();
  })
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
});

module.exports = router;
