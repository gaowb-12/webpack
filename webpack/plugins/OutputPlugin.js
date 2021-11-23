const fs = require("fs");
const util = require("util");
const path = require("path");
const webpack = require("webpack");

const { RawSource } = webpack.sources;
const readFilePromise = util.promisify(fs.readFile);

// 一个 JavaScript class
class OutputPlugin {
    // 将 `apply` 定义为其原型方法，此方法以 compiler 作为参数
    apply(compiler) {
        // 指定要附加到的事件钩子函数,emit(异步串行,按顺序执行，碰到异步操作就等，然后在执行后面的)
        // compiler.hooks.emit.tapAsync(
        //     'OutputPlugin',
        //     (compilation, callback) => {
        
        //         // 使用 webpack 提供的 plugin API 操作构建结果
        //         // compilation.addModule(/* ... */);
        
        //         callback();
        //     }
        // );
        // 触发 compilation 事件之前执行，创建宏观的编译器，用于启动项目实例，调度compilation。
        compiler.hooks.thisCompilation.tap(
            'OutputPlugin',
            (compilation) => {
                // 使用 webpack 提供的 plugin API 操作构建结果
                // compilation编译器负责操作模块，依赖，资源相关的内容，也同compiler对象一样，可以注册钩子，同样都继承自tapable对象
                // additionalAssets异步串行钩子负责添加额外的资源（可以在这里下载资源）
                compilation.hooks.additionalAssets.tapAsync('OutputPlugin', async callback => {
                    const data = await readFilePromise(path.resolve(__dirname, "test.txt"));
                    // 要输出的资源列表中，添加一个test.txt文件
                    compilation.assets['a.txt'] = new RawSource(data);
                    callback();
                });
            }
        );
    }
}

module.exports = OutputPlugin;