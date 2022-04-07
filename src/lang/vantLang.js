import { Locale } from "vant";
import enUS from "vant/lib/locale/lang/en-US";
import zhCN from "vant/lib/locale/lang/zh-CN";

const langMap = {
  en: {
    lang: enUS,
    key: "en-US",
  },
  zh: {
    lang: zhCN,
    key: "zh-CN",
  },
};

export function vantLang(lan) {
  const { key, lang } = langMap[lan];
  Locale.use(key, lang);
}
