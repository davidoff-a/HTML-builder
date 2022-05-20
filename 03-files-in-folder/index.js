const { readdir, stat } = require("fs/promises");
const path = require("path");
// const { stdout } = process;

try {
  readdir(path.resolve(__dirname, "secret-folder"), {
    withFileTypes: true,
  }).then((data) => {
    console.log(data);
    for (let fileName of data) {
      try {
        stat(path.resolve(__dirname, "secret-folder", fileName.name)).then(
          (fileData) => {
            if (fileName && !fileName.isDirectory()) {
              const nameParts = fileName.name.split(".");
              console.table(
                `${nameParts[0]} - ${nameParts[1]} - ${fileData.size / 1024} Kb`
              );
            }
          }
        );
      } catch (error) {
        console.error("there was an error:", error.message);
      }
    }
  });
} catch (error) {
  console.error("there was an error:", error.message);
}
