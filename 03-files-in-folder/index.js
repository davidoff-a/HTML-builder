const { readdir } = require("fs/promises");
const path = require("path");
const { stdout } = process;

try {
  await readdir(path.resolve(__dirname, "secret-folder"));
} catch (error) {
  console.error("there was an error:", error.message);
}
const readDir = await fs
  .readdir(path.resolve(__dirname, "secret-folder"), {
    withFileTypes: true,
  })
  .then((files) => {
    for (let file of files) {
      const nameParts = file.name.split(".");
      fs.stat(
        path.resolve(__dirname, "secret-folder", file.name),
        (err, stats) => {
          if (err) {
            throw new Error(err.message);
          }
          console.log(stats);
          console.log(stats.isDirectory);
        }
      );
      stdout.write(`${nameParts[0]} - ${nameParts[1]}\n`);
    }
  });
