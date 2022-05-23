const { readdir, mkdir, copyFile, stat } = require("node:fs/promises");
const path = require("path");

let sourceDir = ["assets"];
let destinationDir = ["project-dist"];
const makeDir = async (folderName) => {
  try {
    mkdir(
      path.resolve(__dirname, ...folderName),
      { recursive: true },
      (err) => {
        if (err) {
          throw new Error(`Folder can't be created because => ${err.message}`);
        }
      }
    );
  } catch (err) {
    throw new Error(`Folder can't be made because => ${err.message}`);
  }
};

const copyFiles = (src, dest) => {
  readdir(path.resolve(__dirname, ...src), { withFileTypes: true }).then(
    (srcFiles) => {
      for (let file of srcFiles) {
        stat(path.resolve(__dirname, ...src, file.name)).then((fileData) => {
          if (fileData) {
            if (fileData.isFile()) {
              console.log(file.name);
              copyFile(
                path.resolve(__dirname, ...src, file.name),
                path.resolve(__dirname, ...dest, file.name)
              );
            }
            if (fileData.isDirectory()) {
              makeDir([path.resolve(__dirname, ...dest)]);
              console.log([...src, file.name]);
              console.log([...dest, file.name]);
              copyFiles([...src, file.name], [...dest, file.name]);
            }
          }
        });
      }
    }
  );
};

makeDir(destinationDir);
copyFiles([...sourceDir], [...destinationDir, ...sourceDir]);
