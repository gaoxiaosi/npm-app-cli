#! /usr/bin/env node
const program = require('commander');

program
.version('0.1.0')
.command('create <name>')
.description('create a npm package')
.action(name => {
  require('../lib/create.js')(name);
});

program.parse(process.argv);