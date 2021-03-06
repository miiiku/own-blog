;(function () {
  const currentTheme:string = window.localStorage.getItem('theme') || ''
  if (currentTheme && currentTheme !== 'auto') {
    switchTheme(currentTheme)
  }
})();

window.addEventListener('DOMContentLoaded', () => {
  const kanbanContainer:HTMLElement = document.querySelector('.kanban-container')
  const bannerContainer:HTMLElement = document.querySelector('.banner-container')
  const viewW = window.innerWidth
  const viewH = window.innerHeight

  let startPointKanban:Array<number> = [0, 0]
  let startPointBanner:Array<number> = [0, 0]

  if (isTouchDevice()) {
    // requestGyro().then(() => {
      window.addEventListener('deviceorientation', ({ beta, gamma }) => {
        const moveStartX = startPointKanban[0]
        const moveStartY = startPointKanban[1]

        if (beta >  70) beta =  70
        if (beta < -70) beta = -70
        if (gamma >  60) gamma =  60
        if (gamma < -60) gamma = -60

        const rateX = (gamma - moveStartX) / 180 || 0
        const rateY = (beta  - moveStartY) / 180 || 0
        
        document.documentElement.style.setProperty('--kanban-offset-x', rateX + '')
        document.documentElement.style.setProperty('--kanban-offset-y', rateY + '')
      })
    // })
  } else {
    document.body.addEventListener('mouseenter', e => {
      startPointKanban = [e.clientX, e.clientY]
      kanbanContainer.classList.add('moving')
    })
  
    document.body.addEventListener('mousemove', e => {
      const moveStartX = startPointKanban[0]
      const moveStartY = startPointKanban[1]
      const rateX = (e.clientX - moveStartX) / viewW || 0
      const rateY = (e.clientY - moveStartY) / viewH || 0
      document.documentElement.style.setProperty('--kanban-offset-x', rateX + '')
      document.documentElement.style.setProperty('--kanban-offset-y', rateY + '')
    })
  
    document.body.addEventListener('mouseleave', () => {
      document.documentElement.style.setProperty('--kanban-offset-x', '0')
      document.documentElement.style.setProperty('--kanban-offset-y', '0')
      kanbanContainer.classList.remove('moving')
    })
  
    bannerContainer.addEventListener('mouseenter', e => {
      startPointBanner = [e.clientX, e.clientY]
      bannerContainer.classList.add('moving')
    })
  
    bannerContainer.addEventListener('mousemove', e => {
      const moveStartX = startPointBanner[0]
      const moveStartY = startPointBanner[1]
      const rateX = (e.clientX - moveStartX) / viewW || 0
      const rateY = (e.clientY - moveStartY) / viewH || 0
      document.documentElement.style.setProperty('--banner-offset-x', rateX + '')
      document.documentElement.style.setProperty('--banner-offset-y', rateY + '')
    })
  
    bannerContainer.addEventListener('mouseleave', () => {
      document.documentElement.style.setProperty('--banner-offset-x', '0')
      document.documentElement.style.setProperty('--banner-offset-y', '0')
      bannerContainer.classList.remove('moving')
    })
  }
})

