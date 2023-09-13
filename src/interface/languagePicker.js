import en from "../language/en";
import zhHans from "../language/zh-Hans";
import ja from "../language/ja";
import { defaultSetting } from "./constants";

const languageMap = {
  "en": {
    object: en,
    displayName: "English"
  },
  "zh-Hans": {
    object: zhHans,
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
  languagePicker(language, keys)
    ?? languagePicker(defaultSetting.meta.language, keys);

export default languageMap;
export {
  languageMap,
  languagePickerSpawner
}
