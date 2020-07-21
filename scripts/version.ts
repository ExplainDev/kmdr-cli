import fs from "fs";
import os from "os";
import path from "path";

function main() {
  const pkgFile = path.join(__dirname, "../", "package.json");

  try {
    const fileContents = fs.readFileSync(pkgFile, { encoding: "utf-8" });
    const parsedContents = JSON.parse(fileContents);
    fs.writeFileSync(path.join(__dirname, "..", "VERSION"), parsedContents.version + os.EOL, {
      encoding: "utf8",
    });
  } catch (err) {
    console.error(err);
  }
}

main();
