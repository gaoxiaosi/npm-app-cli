#! /usr/bin/env node
const program = require('commander');

program
.version('1.0.0')
.command('create <name>')
.description('create a npm package')
.action(name => {
    console.log("npm package name is " + name)
});

program.parse(process.argv);