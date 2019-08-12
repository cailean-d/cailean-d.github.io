;(function() {

  const find = selector => document.querySelector(selector)
  const findAll = selector => document.querySelectorAll(selector)
  const listen = (target, event, handler) => target.addEventListener(event, handler)

  const modalImage = find('.modal-image')
  const selectedAreaRect = find('.img-selected-area')
  const links = findAll('a')
  const xCoord = find('.x-coord span')
  const yCoord = find('.y-coord span')
  const originalCoords = find('.original-coords span')
  const selectedCoords = find('.selected-coords span')
  const cornerCoordsLeft = find('.corner-coords-left')
  const cornerCoordsRight = find('.corner-coords-right')
  const modal = find('.modal')
  const closeButton = find('.modal-close')
  const modifier = 'z'
  let isModifierPressed = false
  let isMouseButtonDown = false
  let x1, y1, x2, y2, linkData

  /**
   * @typedef {Object} LinkData
   * @property {string} imgSource - Link to an image
   * @property {string} linkType - Type of the link
   * @property {number} x1 - x1 coordinate
   * @property {number} y1 - y2 coordinate
   * @property {number} x2 - x2 coordinate
   * @property {number} y2 - y2 coordinate
   */

  /**
   * @typedef {Object} OriginalCoords
   * @property {number} x - original x coordinate
   * @property {number} y - original y coordinate
   */

  /**
   * Returns necessary attributes from link element 
   *
   * @param {HTMLAnchorElement} elem
   * @returns {LinkData}
   */
  const getLinkData = elem => {
    return {
      imgSource: elem.href,
      linkType: elem.getAttribute('type'),
      x1: +elem.getAttribute('x'),
      y1: +elem.getAttribute('y'),
      x2: +elem.getAttribute('x1'),
      y2: +elem.getAttribute('y1')
    }
  }

  /**
   * Converts current image coords to origin
   *
   * @param {number} x - current x coordinate
   * @param {number} y - current y coordinate
   * @returns {OriginalCoords}
   */
  const convertCurrentCoordsToOriginal = (x, y) => {
    const { height, width } = modalImage
    return {
      x: Math.round((linkData.x2 - linkData.x1) * (x / width) + linkData.x1),
      y: Math.round((linkData.y2 - linkData.y1) * (y / height) + linkData.y1)
    }
  }

  const getSelectedRectCoords = () => {
    return {
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
      x: x1 < x2 ? x1 : x2,
      y: y1 < y2 ? y1 : y2
    }
  }

  const showSelectedAreaCoords = () => {
    const { x, y, width, height } = getSelectedRectCoords()
    const { x: x1, y: y1 } = convertCurrentCoordsToOriginal(x, y)
    const { x: x2, y: y2 } = convertCurrentCoordsToOriginal(
      x + width,
      y + height
    )
    selectedCoords.innerHTML = `${x1}, ${y1}, ${x2}, ${y2}`
  }

  const clearSelectedAreaCoords = () => {
    selectedCoords.innerHTML = ``
  }

  const clearSelectedAreaCoordsOnMouseUp = e => {
    if (e.type === 'mouseup' && e.which === 1) clearSelectedAreaCoords()
  }

  const showOriginalAreaCoords = (x1, y1, x2, y2) => {
    originalCoords.innerHTML = `${x1}, ${y1}, ${x2}, ${y2}`
  }

  const showSelectedAreaRect = () => {
    const rect = getSelectedRectCoords()
    selectedAreaRect.style.top = `${rect.y}px`
    selectedAreaRect.style.left = `${rect.x}px`
    selectedAreaRect.style.height = `${rect.height}px`
    selectedAreaRect.style.width = `${rect.width}px`
    selectedAreaRect.style.display = 'block'
  }

  const hideSelectedAreaRect = () => {
    selectedAreaRect.style.display = 'none'
  }

  const showCoordsOnMouseMove = e => {
    const x = e.offsetX > 0 ? e.offsetX : 0
    const y = e.offsetY > 0 ? e.offsetY : 0
    const { x: originalX, y: originalY } = convertCurrentCoordsToOriginal(x, y)
    xCoord.innerHTML = `${originalX}`
    yCoord.innerHTML = `${originalY}`
  }

  const changeModifierStatusOnKeyDown = e => {
    if (e.type === 'keydown' && e.key === modifier) isModifierPressed = true
    if (e.type === 'keyup' && e.key === modifier) isModifierPressed = false
  }

  const changeMouseStatusOnMouseDown = e => {
    if (e.type == 'mousedown' && e.which === 1) {
      isMouseButtonDown = true
    } else if (e.type === 'mouseup' && e.which === 1) {
      isMouseButtonDown = false
    }
  }

  const hideSelectedAreaOnMouseUp = e => {
    if (e.type === 'mouseup' && e.which === 1) hideSelectedAreaRect()
  }

  const startCaptureRectOnMouseDown = e => {
    if (e.type === 'mousedown' && e.which === 1 && isModifierPressed) {
      x1 = x2 = e.offsetX
      y1 = y2 = e.offsetY
    }
  }

  const captureRectOnMouseMoveWithModifier = e => {
    if (isMouseButtonDown && isModifierPressed) {
      x2 = e.offsetX
      y2 = e.offsetY
      showSelectedAreaCoords()
      showSelectedAreaRect()
    }
  }

  const showModalWindow = () => {
    modal.style.display = 'block'
  }

  const hideModalWindow = () => {
    modal.style.display = 'none'
    hideSelectedAreaRect()
    isModifierPressed = false
    isMouseButtonDown = false
  }

  const showCornerCoords = () => {
    cornerCoordsLeft.innerHTML = `(${linkData.x1}, ${linkData.y1})`
    cornerCoordsRight.innerHTML = `(${linkData.x2}, ${linkData.y2})`
  }

  const preloadModalData = () => {
    modalImage.src = linkData.imgSource
    showOriginalAreaCoords(linkData.x1, linkData.y1, linkData.x2, linkData.y2)
    showCornerCoords()
  }

  const showModalOnLinkClick = e => {
    linkData = getLinkData(e.target)
    if (linkData.linkType !== 'screenShot') return
    e.preventDefault()
    preloadModalData()
    showModalWindow()
  }

  listen(modalImage, 'mousedown', changeMouseStatusOnMouseDown)
  listen(modalImage, 'mousedown', startCaptureRectOnMouseDown)
  listen(modalImage, 'mouseup', changeMouseStatusOnMouseDown)
  listen(modalImage, 'mouseup', hideSelectedAreaOnMouseUp)
  listen(modalImage, 'mouseup', clearSelectedAreaCoordsOnMouseUp)
  listen(modalImage, 'mousemove', showCoordsOnMouseMove)
  listen(modalImage, 'mousemove', captureRectOnMouseMoveWithModifier)
  listen(window, 'keydown', changeModifierStatusOnKeyDown)
  listen(window, 'keyup', changeModifierStatusOnKeyDown)
  listen(closeButton, 'click', hideModalWindow)
  links.forEach(elem => listen(elem, 'click', showModalOnLinkClick))

})()
