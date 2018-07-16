'use strict';

const Jasmine = require('jasmine');
const server = require('../index');

const jasmineLib = new Jasmine();

server.run();
jasmineLib.loadConfig({
  spec_dir: 'dist/specs',
  spec_files: ['**/*[sS]pec.js']
});

jasmineLib.execute();
