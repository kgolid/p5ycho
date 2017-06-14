module.exports = {
  entry: {
    perlin: './sketches/perlin/perlin.js',
    gaussian: './sketches/gaussian/gaussian.js'
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