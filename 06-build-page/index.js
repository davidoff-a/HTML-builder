const { mkdir } = require("node:fs/promises");
const path = require("path");
const makeDir = async (folderName) => {
  try {
    await mkdir(
      path.resolve(__dirname, "project-dist"),
      { recursive: true },
      (err) => {
        if (err) {
          throw new Error(`Folder can't be created because => ${err.message}`);
        }
      }
    );
  } catch (err) {
    if (err) {
      throw new Error(`Folder can't be created because => ${err.message}`);
    }
  }
};
