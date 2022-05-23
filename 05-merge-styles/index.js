const { readdir, stat } = require("fs/promises");
const path = require("path");
const fs = require("fs");

const writeStream = fs.createWriteStream(
  path.resolve(__dirname, "project-dist", "bundle.css"),
  { encoding: "utf-8" }
);
try {
  readdir(path.resolve(__dirname, "styles"), {
    withFileTypes: true,
  }).then((data) => {
    for (let fileName of data) {
      if (!fileName.isDirectory() && fileName.name.slice(-3) === "css") {
        const readStream = fs.createReadStream(
          path.join(__dirname, "styles", fileName.name),
          {
            encoding: "utf-8",
          }
        );
        readStream.on("data", (styles) => {
          writeStream.write(styles);
        });
        readStream.on("end", () => {
          readStream.close();
        });
      }
    }
  });
} catch (error) {
  console.error("there was an error:", error.message);
}
