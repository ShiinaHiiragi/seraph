import en from "../language/en";
import zhCN from "../language/zh-CN";
import ja from "../language/ja";

const defaultLanguage = "ja";
const languageMap = {
  "en": {
    object: en,
    displayName: "English"
  },
  "zh-CN": {
    object: zhCN,
    displayName: "简体中文"
  },
  "ja": {
    object: ja,
    displayName: "日本語"
  }
}

const languagePicker = (language, keys) => {
  keys = keys.split(".");
  return keys.reduce(
    (current, key) => current?.[key],
    languageMap[language].object
  );
}

const languagePickerSpawner = (language) => (keys) =>
  languagePicker(language, keys) ?? languagePicker(defaultLanguage, keys);

export default defaultLanguage;
export {
  defaultLanguage,
  languageMap,
  languagePickerSpawner
}
