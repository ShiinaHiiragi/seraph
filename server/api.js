const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

exports.dataPath = {
  dataDirPath: path.join(__dirname, "./data"),
  publicDirPath: path.join(__dirname, "./data/public"),
  privateDirPath: path.join(__dirname, "./data/private"),
  settingFilePath: path.join(__dirname, "./data/setting.json")
};

const generateBaseURL = (protocol, hostname, port) => `${protocol}//${hostname}:${port}`

exports.dotenv = process.env
exports.generateBaseURL = generateBaseURL
exports.reactBaseURL = generateBaseURL(
  process.env.PROTOCOL,
  process.env.HOSTNAME,
  process.env.REPORT
)
