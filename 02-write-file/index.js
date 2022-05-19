const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;

const writeStream = fs.createWriteStream(
  path.resolve(__dirname, "output.txt"),
  { encoding: "utf-8" }
);

stdout.write("Enter your text here =>");

stdin.on("data", (data) => {
  if (data.toString().trim().toLowerCase() === "exit") {
    stdout.write("Data was written successfully...");
    writeStream.destroy();
    stdin.destroy();
    fs.rm(path.resolve(__dirname, "output.txt"), (err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
  } else {
    stdout.write("Enter your text here =>");
    writeStream.write(data);
  }
});
