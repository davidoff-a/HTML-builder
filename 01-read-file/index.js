const fs = require("fs");
const path = require("path");

try {
  const { stdout } = process;
  const readStream = fs.createReadStream(path.join(__dirname, "text.txt"), {
    encoding: "utf-8",
  });
  readStream.on("data", (data) => stdout.write(data));
} catch (error) {
  throw new Error(`Error of ${error} was taken`);
}
