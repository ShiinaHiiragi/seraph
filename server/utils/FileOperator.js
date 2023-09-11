const fs = require('fs');

const FileOperator = {
  envReader: (envPath, key) => {
    content = fs.readFileSync(envPath, encoding="utf-8");
    lines = content.split("\n")
    lines.forEach((item) => {
      if (new RegExp(`^${key}=`).test(item)) {
      }
    })
  }
}

module.exports = FileOperator;
