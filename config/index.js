var configValues = require('./config');

module.exports = {
  
  getDbConnectionString: function() {
    return 'mongodb://' + configValues.uname + ':' + configValues.pwd + '@ds133964.mlab.com:33964/rrj-test1';
  }
}
