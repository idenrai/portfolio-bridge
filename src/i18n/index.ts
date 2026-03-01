export type { Translations, Lang } from "./types";
export { LANG_NAMES, LANG_LOCALES } from "./types";
export { ko } from "./ko";
export { en } from "./en";
export { ja } from "./ja";

import { ko } from "./ko";
import { en } from "./en";
import { ja } from "./ja";
import type { Lang, Translations } from "./types";

export const TRANSLATIONS: Record<Lang, Translations> = { ko, en, ja };
