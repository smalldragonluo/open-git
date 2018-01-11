/**
 * @author 龙喜<xiaolong.lxl@alibaba-inc.com>
 * @description openg.js
 */

'use strict';

const colors = require('colors/safe');
const path = require('path');
const open = require('open');
const co = require('co');
const utils = require("./lib/utils");

module.exports = function(args) {
  return co(function *() {
    let cwd = args.cwd || process.cwd();
    let homePage;
    let packageJSON;

    try {
      packageJSON = require(path.join(cwd, 'package.json'));
    } catch (e) {
      // no op
    }

    if (packageJSON && packageJSON.homepage) {
      homePage = packageJSON && packageJSON.homepage;
    } else {
      try {
        let remoteURL = yield utils.execs(cwd, 'git config --get remote.origin.url');

        if (!remoteURL) {
          throw new Error('no remote URL specified.');
        }

        if (remoteURL.match(/^https?:\/\//)) {
          homePage = remoteURL;
        } else {
          let matchedRemote = remoteURL.match(/git@([^:]+):([^\/]+)\/(.+)\.git/);

          if (matchedRemote) {
            homePage = `http://${matchedRemote[1]}/${matchedRemote[2]}/${matchedRemote[3]}`;
          } else {
            throw new Error('unsupported remote format.');
          }
        }
      } catch (err) {
        String(err.stack);
        err.message = 'get origin URL failed.';

        throw err;
      }
    }

    open(homePage, args.browser);
  }).catch(function(err) {
    console.error(colors.red(err.message), colors.red(err.stack));
  });
};
