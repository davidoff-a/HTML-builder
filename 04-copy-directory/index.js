const { readdir, mkdir, copyFile, stat, access } = require("node:fs/promises");
const path = require("path");

let sourceDir = ["files"];
let destinationDir = ["files-copy"];
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
const copyFiles = async (src, dest) => {
  const srcFiles = await readdir(path.resolve(__dirname, ...src), {
    withFileTypes: true,
  });
  for (let file of srcFiles) {
    const fileData = await stat(path.resolve(__dirname, ...src, file.name));
    if (fileData) {
      if (fileData.isFile()) {
        try {
          await access(path.resolve(__dirname, ...dest, file.name));
          await copyFile(
            path.join(__dirname, ...src, file.name),
            path.join(__dirname, ...dest, file.name)
          );
        } catch (error) {
          await makeDir([path.resolve(__dirname, ...dest)]);
          await copyFile(
            path.join(__dirname, ...src, file.name),
            path.join(__dirname, ...dest, file.name)
          );
        }
      }
      if (fileData.isDirectory()) {
        await makeDir([path.resolve(__dirname, ...dest)]);
        await copyFiles([...src, file.name], [...dest, file.name]);
      }
    }
  }
};

makeDir(destinationDir);

copyFiles(sourceDir, destinationDir);
