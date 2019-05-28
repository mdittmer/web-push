'use strict';

const assert = require('assert');
const mocha = require('mocha');
const path = require('path');

const DIST_PATH = `${__dirname}${path.sep}dist`;

suite('Webpack', function() {
  test('build', function(done) {
    mocha.after(function() {
      const fs = require('fs');
      const path = DIST_PATH;

      // From https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty#answer-32197381
      // Remove dist path.
      if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
          var curPath = path + "/" + file;
          if (fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
    });

    const webpack = require('webpack');
    webpack({
      // Relative to base web-push dir when tests invoked via, e.g.,
      // node --harmony node_modules/.bin/istanbul cover node_modules/.bin/_mocha -- --ui tdd test/test*
      entry: './src/index.js',
      output: {path: DIST_PATH},
    }, function(err, stats) {
      assert(!err, `Expected no error but got ${err}`);
      assert(!stats.hasErrors(), `Expected no stats errors but got ${stats.toJson().errors}`);
      done();
    });
  }).timeout(10000);
});
