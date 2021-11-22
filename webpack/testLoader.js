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

module.exports = function(source) {
//   const options = getOptions(this);

//   validateOptions(schema, options, 'Example Loader');

  // 对资源应用一些转换……
    console.log("---------------------source------------------------",source)
  return `module.exports = ${ JSON.stringify(source) }`;
}