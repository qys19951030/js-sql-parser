'use strict';

const parser = require('../');
const assert = require('assert');

describe('normalize support', function () {
  it('skeleton: normalize is exposed on the parser', function () {
    assert.strictEqual(typeof parser.normalize, 'function');
  });
});
