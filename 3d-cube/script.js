const cube = document.querySelector('.cube')
const rotateReg = /rotateY\((?<rotation>.*)deg\)/m
const sides = document.querySelectorAll('.cube__side')
const leftArrow = document.querySelector('.cube_wrapper__arrow-left')
const rightArrow = document.querySelector('.cube_wrapper__arrow-right')
const fileInput = document.querySelector('.cube_wrapper__file')
let currentSide;
 
leftArrow.addEventListener('click', _ => rotateCube(90))
rightArrow.addEventListener('click', _ => rotateCube(-90))

Array.prototype.forEach.call(sides, el => {
  el.addEventListener('click', _ => {
    currentSide = el
    fileInput.click()
  })
})



function rotateCube(transformDeg) {
  const reg = rotateReg.exec(cube.style.transform)
  const deg = parseInt(reg.groups.rotation)
  cube.style.transform = cube.style.transform.replace('rotateY(' + deg, 'rotateY(' +  (deg + transformDeg))
}

fileInput.onchange = e => {
  let f = e.target.files
  if (f && f[0]) {
    let reader = new FileReader()
    reader.readAsDataURL(f[0])
    reader.onloadend = _ => {
      fileInput.value = ''
      currentSide.style.backgroundImage = `url(${reader.result})`
      const text = currentSide.querySelector('span')
      if (text) text.style.display = 'none'
    }
  }
}