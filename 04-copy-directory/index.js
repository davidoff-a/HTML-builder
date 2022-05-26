const {
  readdir,
  mkdir,
  copyFile,
  stat,
  access,
  rm,
} = require("node:fs/promises");
const path = require("path");
const { unlink } = require("fs");

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
        } catch (error) {
          await makeDir([path.resolve(__dirname, ...dest)]);
        } finally {
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

const rmFiles = async (dest) => {
  try {
    await access(path.resolve(__dirname, ...dest));
    const destFiles = await readdir(path.resolve(__dirname, ...dest), {
      withFileTypes: true,
    });
    for (let file of destFiles) {
      const fileData = await stat(path.resolve(__dirname, ...dest, file.name));

      if (fileData.isFile()) {
        await rm(path.resolve(__dirname, ...dest, file.name), {
          recursive: true,
          force: true,
        });
      }
      if (fileData.isDirectory()) {
        try {
          await rm(path.resolve(__dirname, ...dest, file.name), {
            recursive: true,
            force: true,
          });
        } catch (e) {
          await rmFiles(path.resolve(__dirname, ...dest, file.name));
        }
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
const copy = async () => {
  await makeDir(destinationDir);
  await rmFiles(destinationDir);
  await copyFiles(sourceDir, destinationDir);
};

copy();
