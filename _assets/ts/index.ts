const querySelectorArrs = (selector:string):Array<Element> => Array.from(document.querySelectorAll(selector))

const toPX = (n:number):string => n + 'px'


const bodyContainer:HTMLElement = document.querySelector('.body-container')
const stickyContainer:HTMLElement = document.querySelector('.section-header')
const stickyContent:HTMLElement = document.querySelector('.sticky-content')
const stickyInner:HTMLElement = document.querySelector('.sticky-inner')
const scrollContainer:HTMLElement = document.querySelector('.scroll-view')
const sideBannerContainer:HTMLElement = document.querySelector('.side-banner')

const stickyDuration:number = 1000
const stickyHeaderHeightMin:number = 48
const sitckyHeaderHeightDefault:number = stickyContainer.offsetHeight
const scrollHeight:number = scrollContainer.offsetHeight

const stickyAnimation:Animation = new Animation(initStickyAnimation(stickyContent), document.timeline)
const currentTheme:string  = window.localStorage.getItem('theme') || ''


if (currentTheme && currentTheme !== 'auto') {
  switchTheme(currentTheme)
}

onResize()

window.addEventListener('DOMContentLoaded', () => {


  /** theme change click */
  const themeLightBtn = document.querySelector('#theme-light')
  const themeDarkBtn  = document.querySelector('#theme-dark')
  const themeAuto     = document.querySelector('#theme-auto')
  themeLightBtn.addEventListener('click', () => switchTheme('light'))
  themeDarkBtn.addEventListener('click', () => switchTheme('dark'))
  themeAuto.addEventListener('click', () => switchTheme('auto'))

  stickyContainer.style.height = toPX(sitckyHeaderHeightDefault)
})

sideBannerContainer.addEventListener('mouseover', e => {
  sideBannerContainer.classList.remove('active')
  globalThis.startPoint = [e.offsetX, e.offsetY]
})

sideBannerContainer.addEventListener('mousemove', e => {
  const sideBannerMoveX:number = globalThis.startPoint[0]
  const sideBannerMoveY:number = globalThis.startPoint[1]
  const sideBannerWidth:number = sideBannerContainer.clientWidth
  const sideBannerHeight:number = sideBannerContainer.clientHeight
  const rateX = (e.offsetX - sideBannerMoveX) / sideBannerWidth
  const rateY = (e.offsetY - sideBannerMoveY) / sideBannerHeight
  sideBannerContainer.style.setProperty('--offsetX', rateX + '')
  sideBannerContainer.style.setProperty('--offsetY', rateY + '')
})

sideBannerContainer.addEventListener('mouseout', () => {
  sideBannerContainer.classList.add('active')
  sideBannerContainer.style.setProperty('--offsetX', '0')
  sideBannerContainer.style.setProperty('--offsetY', '0')
})

function onResize() {
  const vh = window.innerHeight
  if (scrollHeight - sitckyHeaderHeightDefault >= vh) {
    document.querySelector('.section-header').classList.add('actice')
    bodyContainer.addEventListener('scroll', onScroll)
  }
}

function onScroll() {
  const scrollTop = this.scrollTop
  const rate = Math.min(1,  scrollTop / sitckyHeaderHeightDefault)
  const time = stickyDuration * rate
  if (rate === 1) {
    stickyInner.classList.add('text-ellipsis')
  } else {
    stickyInner.classList.remove('text-ellipsis')
  }
  stickyAnimation.currentTime = time
}

function initStickyAnimation (dom:Element): KeyframeEffect {
  const style             = getComputedStyle(document.documentElement)
  const themeBorderColor  = style.getPropertyValue("--theme-border-primary")
  const fontLargeSize     = style.getPropertyValue("--font-large-size")
  const fontCommonSize    = style.getPropertyValue("--font-common-size")
  
  return new KeyframeEffect(dom,
    [
      {
        height: toPX(sitckyHeaderHeightDefault),
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        fontSize: fontLargeSize,
        letterSpacing: '8px'
      },
      {
        height: toPX(stickyHeaderHeightMin),
        backgroundColor: '#ffffff',
        borderColor: themeBorderColor,
        fontSize: fontCommonSize,
        letterSpacing: '4px'
      }
    ],
    { duration: stickyDuration, easing: 'linear', fill: 'forwards' }
  )
}

function switchTheme (theme:string) {
  const rootDom:Element = document.documentElement
  if (theme === 'auto') {
    rootDom.classList.remove('theme-dark')
    rootDom.classList.remove('theme-light')
  }
  if (theme === 'dark') {
    rootDom.classList.remove('theme-light')
    rootDom.classList.add('theme-dark')
  }
  if (theme === 'light') {
    rootDom.classList.remove('theme-dark')
    rootDom.classList.add('theme-light')
  }
  window.localStorage.setItem('theme', theme)
}