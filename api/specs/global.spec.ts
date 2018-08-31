'use strict';

// import { User } from '../models/user.model';

const Jasmine = require('jasmine');
const server = require('../index');

const jasmineLib = new Jasmine();

server.run();
// TODO: Create TestUser and use jwt for test specs as mongoose can be used here
// User.find({}).then((result) => {
jasmineLib.loadConfig({
  spec_dir: 'dist/specs',
  spec_files: ['**/*[sS]pec.js']
});

jasmineLib.execute();
// });

