// import { getOptions } from 'loader-utils';
// import validateOptions from 'schema-utils';

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
};

// 同步loader
// module.exports = function(source, map, meta) {
//   // 对资源应用一些转换……
//     console.log("---------------------source------------------------",source)

//     // 通过this.callback同步执行，或者return返回
//   // this.callback(null, source, map, meta)
//   return `module.exports = ${ JSON.stringify(source) }`;
// }

// 异步loader
module.exports = function(source, map, meta) {
  //   const options = getOptions(this);

//   validateOptions(schema, options, 'Example Loader');

  // 调用async时loader就不执行了，等到callback被调用时才继续执行
  const callback = this.async();
  setTimeout(() => {
    callback(source, map, meta)
  }, 1000);
}

// 写在上面的loader先执行这个方法
module.exports.pitch = function(){
  console.log("pitch 111")
}