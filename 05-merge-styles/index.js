const { readdir, stat } = require("node:fs/promises");
const path = require("path");
const fs = require("fs");

// const writeStream = fs.createWriteStream(
//   path.resolve(__dirname, "project-dist", "bundle.css"),
//   { encoding: "utf-8" }
// );
// try {
//   const data = readdir(path.resolve(__dirname, "styles"), {
//     withFileTypes: true,
//   });
//   console.log(
//     readdir(path.resolve(__dirname, "styles"), {
//       withFileTypes: true,
//     })
//   );
//   for (let fileName of data) {
//     if (!fileName.isDirectory() && fileName.name.slice(-3) === "css") {
//       const readStream = fs.createReadStream(
//         path.join(__dirname, "styles", fileName.name),
//         {
//           encoding: "utf-8",
//         }
//       );
//       readStream.on("data", (styles) => {
//         writeStream.write(styles);
//       });
//       readStream.on("end", () => {
//         readStream.close();
//       });
//     }
//   }
// } catch (error) {
//   console.error("there was an error:", error.message);
// }

const mergeStyles = async (dest) => {
  const writeStream = fs.createWriteStream(dest, { encoding: "utf-8" });

  try {
    const data = await readdir(path.resolve(__dirname, "styles"), {
      withFileTypes: true,
    });
    for (let fileName of data) {
      const extension =
        fileName.name.split(".")[fileName.name.split(".").length - 1];
      if (!fileName.isDirectory() && extension === "css") {
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
  } catch (error) {
    console.error("there was an error:", error.message);
  }
};

const handleStyles = async () => {
  await mergeStyles(path.resolve(__dirname, "project-dist", "bundle.css"));
};
handleStyles();
