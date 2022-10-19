import { basename, dirname } from 'node:path';
import nodemon from 'nodemon';

nodemon({
  script: 'server.js',
  ext: 'js, jsx',
  ignore: ["./node_modules"],
  watch: [
    "components",
    "pages",
    "props"
  ]
});

nodemon.on('restart', function (files) {
  const cd = basename(process.cwd());
  const modFilePath = files[0].split(cd)[1].replaceAll("\\", "/");
  const pathSplits = modFilePath.split("/");
  const modFileDir = pathSplits[1];



});