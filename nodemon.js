import { basename, dirname } from 'node:path';
import nodemon from 'nodemon';
import { execSync } from "node:child_process";

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

nodemon
  .on('restart', async function (files) {
    await import("./build.js");
    // execSync("node build.js");
    // const _ = require("./build.js");
    // console.log(_);
    // const cd = basename(process.cwd());
    // const modFilePath = files[0].split(cd)[1].replaceAll("\\", "/");
    // const pathSplits = modFilePath.split("/");
    // const modFileDir = pathSplits[1];
  });