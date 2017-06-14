module.exports = {
  entry: {
    perlin: './sketches/perlin/perlin.js',
    gaussian: './sketches/gaussian/gaussian.js'
  },

  output: {
    path: __dirname + "/sketches",
    filename: "[name].js"
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['./hot'] },
    ]
  }
};
