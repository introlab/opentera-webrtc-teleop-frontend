module.exports = {
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        postcssOptions: {
          plugins: function() {
            return [require("autoprefixer")];
          }
        }
      },
      scss: {
        additionalData: `@import "~@/app.scss";`
      }
    }
  }
};
