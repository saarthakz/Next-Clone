import { readdirSync, statSync } from "fs";
import { join } from "path";

function getFilesRecursive(directory, files) {
  const filesInDirectory = readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = join(directory, file);
    if (statSync(absolute).isDirectory()) {
      getFilesRecursive(absolute, files);
    } else {
      files.push(absolute);
    };
  };
};

export default getFilesRecursive;