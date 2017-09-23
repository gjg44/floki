var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var qbEmployeeSchema = new Schema({
  Id: String,
  SyncToken: String,
  domain: String,
  MetaData: {
    CreateTime: String,
    LastUpdatedTime: String
  },
  Organization: Boolean,
  Title: String,
  GivenName: String,
  MiddleName: String,
  FamilyName: String,
  Suffix: String,
  DisplayName: String,
  PrintCheckName: String,
  Active: Boolean,
  PrimaryPhone: {
    FreeFormNumber: String
  },
  Mobile: {
    FreeFormNumber: String
  },
  PrimaryEmailAddr: {
    Address: String
  },
  EmployeeNumber: String,
  SSN: String,
  PrimaryAddr: {
    Id: String,
    Line1: String,
    Line2: String,
    Line3: String,
    Line4: String,
    Line5: String,
    City: String,
    Country: String,
    CountrySubDivisionCode: String,
    PostalCode: String,
    Lat: String,
    Long: String
  },
  BillableTime: Boolean,
  BillRate: Number,
  BirthDate: Date,
  Gender: String,
  HiredDate: Date,
  ReleasedDate: Date
});

var QBEmployee = mongoose.model('QBEmployee',qbEmployeeSchema);

module.exports = QBEmployee;
