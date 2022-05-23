const { readdir, mkdir, copyFile, stat, access } = require("node:fs/promises");
const path = require("path");
const fs = require("fs");
const { match } = require("assert");
const { stdout } = process;

let sourceDir = ["assets"];
let destinationDir = ["project-dist"];

const makeDir = async (folderName) => {
  try {
    await mkdir(path.resolve(__dirname, ...folderName), { recursive: true });
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
const mergeStyles = async () => {
  const writeStream = fs.createWriteStream(
    path.resolve(__dirname, ...destinationDir, "style.css"),
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
};
const buildHTML = async () => {
  const readTemplateStream = fs.createReadStream(
    path.resolve(__dirname, "template.html")
  );
  const writeIndexHTMLStream = fs.createWriteStream(
    path.resolve(__dirname, ...destinationDir, "index.html")
  );
  readTemplateStream.on("data", (chunk) => {
    const replaceField = new RegExp("/({{)(\\w*)(}})/gi");

    stdout.write("----start chunk ----");
    stdout.write(chunk);
    stdout.write("----finish chunk ----");
  });
};

makeDir(destinationDir);
copyFiles([...sourceDir], [...destinationDir, ...sourceDir]);
mergeStyles();
buildHTML();
