module.exports = {
  entry: {
    perlin: './sketches/perlin/perlin.js'
  },

  output: {
    filename: "[name].js"
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['./hot'] },
    ]
  }
};