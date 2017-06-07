const acorn = require('acorn');

/**
 * webpack loader for hot patching top level functions on file change
 * inspired by https://github.com/jlongster/monkey-hot-loader
 */
module.exports = function (source) {
  if (this.cacheable) {
    this.cacheable();
  }

  const ast = acorn.parse(source);
  const names = JSON.stringify(
    ast.body
      .filter(node => node.type == 'FunctionDeclaration')
      .map(node => node.id.name));

  const s = `${source};
var hot = module.hot;
if (hot) {
  hot.accept(err => console.log('error', err));

  var keep = (bindings, evalstr) =>
    hot.dispose(function (data) {
      data.bindings = bindings;
      data.evalstr = evalstr;
    });

  if (!hot.data) {
    var bindings = {}, exports = module.exports;
    ${names}.forEach(function (name) {
      var f = eval(name);
      var proxied = new Proxy(f, {
        apply: function (f, self, args) {
          return (bindings[name] || f).apply(self, args);
        }
      });
      eval(name + " = proxied;");
      if (exports[name]) exports[name] = proxied;
    });
    keep(bindings, str => eval(str));
  }
  else {
    var data = hot.data, bindings = data.bindings;
    ${names}.forEach(function (name) {
      bindings[name] = data.evalstr(
        '(' +
        eval(name).toString()
                  .replace(/^function \\w+\\(/,
                           'function (') +
        ')');
    });
    keep(bindings, data.evalstr);
  }
}`;

  this.callback(null, s);
};
