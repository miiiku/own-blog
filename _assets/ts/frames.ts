window.addEventListener('DOMContentLoaded', function () {
  const headerContainer:HTMLElement = document.querySelector('.header-container')
  const headerBack:HTMLElement = document.querySelector('.header-back')
  const headerTitle:HTMLElement = document.querySelector('.header-title')
  const items:HTMLElement[] = querySelectorArrs('.part-item')
  const titles:HTMLElement[] = querySelectorArrs('.part-item .part-item__title')
  
  const headerH:number = headerContainer.clientHeight
  
  const observeOpt = {
    rootMargin: `${toPX(-headerH)} 0px 0px 0px`,
    threshold: [0, 1],
  }
  
  let firstVisibleIndex = 0
  
  const titleObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function ({ target, isIntersecting, boundingClientRect }) {
      const elIndex = Number((target as HTMLElement).dataset.index)
      if (elIndex > firstVisibleIndex) return
      
      if (isIntersecting) {
        firstVisibleIndex = elIndex
      } else if (boundingClientRect.y < headerH) {
        firstVisibleIndex = elIndex + 1
      }
    })
    headerTitle.style.transform = `translate3d(0, ${(firstVisibleIndex - 1) * -100}%, 0)`
  }, observeOpt)

  const itemObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function ({ target, isIntersecting }) {
      const el: HTMLElement = target as HTMLElement
      if (isIntersecting) {
        el.classList.add('visible')
        el.classList.remove('hidden')
      } else {
        el.classList.add('hidden')
        el.classList.remove('visible')
        el.style['contain-intrinsic-size'] = `0px ${el.dataset.height}px`
      }
    })
  })

  items.forEach(itemElement => {
    itemElement.dataset.height = String(itemElement.offsetHeight)
    itemObserver.observe(itemElement)
  })

  titles.forEach(titleElement => titleObserver.observe(titleElement))

  headerBack.addEventListener('click', e => {
    e.preventDefault()
    if (history.length >= 2) {
      history.back()
    } else {
      window.location.href = window.location.origin
    }
  })
})