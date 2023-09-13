'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const getWebpackConfig = require('./webpack.prod.conf.component.js')

console.log(getWebpackConfig)

module.exports = function (_configOptions){

    console.log(_configOptions)

    const options = _configOptions || {
        entry: {
            // 名称
            name: 'img',
            // 入口文件
            path: '../src/components/common/other/img/enter.js'
        },
        output: {
            // 输出路径
            path: '../src/components/common/other/img/dist'
        }

    };
    const spinner = ora('【构建中】请等待...')
    spinner.start()
    spinner.color = 'yellow';

    const outputPath = options.output.path

    rm(path.join(path.resolve(__dirname, outputPath), 'static'), err => {
        if (err) throw err
        console.log(chalk.red('【清除原始目录成功】！'))
        console.log(chalk.yellow('【开始构建】！'))
        webpack(getWebpackConfig(options), (err, stats) => {
            spinner.stop()
            if (err) throw err
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
                chunks: false,
                chunkModules: false
            }) + '\n\n')

            if (stats.hasErrors()) {
                console.log(chalk.red('  Build failed with errors.\n'))
                process.exit(1)
            }

            console.log(chalk.cyan('  Build complete.\n'))
            console.log(chalk.yellow(
                '  Tip: built files are meant to be served over an HTTP server.\n' +
                '  Opening index.html over file:// won\'t work.\n'
            ))
            console.log(chalk.green('【完成构建】！'))
        })

    })

}
