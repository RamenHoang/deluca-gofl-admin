const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      // Your existing rules for loaders like babel-loader, css-loader, etc.
    ],
  },
  resolve: {
    fallback: {
      assert: require.resolve("assert/"),
    },
  },
};
