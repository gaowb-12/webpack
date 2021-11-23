const fs = require("fs");
const util = require("util");
const path = require("path");
const webpack = require("webpack");
// 匹配文件列表
const globby = require("globby");

const { validate } = require('schema-utils');

const { RawSource } = webpack.sources;
const readFilePromise = util.promisify(fs.readFile);


// 校验传入的options
const schema = {
    type: 'object',
    properties: {
        from: {
            type: 'string'
        },
        to: {
            type: 'string'
        },
        ignore: {
            type: 'array'
        },
    },
    // 允许添加别的属性
    "additionalProperties": true
};

// 复制某些静态文件到输出目录
class CopyWebpackPlugin {
    constructor(options){
        validate(schema, options, {
            name:"CopyWebpackPlugin"
        });
        this.options = options;
    }
    
    apply(compiler) {
        // 触发 compilation 事件之前执行，初始化compilation。
        compiler.hooks.thisCompilation.tap(
            'CopyWebpackPlugin',
            (compilation) => {
                // additionalAssets异步串行钩子负责添加额外的资源
                compilation.hooks.additionalAssets.tapAsync('CopyWebpackPlugin', async callback => {
                    // 将from中的资源输出到to中去
                    const { from, ignore } = this.options;
                    const to = this.options.to ? this.options.to : ".";
                    // webpack配置中的context，运行指令的目录
                    const context = compiler.options.context;

                    // 1.读取from中的资源
                    let absoluteFrom = path.isAbsolute(from) ? from : path.resolve(context, from); // 获取绝对路径
                    absoluteFrom = absoluteFrom.replace(/\\/g, "\/")
                    // 2.过滤掉要忽略的文件
                    const paths = await globby(absoluteFrom, { ignore });

                    // 3.生成webpack格式的资源
                    const files = await Promise.all(paths.map(async absolutePath=>{
                        //读取文件
                        const data = await readFilePromise(absolutePath);
                        // 获取文件名称
                        const relativePath = path.basename(absolutePath);
                        // 跟to表示的目录结合
                        const filename = path.join(to,relativePath);

                        return {
                            data,
                            filename
                        }
                    }));
                    const assets = files.map(file=>{
                        // 生成webpack格式的数据
                        const source = new RawSource(file.data);
                        return {
                            source,
                            filename: file.filename
                        }
                    })
                    // 4.添加到compilation中，输出出去
                    assets.forEach(asset => {
                        compilation.assets[asset.filename] = asset.source;
                    });
                    callback();
                });
            }
        );
    }
}

module.exports = CopyWebpackPlugin;