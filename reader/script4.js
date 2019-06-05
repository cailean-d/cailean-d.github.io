document.addEventListener("DOMContentLoaded", () => {

  const audio = document.querySelector('audio')

  const words = { 
    "words": [
      ["1", 0.780103, 1.663842],
      ["6", 4.921762, 6.3232],
    ]
  }
  
  
  audio.ontimeupdate = e => {
    const t = e.target.currentTime
  
    console.log(t)
  
    for (let i = 0; i < words['words'].length; i++) {
      const v = words['words'][i];
      if (t > v[1] && t < v[2]) {
        $('[t]').attr('style', '')
        $(`[t="${v[0]}"]`).css('background-color', '#000')
        break
      }
    }
  
  
  }
  
  function toggleAudio() {
    audio.paused ? audio.play() : audio.pause()
  }
  
  document.body.addEventListener('keydown', e => { if(e.keyCode == 32){ e.preventDefault() } })
  document.body.addEventListener('keyup', e => {
    if(e.keyCode == 32){
      toggleAudio()
    }
  })
  

  $('body').on('click', '[t]', function() {
    audio.currentTime = findWord($(this).attr('t'))[1]
    audio.play()
  })
  
  function findWord(x) {
    for (let i = 0; i < words['words'].length; i++) {
      const v = words['words'][i];
      if (x == v[0]) {
        return v
      }
    }
  }
})

