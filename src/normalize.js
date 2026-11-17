/**
 * normalize.js
 *
 * SQL 归一化能力：从 AST 出发，把语句里的字面量（字符串、数值）按出现顺序
 * 抽成占位符 '?'，输出规范化的模板文本 text 与字面量原文数组 values。
 *
 * 规则：
 * - 字符串（String）与数值（Number）算字面量；负数连同 '-' 符号整体算一个；
 *   小数、科学计数法、十六进制数值整段算一个。
 * - 布尔值（Boolean/BooleanExtra）与空值（Null）是关键字，不占位、不进 values。
 * - 关键字沿用 stringify 的规则统一大写，标识符（含反引号引号标识符）保持原样。
 * - 注释与多余空白由解析 + 重建文本的过程自然去除。
 * - values 的次序与 text 中 '?' 从左到右的次序一一对应；子查询、IN 列表、
 *   BETWEEN、LIMIT 等嵌套位置的字面量都在各自位置上被收走。
 *
 * 实现方式：Normalizer 继承 stringify.js 里 Sql 的全部 travel* 方法，
 * 只覆写字面量、前缀、LIMIT 等少数节点，因此重建文本的格式与 stringify 完全一致，
 * 字面量的访问顺序也自然等于文本从左到右的顺序。
 */
if (!sqlParser) {
  sqlParser = {};
}

function Normalizer() {
  this.buffer = '';
  this.values = [];
}

// 继承 Sql 的遍历骨架与输出方法（append/appendKeyword 依赖实例上的 buffer）。
Normalizer.prototype = Object.create(Sql.prototype);
Normalizer.prototype.constructor = Normalizer;

/**
 * 归一化一条 SQL 文本。
 *
 * @param {String} sql 原始 SQL 文本，解析失败时按 sqlParser.parse 的方式抛错。
 * @return {{text: String, values: Array}} text 为字面量替换成 '?' 后的 SQL，
 *   values 为按出现顺序排列的字面量原文。
 */
sqlParser.normalize = function (sql) {
  var ast = sqlParser.parse(sql);
  var normalizer = new Normalizer();
  normalizer.travelMain(ast);
  return {
    text: normalizer.buffer,
    values: normalizer.values
  };
};

// 字符串字面量：收原文，文本位置换成 '?'。
Normalizer.prototype.travelString = function (ast) {
  this.values.push(ast.value);
  this.append('?');
};

// 数值字面量：收原文，文本位置换成 '?'。
Normalizer.prototype.travelNumber = function (ast) {
  this.values.push(ast.value);
  this.append('?');
};

// 布尔值与空值是关键字，沿用 Sql 的实现，不占位、不进 values。
Normalizer.prototype.travelNull = Sql.prototype.travelNull;
Normalizer.prototype.travelBoolean = Sql.prototype.travelBoolean;
Normalizer.prototype.travelBooleanExtra = Sql.prototype.travelBooleanExtra;

// 已有的占位符（${param} 或 '?'）原样保留，不计入本次 values。
Normalizer.prototype.travelPlaceHolder = Sql.prototype.travelPlaceHolder;
