var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var bookSchema = new Schema({
  'orderNumber': Number,
  'phoneNumber': String,
  'ip': String,
  'device': String,
  'platform': String,
  'timeStamp': Date
});

bookSchema.plugin(autoIncrement.plugin, {
  'model': 'book',
  'field': 'orderNumber',
  'startAt': 1
});

var userSchema = new Schema({
  'id': String,
  'password': String,
  'level': Number
});

var book = mongoose.model('book', bookSchema);
var user = mongoose.model('user', userSchema);

module.exports = {
  'book' : book,
  'user': user
};
