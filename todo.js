// 导入 monospace 字体
// control lists
// 初始化 shell 同意
// xs 增加 sendCtrl("C") 等
// dir 返回 sub items 数量
// reset password
// 密码加密
const crypto = require('crypto');

// 哈希密码，返回 "salt:hash" 格式的字符串用于存储
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

// 验证密码，stored 为 hashPassword 返回的字符串
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'));
}
