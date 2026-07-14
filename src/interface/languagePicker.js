import en from "../language/en";
import { defaultSetting } from "./constants";

const languageMap = {
  "en": {
    object: en,
    displayName: "English"
  },
  "zh-Hans": {
    object: null,
    displayName: "简体中文"
  },
  "ja": {
    object: null,
    displayName: "日本語"
  }
}

const loadingLanguages = {};
const languageLoaders = {
  "zh-Hans": () => import("../language/zh-Hans"),
  "ja": () => import("../language/ja")
};

const loadLanguage = (language, toast) => {
  const entry = languageMap[language];
  if (entry.object) {
    return Promise.resolve(entry.object);
  }

  loadingLanguages[language] ??= languageLoaders[language]()
    .then(({ default: object }) => {
      entry.object = object;
      return object;
    })
    .catch(() => {
      delete loadingLanguages[language];
      const picker = languagePickerSpawner(window.loadedLanguage);
      (toast ?? console).error(picker("modal.toast.warning.languagePanic").format(language));
      return languageMap[defaultSetting.meta.language].object;
    });

  return loadingLanguages[language];
};

const languagePicker = (language, keys) => {
  keys = keys.split(".");
  return keys.reduce(
    (current, key) => current?.[key],
    languageMap[language]?.object
  );
}

const languagePickerSpawner = (language) => (keys) => 
  languagePicker(language, keys)
    ?? languagePicker(defaultSetting.meta.language, keys);

export default languageMap;
export {
  languageMap,
  loadLanguage,
  languagePickerSpawner
}
