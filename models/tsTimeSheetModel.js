var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tsTimeSheetSchema = new Schema({
  id: Number,
  user_id: Number, 
  jobcode_id: Number,
  locked: Number, 
  notes:  String,
  customfields:  [], 
  created: String,
  last_modified: String,
  type: String,
  on_the_clock: Boolean,
  start: String,
  end: String,
  date:  String,
  duration: Number
});

var TimeSheet = mongoose.model('TimeSheet',tsTimeSheetSchema);

module.exports = TimeSheet;
