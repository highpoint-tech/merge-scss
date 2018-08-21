#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const postcss = require('postcss');
const easyImport = require('postcss-easy-import');
const scssSyntax = require('postcss-scss');
const stripInlineComments = require('postcss-strip-inline-comments');
const { promisify } = require('util');
const { version } = require('./package');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const postcssConfig = [
  easyImport({
    extensions: ['.css', '.scss'],
    prefix: '_'
  }),
  stripInlineComments
];

program
  .version(version, '-v, --version')
  .option('--in <file>', 'root SCSS file')
  .option('--out <file>', 'destination file')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

readFileAsync(program.in, 'utf8')
  .then(data =>
    postcss(postcssConfig).process(data, {
      from: program.in,
      parser: scssSyntax
    })
  )
  .then(({ css }) => writeFileAsync(program.out, css))
  .catch(console.error);
