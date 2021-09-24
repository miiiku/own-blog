/** theme enum */
const enum THEME_ENUM {
  AUTO  = 'auto',
  DARK  = 'dark',
  LIGHT = 'light'
}

/** number to px */
const toPX = (n:number):string => n + 'px'

/** querys to array */
const querySelectorArrs = (selector:string):Array<HTMLElement> => Array.from(document.querySelectorAll(selector))

/** switch theme */
const switchTheme = (theme:string) => {
  const rootDom:Element = document.documentElement

  if (theme === THEME_ENUM.AUTO) {
    rootDom.classList.remove('theme-dark')
    rootDom.classList.remove('theme-light')
  }

  if (theme === THEME_ENUM.DARK) {
    rootDom.classList.remove('theme-light')
    rootDom.classList.add('theme-dark')
  }

  if (theme === THEME_ENUM.LIGHT) {
    rootDom.classList.remove('theme-dark')
    rootDom.classList.add('theme-light')
  }

  window.localStorage.setItem('theme', theme)
}