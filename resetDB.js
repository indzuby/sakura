var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost');

var mongoose_db = mongoose.connection;
mongoose_db.on('error', console.error);
mongoose_db.once('open', function() {
  console.log("Connected to mongd server");
});

autoIncrement.initialize(mongoose.connection);

var bookSchema = new Schema({
  'orderNumber': Number,
  'phoneNumber': String,
  'ip': String,
  'platform': String
});

bookSchema.plugin(autoIncrement.plugin, {
  'model': 'book',
  'field': 'orderNumber',
  'startAt': 1
});

var book = mongoose.model('book', bookSchema);

book.remove({}).exec(function(err) {
  console.log(err);
  book.resetCount(function() {
  });
});
