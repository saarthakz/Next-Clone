import nodemon from 'nodemon';

nodemon({
  script: 'server.js',
  ext: 'js, jsx',
  ignore: ["./node_modules",
    "./_pages",
    "./_components",
    "./script.js",
    "./transpiledScript.js",
    "public"]
});

nodemon
  .on('start', function () {
    console.log('App has started');
  })
  .on('quit', function () {
    console.log('App has quit');
    process.exit();
  })
  .on('restart', function (files) {
    console.log('App restarted due to: ', files);
  });