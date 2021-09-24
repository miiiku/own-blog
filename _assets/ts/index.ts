/** 定义一个顶部导航栏获取样式接口 */
interface NavTransition {
  height: string;       /** 导航栏高度 */
  bgColor: string;      /** 背景色 */
  borderColor: string;  /** 底部边框颜色 */
  fontSize: string;     /** 字体大小 */
  letterSpacing: string;/** 字间距 */
}

;(function () {
  /** 获取当前主题 */
  const currentTheme:string = window.localStorage.getItem('theme') || ''

  /** 如果存在手动设置的主题就切换到相关主题 */
  if (currentTheme && currentTheme !== 'auto') {
    switchTheme(currentTheme)
  }
})()

window.addEventListener('DOMContentLoaded', () => {
  const bodyContainer:HTMLElement       = document.querySelector('.body-container')
  const stickyContainer:HTMLElement     = document.querySelector('.section-header')
  const stickyContent:HTMLElement       = document.querySelector('.sticky-content')
  const stickyInner:HTMLElement         = document.querySelector('.sticky-inner')
  const scrollContainer:HTMLElement     = document.querySelector('.scroll-view')
  const sideBannerContainer:HTMLElement = document.querySelector('.side-banner')
  
  const stickyDuration:number             = 1000
  const stickyHeaderHeightMin:number      = 48
  const sitckyHeaderHeightDefault:number  = stickyContainer.offsetHeight
  const scrollHeight:number               = scrollContainer.offsetHeight
  
  let stickyAnimation:Animation = initStickyAnimation()
  let startPoint:Array<number> = []

  /** theme change click */
  document.querySelector('#theme-light').addEventListener('click', () => handleSwitchTheme(THEME_ENUM.LIGHT))
  document.querySelector('#theme-dark').addEventListener('click', () => handleSwitchTheme(THEME_ENUM.DARK))
  document.querySelector('#theme-auto').addEventListener('click', () => handleSwitchTheme(THEME_ENUM.AUTO))

  stickyContainer.style.height = toPX(sitckyHeaderHeightDefault)

  /** listener theme auto change */
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', () => {
    handleSwitchTheme()
  })

  /** add move event */
  sideBannerContainer.addEventListener('mouseover', e => {
    sideBannerContainer.classList.remove('active')
    startPoint = [e.offsetX, e.offsetY]
  })

  sideBannerContainer.addEventListener('mousemove', e => {
    const sideBannerMoveX:number = startPoint[0]
    const sideBannerMoveY:number = startPoint[1]
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

  onResize()

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

  function handleSwitchTheme(theme?: string) {
    if (theme) {
      switchTheme(theme)
    }
    if (stickyAnimation) {
      stickyAnimation.effect = initNavKeyframeEffect(stickyContent, stickyDuration)
    }
  }

  function getNavTransitionStart (): Keyframe {
    const style = getComputedStyle(document.documentElement)
    const fontLargeSize = style.getPropertyValue("--font-large-size")

    return {
      height: toPX(sitckyHeaderHeightDefault),
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      fontSize: fontLargeSize,
      letterSpacing: '8px'
    }
  }

  function getNavTransitionEnd (): Keyframe {
    const style             = getComputedStyle(document.documentElement)
    const themeBGColor      = style.getPropertyValue("--theme-bg-nav")
    const themeBorderColor  = style.getPropertyValue("--theme-border-primary")
    const fontCommonSize    = style.getPropertyValue("--font-common-size")

    return {
      height: toPX(stickyHeaderHeightMin),
      backgroundColor: themeBGColor,
      borderColor: themeBorderColor,
      fontSize: fontCommonSize,
      letterSpacing: '4px'
    }
  }

  function initNavKeyframeEffect (dom: HTMLElement, duration: number): KeyframeEffect {
    return new KeyframeEffect(dom, 
      [
        getNavTransitionStart(),
        getNavTransitionEnd()
      ],
      { duration: duration, easing: 'linear', fill: 'forwards' }
    )
  }

  function initStickyAnimation (): Animation {
    const stickyKeyframeEffect:KeyframeEffect = initNavKeyframeEffect(stickyContent, stickyDuration)
    return new Animation(stickyKeyframeEffect, document.timeline)
  }
})