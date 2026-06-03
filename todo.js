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

// 指定 bash powershell.exe
// 指定 timeout, 各种 styles, control lists

// 初始化 shell 同意
// xs 增加 sendCtrl("C") 等
// dir 返回 sub items 数量
// 如上，密码加密

const [fontSize, setFontSize] = React.useState(14);
const [theme, setTheme] = React.useState(LIGHT_THEME);

// 字号变化时更新
React.useEffect(() => {
  if (!xtermRef.current) return;
  xtermRef.current.options.fontSize = fontSize;
  fitAddonRef.current?.fit(); // 字号影响字符宽高，需要重新 fit
}, [fontSize]);

// 主题变化时更新
React.useEffect(() => {
  if (!xtermRef.current) return;
  xtermRef.current.options.theme = theme;
  // theme 不影响布局，不需要 fit
}, [theme]);

// xterm.js 的 options 支持逐个设置也支持批量：

// 单个
xterm.options.cursorBlink = true;

// 批量（等效）
Object.assign(xterm.options, { cursorBlink: true, fontSize: 16 });

// 字号、字体这类会改变字符尺寸的选项需要跟一个 fitAddon.fit()，主题、光标样式这类纯视觉的不需要
