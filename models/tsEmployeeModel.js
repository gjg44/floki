var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tsEmployeeSchema = new Schema({
  id: Number,
  first_name: String,
  last_name: String,
  group_id: Number,
  active: Boolean,
  employee_number: Number,
  salaried: Boolean,
  exempt: Boolean,
  username: String,
  email: String,
  email_verified: Boolean,
  payroll_id: String,
  mobile_number: String,
  hire_date: String,
  term_date: String,
  last_modified: String,
  last_active: String,
  created: String,
  client_url: String,
  company_name: String,
  profile_image_url: String,
  pto_balances:
    [{
      jobcode: String,
      pto_balance: Number
    }],
  approved_to: String,
  manager_of_group_ids: [Number],
  require_password_change: Boolean,
  pay_rate: Number,
  pay_interval: String,
  permissions:
   { admin: Boolean,
     mobile: Boolean,
     status_box: Boolean,
     reports: Boolean,
     manage_timesheets: Boolean,
     manage_authorization: Boolean,
     manage_users: Boolean,
     manage_my_timesheets: Boolean,
     manage_jobcodes: Boolean,
     pin_login: Boolean,
     approve_timesheets: Boolean,
     manage_schedules: Boolean,
     external_access: Boolean,
     manage_my_schedule: Boolean,
     manage_company_schedules: Boolean,
     view_company_schedules: Boolean,
     view_group_schedules: Boolean,
     manage_no_schedules: Boolean,
     view_my_schedules: Boolean
    },
  customfields: String
});

var TSEmployee = mongoose.model('TSEmployee',tsEmployeeSchema);

module.exports = TSEmployee;
