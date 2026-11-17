'use strict';

const parser = require('../');
const assert = require('assert');

describe('normalize support', function () {
  it('skeleton: normalize is exposed on the parser', function () {
    assert.strictEqual(typeof parser.normalize, 'function');
  });

  describe('literal collection', function () {
    it('replaces string and number literals with ? and collects originals in order', function () {
      var result = parser.normalize(
        "select a from b where c = 'hi' and d = 1"
      );
      assert.strictEqual(
        result.text,
        " SELECT a FROM b WHERE c = ? AND d = ?"
      );
      assert.deepStrictEqual(result.values, ["'hi'", '1']);
    });

    it('treats boolean and null as keywords, no placeholders', function () {
      var result = parser.normalize(
        'select a from b where c = true and d = false and e is null'
      );
      assert.strictEqual(
        result.text,
        ' SELECT a FROM b WHERE c = TRUE AND d = FALSE AND e IS NULL'
      );
      assert.deepStrictEqual(result.values, []);
    });

    it('normalizes literals in the select item list', function () {
      var result = parser.normalize("select 1, 'x' from b");
      assert.strictEqual(result.text, ' SELECT ?, ? FROM b');
      assert.deepStrictEqual(result.values, ['1', "'x'"]);
    });
  });
});
