/**
 * @author 龙喜<xiaolong.lxl@alibaba-inc.com>
 * @description test
 */

'use strict';

const co = require('co');
// const expect = require('chai').expect;
const openg = require('../openg');

describe('Git open', function() {
  describe('#default()', function() {
    it('should open git page', function() {
      return co(function* () {
        yield openg({
          cwd: '/Users/smalldragonluo/code/tms/tms-test/mod/lx-test-20171011'
        });
      });
    });
  });
});
