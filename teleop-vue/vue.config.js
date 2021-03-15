// vue.config.js

process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
    publicPath: process.env.VUE_APP_SUBPATH,
    css: {
        loaderOptions: {
            css: {},
            sass: {
                prependData: `@import "~@/app.scss";`
            },
            scss: {
                prependData: `@import "~@/app.scss";`
            }
        }
    },
    chainWebpack: config => {
        config.module
            .rule("svg")
            .use("file-loader")
            .loader("file-loader")
            .end()
            .use("raw-loader")
            .loader("raw-loader")
            .end();
    }
};