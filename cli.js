#!/usr/bin/env node

const program = require('commander');
const mergeSCSS = require('./index');
const fs = require('fs');
const { promisify } = require('util');
const { version } = require('./package');

const writeFileAsync = promisify(fs.writeFile);

program
  .version(version, '-v, --version')
  .option('--in <file>', 'root SCSS file')
  .option('--out <file>', 'destination file')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

mergeSCSS(program.in)
  .then(scss => writeFileAsync(program.out, scss))
  .catch(console.error);
