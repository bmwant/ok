
'use strict';
const chalk = require('chalk');

module.exports = (app, name) => {
  console.log(
    chalk.yellow('\nThis is help screen.') +
    chalk.dim('\nThis generator can also be run with: ') +
    chalk.blue(`help something\n`)
  );
};
