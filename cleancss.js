// var request = require('request');
var CleanCSS = require('clean-css');
var source = '@import url(./src/index.css);';
var fs = require('fs');
var path = require('path');
var minCssPath = path.join(__dirname, 'dist/paging.css');

new CleanCSS({
  returnPromise: true
}).minify(source)
  .then(function (output) {
    // console.log(output.styles);
    return output.styles;
  })
  .then(function (minStyleBody) {
    fs.writeFile(minCssPath, minStyleBody, function (err) {
      if (err) throw err;
      console.log('The clean css has been saved in ' + minCssPath);
    });
  })
  .catch(function (error) {
    // deal with errors
    console.log(error);
  });
