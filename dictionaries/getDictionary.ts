import 'server-only'

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  bg: () => import('./bg.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en' | 'bg') => {
  return dictionaries[locale]?.() ?? dictionaries.bg()
}
