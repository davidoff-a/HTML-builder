const { readdir, stat } = require("fs/promises");
const path = require("path");

const getFiles = (folderName) => {
  try {
    readdir(path.resolve(__dirname, ...folderName), {
      withFileTypes: true,
    }).then((data) => {
      for (let fileName of data) {
        stat(path.resolve(__dirname, ...folderName, fileName.name)).then(
          (fileData) => {
            if (fileName && fileName.isFile()) {
              const nameParts = fileName.name.split(".");
              console.table(
                `${nameParts[0]} - ${nameParts[1]} - ${fileData.size / 1024} Kb`
              );
            }
            if (fileName && fileName.isDirectory()) {
              const dirList = [...folderName, fileName.name];
              getFiles([path.resolve(__dirname, ...dirList)]);
            }
          }
        );
      }
    });
  } catch (err) {
    if (err) {
      throw new Error(err.message);
    }
  }
};
getFiles([path.resolve(__dirname, "secret-folder")]);
// try {
//   readdir(path.resolve(__dirname, "secret-folder"), {
//     withFileTypes: true,
//   }).then((data) => {
//     for (let fileName of data) {
//       try {
//         stat(path.resolve(__dirname, "secret-folder", fileName.name)).then(
//           (fileData) => {
//             if (fileName && !fileName.isDirectory()) {
//               const nameParts = fileName.name.split(".");
//               console.table(
//                 `${nameParts[0]} - ${nameParts[1]} - ${fileData.size / 1024} Kb`
//               );
//             }
//           }
//         );
//       } catch (error) {
//         console.error("there was an error:", error.message);
//       }
//     }
//   });
// } catch (error) {
//   console.error("there was an error:", error.message);

// }
