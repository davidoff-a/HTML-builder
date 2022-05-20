const { readdir, mkdir, copyFile } = require("node:fs/promises");
const path = require("path");
const makeDir = async (folderName) => {};
try {
  mkdir(path.resolve(__dirname, "files-copy"), { recursive: true }, (err) => {
    if (err) {
      throw new Error(`Folder can't be created because => ${err.message}`);
    }
  })
    .then(() => {
      console.log("Folder created");
    })
    .then(() => {
      readdir(path.resolve(__dirname, "files"), {
        withFileTypes: true,
      }).then((data) => {
        for (let fileName of data) {
          try {
            if (!fileName.isDirectory()) {
              copyFile(
                path.resolve(__dirname, "files", fileName.name),
                path.resolve(__dirname, "files-copy", fileName.name)
              );
            } else {
              mkdir(
                path.resolve(__dirname, "files-copy", fileName.name),
                { recursive: true },
                (err) => {
                  if (err) {
                    throw new Error(
                      `Folder can't be created because => ${err.message}`
                    );
                  }
                }
              ).then(() => {
                console.log("Folder created");
              });
            }
          } catch {
            console.log("The file could not be copied");
          }
        }
        console.log("The files copied successfully!");
      });
    });
} catch (error) {
  console.error("there was an error:", error.message);
}
