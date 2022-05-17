const fs = require("fs");
const path = require("path");

try {
  const readStream = fs.createReadStream(path.join(__dirname, "text.txt"), {
    encoding: "utf-8",
  });
  readStream.on("data", (data) => {
    console.log(data);
  });
} catch (error) {
  throw new Error(`Error of ${error} was taken`);
}
