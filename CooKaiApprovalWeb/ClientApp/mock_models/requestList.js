const casual = require('casual');

// eslint-disable-next-line no-return-assign
module.exports = casual.define('requestList', () => ({
  id: casual.integer((from = 1), (to = 10000)),
  Title: casual.title,
  RequestedOn: `${casual.date((format = 'DD-MM-YYYY'))}${' at '}${casual.time(format = 'HH:mm:ss')}`,
  Approver: casual.first_name + ' '+ casual.last_name,
  ResponseDate: `${casual.date((format = 'DD-MM-YYYY'))}${' at '}${casual.time(format = 'HH:mm:ss')}`,
  Status: casual.boolean,
}));
