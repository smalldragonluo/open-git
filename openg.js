/**
 * @author 龙喜<xiaolong.lxl@alibaba-inc.com>
 * @description openg.js
 */

'use strict';

const colors = require('colors/safe');

module.exports = function(args) {
  let port = args.browser || 'chrome';
  let cwd = args.cwd || process.cwd();

  // app.use(express.static(cwd));
  // // start server
  // server.listen(port, (err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(`now serving files from ${colors.yellow(cwd)}`);
  //     console.log(`please visit ${colors.green(`http:localhost${port == 80 ? '' : `:${port}`}/`)}`);
  //   }
  // });
};
