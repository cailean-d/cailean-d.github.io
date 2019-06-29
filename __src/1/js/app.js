const prev = document.querySelector('.slider__navigation-left')
const next = document.querySelector('.slider__navigation-right')
const slides = document.querySelectorAll('.slider__slide')
const dots = document.querySelectorAll('.slider__dot')

let slideIndex = 1

showSlides(slideIndex)

prev.addEventListener('click', _ => plusSlides(-1))
next.addEventListener('click', _ => plusSlides(1))

Array.prototype.forEach.call(dots, (dot, i) =>
  dot.addEventListener('click', _ => currentSlide(i + 1))
)

function plusSlides(n) {
  showSlides((slideIndex += n))
}

function currentSlide(n) {
  showSlides((slideIndex = n))
}

function showSlides(n) {
  normalizeIndex(n)
  changeSlide()
  changeActiveDot()
}

function changeSlide() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none'
  }
  slides[slideIndex - 1].style.display = 'block'
}

function normalizeIndex(n) {
  if (n > slides.length) slideIndex = 1
  else if (n < 1) slideIndex = slides.length
  else slideIndex = n
}

function changeActiveDot() {
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active')
  }
  dots[slideIndex - 1].classList.add('active')
}
