var home     = require('./lib/home');
var schedule = require('./lib/schedule');

// COMAND LINE ARGUMENTS
// 1: Username
// 2: Password
// 3: Home Config Path
// 4: Schedule Config Path

if (process.argv.length == 6) {
  console.log('Running Loxone-Home Scheduler');
  console.log('using:', process.argv[4]);
  console.log('using:', process.argv[5]);

  var loxone_home = home(process.argv[2], process.argv[3], process.argv[4]);
  schedule(loxone_home, process.argv[5]);
}
