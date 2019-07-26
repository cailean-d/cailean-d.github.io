var myElement = document.querySelector('header')
var headroom = new Headroom(myElement, {
  offset: 305,
  tolerance: 5,
  classes: {
    initial: 'animated',
    pinned: 'slideDown',
    unpinned: 'slideUp'
  }
})

headroom.init()

document.querySelector('#totop').onclick = function() {
  var x = document.querySelector(this.getAttribute('href'))
  var y = document.querySelector('header')

  x.scrollIntoView()
  requestAnimationFrame(() => {
    // document.documentElement.scrollTop -= headroom.elem.clientHeight
    window.scrollBy(0, -headroom.elem.clientHeight)
  })

  // headroom.elem.classList.remove('animated')
  // headroom.elem.classList.remove('slideDown')
  // headroom.elem.classList.add('slideUp')
  // headroom.elem.style.transform = 'translate(-100%)';
  // requestAnimationFrame(() => {
  //   headroom.elem.classList.add('animated')
  // })
}
