
const currentTheme:string = window.localStorage.getItem('theme') || ''
if (currentTheme && currentTheme !== 'auto') {
  switchTheme(currentTheme)
}

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
  
  const stickyKeyframeEffect:KeyframeEffect = initStickyAnimation(stickyContent, sitckyHeaderHeightDefault, stickyHeaderHeightMin, stickyDuration)
  const stickyAnimation:Animation           = new Animation(stickyKeyframeEffect, document.timeline)

  let startPoint:Array<number> = []

  /** theme change click */
  document.querySelector('#theme-light').addEventListener('click', () => switchTheme(THEME_ENUM.LIGHT))
  document.querySelector('#theme-dark').addEventListener('click', () => switchTheme(THEME_ENUM.DARK))
  document.querySelector('#theme-auto').addEventListener('click', () => switchTheme(THEME_ENUM.AUTO))

  stickyContainer.style.height = toPX(sitckyHeaderHeightDefault)

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

  function initStickyAnimation (dom:Element, from:number, to:number, duration: number): KeyframeEffect {
    const style             = getComputedStyle(document.documentElement)
    const themeBGColor      = style.getPropertyValue("--theme-bg-nav")
    const themeBorderColor  = style.getPropertyValue("--theme-border-primary")
    const fontLargeSize     = style.getPropertyValue("--font-large-size")
    const fontCommonSize    = style.getPropertyValue("--font-common-size")
    
    return new KeyframeEffect(dom,
      [
        {
          height: toPX(from),
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          fontSize: fontLargeSize,
          letterSpacing: '8px'
        },
        {
          height: toPX(to),
          backgroundColor: themeBGColor,
          borderColor: themeBorderColor,
          fontSize: fontCommonSize,
          letterSpacing: '4px'
        }
      ],
      { duration: duration, easing: 'linear', fill: 'forwards' }
    )
  }
})