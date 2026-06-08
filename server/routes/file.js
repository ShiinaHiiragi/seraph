let express = require('express');
let path = require('path');
let fs = require('fs');
let fse = require('fs-extra')
let child = require('child_process');
let AdmZip = require('adm-zip');
let api = require('../api');
let router = express.Router();

router.post('/new', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  // directory file is a special kind of file
  const { type, folderName, filename } = req.body;
  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(folderPath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (fs.existsSync(filePath)) {
    // -> EF_IC: new filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  try {
    fs.mkdirSync(filePath);
    fs.chmodSync(filePath, 0o777);
  } catch (_) {
    // -> EF_FME: fs.writeFileSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...api.fileOperator.readFileInfo(folderPath, filename)
  });
  return;
});

router.post('/upload', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename, base } = req.body;
  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (folderName.length === 0) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

  if (!fs.existsSync(folderPath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (fs.existsSync(filePath)) {
    // -> EF_IC: new filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  try {
    const fileBuffer = Buffer.from(base, 'base64');
    fs.writeFileSync(filePath, fileBuffer);
    fs.chmodSync(filePath, 0o777);
  } catch (_) {
    // -> EF_FME: fs.writeFileSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return new file info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...api.fileOperator.readFileInfo(folderPath, filename)
  });
  return;
});

router.post('/paste', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { permanent, directory, path } = api.configOperator.config.clipboard;
  if (permanent === null || directory === null || path === null) {
    api.configOperator.clearConfigClipboard();

    // -> abnormal request: clipboard is broken, expect to try again
    next(api.errorStreamControl);
    return;
  }

  const [type, folderName, filename] = path;
  const { type: newType, folderName: newFolderName } = req.body;
  const { filePath } = api.fileOperator.pathCombinator(type, folderName, filename);
  const {
    folderPath: newFolderPath,
    filePath: newFilePath
  } = api.fileOperator.pathCombinator(newType, newFolderName, filename);

  if (!fs.existsSync(filePath)) {
    api.configOperator.clearConfigClipboard();

    // -> EF_RU: origin file don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (!fs.existsSync(newFolderPath)) {
    // -> EF_RU: target folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (fs.existsSync(newFilePath)) {
    // -> EF_IC: new filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  if (!directory && newFolderName.length === 0) {
    // -> abnormal request: try to move file to public/ or private/
    next(api.errorStreamControl);
    return;
  }

  try {
    if (permanent) {
      fs.cpSync(filePath, newFilePath, { recursive: true });
    } else {
      fse.moveSync(filePath, newFilePath);
      api.configOperator.clearConfigClipboard();
    }
  } catch (_) {
    // -> EF_FME: fs.cpSync or fs.rmSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return new file info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...api.fileOperator.readFileInfo(newFolderPath, filename)
  });
  return;
});

router.post('/rename', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename, newFilename } = req.body;
  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);
  const newFilePath = path.join(folderPath, newFilename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (fs.existsSync(newFilePath)) {
    // -> EF_IC: new filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  try {
    fs.renameSync(filePath, newFilePath);
    fs.chmodSync(newFilePath, 0o777);
  } catch (_) {
    // -> EF_FME: fs.renameSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return type info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    type: api.fileOperator.readFileInfo(folderPath, newFilename).type
  });
  return;
});

router.post('/copy', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename } = req.body;
  const { filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  api.configOperator.setConfigClipboard([type, folderName, filename], true);

  // -> ES: return clipboard info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    directory: api.configOperator.config.clipboard.directory
  });
  return;
});

router.post('/cut', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename } = req.body;
  const { filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  api.configOperator.setConfigClipboard([type, folderName, filename], false);

  // -> ES: return clipboard info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    directory: api.configOperator.config.clipboard.directory
  });
  return;
});

router.post('/delete', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename } = req.body;
  const { filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  try {
    fs.rmSync(filePath, { recursive: true, force: true });
  } catch (_) {
    // -> EF_FME: fs.unlinkSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.post('/zip', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename, newName } = req.body;
  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  const newFilename = filename + ".zip"
  const { filePath: newFilePath } = api.fileOperator.pathCombinator(type, folderName, newFilename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (fs.existsSync(newFilePath)) {
    // -> EF_IC: filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  const zip = new AdmZip();
  try {
    zip.addLocalFolder(filePath);
    zip.writeZip(newFilePath);
    fs.chmodSync(newFilePath, 0o777);
  } catch (_) {
    // -> EF_FME: fs.unlinkSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: info of new file
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...api.fileOperator.readFileInfo(folderPath, newFilename)
  });
  return;
});

router.post('/unzip', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename, newName } = req.body;
  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  const zip = new AdmZip(filePath);
  const zipEntries = zip
    .getEntries()
    .map((item) => item.entryName)
    .filter((item) => /^[^/]*\/?$/.test(item))

  const pureFilename = filename.split(".").slice(0, -1).join(".");
  const extractName = zipEntries.length === 1 ? "." : pureFilename;
  const newDirName = zipEntries.length === 1 ? zipEntries[0].replace("/", "") : pureFilename;
  const newDirPath = path.join(folderPath, newDirName);

  if (fs.existsSync(newDirPath)) {
    // -> EF_IC: filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  const chmodSyncR = (dirPath, mode) => {
    fs.chmodSync(dirPath, mode);
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
  
      if (stats.isDirectory()) {
        chmodSyncR(filePath, mode);
      } else {
        fs.chmodSync(filePath, mode);
      }
    }
  }

  try {
    zip.extractAllTo(path.join(folderPath, extractName));
    chmodSyncR(newDirPath, 0o777);
  } catch (_) {
    // -> EF_FME: fs.unlinkSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: info of new folder/file
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...api.fileOperator.readFileInfo(folderPath, newDirName)
  });
  return;
});

router.post('/epub', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename, newName } = req.body;
  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  const newDirPath = path.join(folderPath, newName);
  if (fs.existsSync(newDirPath)) {
    // -> EF_IC: filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  const missing = api.checkerOperator.check(api.checkerParam.epubConverter);
  if (Object.keys(missing).length > 0) {
    req.status.addExecStatus(api.Status.execErrCode.EnvironmentMissing);
    res.send({
      ...req.status.generateReport(),
      missing: missing
    });
    return;
  }

  // use async function to avoid blocking
  api.fileOperator.operateInTemp((tempdir) => new Promise((resolve) => {
    const epubSetting = api.configOperator.config.setting.epub;
    child.execFile(api.configOperator.config.setting.extension.python[process.platform], [
      api.extentPath.epubConverterFilePath,
      '-c',
      JSON.stringify({
        "path.src": filePath,
        "path.dst": tempdir,
        "page.split": epubSetting.page.split,
        "page.front": epubSetting.page.front,
        "nav.link": epubSetting.nav.link,
        "nav.prev": epubSetting.nav.prev,
        "nav.next": epubSetting.nav.next,
        "fade.kana": epubSetting.fade.kana,
        "fade.opaque": `0.${epubSetting.fade.opaque}`,
        "fade.size": `0.${epubSetting.fade.size}em`,
        "fade.top": `${epubSetting.fade.top}px`,
        "image.show": epubSetting.image.show,
        "image.width": epubSetting.image.width,
        "image.ialt": epubSetting.image.altInline,
        "image.balt": epubSetting.image.altBlock,
        "image.spec": epubSetting.image.spec,
        "page.clear": epubSetting.text.clearLine,
        "ruby.show": epubSetting.text.showRuby,
        "break.text": epubSetting.text.breakLine,
        "out.html": epubSetting.out.html,
        "out.keep": epubSetting.out.keep,
        "out.vert": epubSetting.out.vert
      })
    ], { env: { ...process.env, PYTHONUTF8: '1' } }, (err, stdout, stderr) => {
      if (err) {
        req.status.addExecStatus(api.Status.execErrCode.ExtensionError);
        res.send({
          ...req.status.generateReport(),
          code: err.code,
          stdout: stdout,
          stderr: stderr
        });
        resolve();
        return;
      } else {
        try {
          const tempDirPath = path.join(tempdir, fs.readdirSync(tempdir)[0]);
          fse.moveSync(tempDirPath, newDirPath);
        } catch (err) {
          // -> EF_ISE: unknown error
          next(err);
          resolve();
          return;
        }

        // -> ES: info of new folder
        req.status.addExecStatus();
        res.send({
          ...req.status.generateReport(),
          ...api.fileOperator.readFileInfo(folderPath, newName)
        });
        resolve();
        return;
      }
    });
  }));
});

module.exports = router;
