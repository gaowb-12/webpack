const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');
const babel = require("@babel/core");
const util = require("util");

// 转为基于promise异步处理函数
const transform = util.promisify(babel.transform);

// 校验传入的options
const schema = {
  type: 'object',
  properties: {
    presets: {
      type: 'array',
      "description": "This is presets",
    },
  },
  // 允许添加别的属性
  "additionalProperties": true
};

// 异步loader
module.exports = function(source, map, meta) {
  const options = getOptions(this)||{};

  validate(schema, options, {
    name:"babelLoader"
  });
  // 调用async时loader就不执行了，等到callback被调用时才继续执行
  const callback = this.async();

  // 使用babel编译代码
  transform(source, options)
  .then(({code, map})=>{
    callback(null, code, map)
  })
  .catch(err=>{
    callback(err)
  })
}