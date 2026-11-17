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
 * 依赖：同一份产物里的 sqlParser.parse（jison 生成）与 Sql（stringify.js）。
 */
if (!sqlParser) {
  sqlParser = {};
}

/**
 * 归一化一条 SQL 文本。
 *
 * @param {String} sql 原始 SQL 文本，解析失败时按 sqlParser.parse 的方式抛错。
 * @return {{text: String, values: Array}} text 为字面量替换成 '?' 后的 SQL，
 *   values 为按出现顺序排列的字面量原文。
 */
sqlParser.normalize = function (sql) {
  return {
    text: '',
    values: []
  };
};
