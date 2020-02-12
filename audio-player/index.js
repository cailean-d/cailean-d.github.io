const options = {
  controls: [
    "play-large",
    "play",
    "progress",
    "current-time",
    "mute",
    "volume",
  ]
};
const tracks = [
  {
    name: "Test1 - Testtesttestestesteststeststeststest",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test2 - Testtesttestestesteststeststeststest",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test3 - Testtesttestestesteststeststeststest",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test4 - Testtesttestestesteststeststeststest",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test - Test",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test - Test",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test - Test",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test - Test",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test - Test",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test - Test",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test - Test",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test - Test",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  },
  {
    name: "Test - Test",
    duration: "4:29",
    src: "http://retro-disko.ru/6/music/016.mp3"
  }
];

function isScrolledIntoView(elem, container) {
  var containerTop = $(container).scrollTop();
  var containerBottom = containerTop + $(container).get(0).clientHeight;

  var elemTop = $(elem).get(0).offsetTop - $(container).get(0).offsetTop;
  var elemBottom = elemTop + $(elem).get(0).clientHeight;

  return ((elemBottom <= containerBottom) && (elemTop >= containerTop));
}

$(function() {
  const supportsAudio = !!document.createElement("audio").canPlayType;
  if (supportsAudio) {
    const player = new Plyr("#audio", options);
    let index = 0;
    const trackCount = tracks.length;
    const playerTitle = $(".player-title");
    const audio = $("#audio").get(0);

    const updateList = function(id) {
      $(".playerListItem--selected").removeClass("playerListItem--selected");
      $(".playerList li:eq(" + id + ")").addClass("playerListItem--selected");
    }

    const updateTitle = function(id) {
      playerTitle.text(tracks[id].name);
    }

    const updatePlayer = function(id) {
      index = id;
      audio.src = tracks[id].src;
    }
    
    const loadTrack = function(id) {
      updateList(id);
      updateTitle(id);
      updatePlayer(id);
    };

    const playTrack = function(id) {
      loadTrack(id);
      audio.play();
    };
    
    const fillNumber = function(num) {
      const numLength = num.toString().length;
      const countLength = trackCount.toString().length;
      let nulls = '';
      for(let i = 0; i < countLength + 1 - numLength; i++) nulls += '0';
      return nulls + num;
    }

    const loadPlaylist = function (list) {
      $.each(list, function(index, track) {
        $(".playerList").append(
          '<li>' + 
            '<div class="playerListItem">' +
              '<span class="playerListItem__number">' + fillNumber(index + 1) + '.</span>' +
              '<span class="playerListItem__title">' + track.name + '</span>' +
              '<span class="playerListItem__length">' + track.duration + '</span>' +
            '</div>' +
          '</li>'
        );
      });
    };

    const scrollList = function(dir) {
      const $selected = $(".playerListItem--selected");
      if (!isScrolledIntoView($selected, ".playerList")) {
        $selected.get(0).scrollIntoView(dir);
      }
    }

    const nextTrack = function() {
      const p = audio.paused;
      loadTrack(++index % trackCount);
      if (!p) audio.play();
      scrollList(false);
    }

    const prevTrack = function() {
      const p = audio.paused;
      loadTrack(index = (--index + trackCount) % trackCount);
      if (!p) audio.play();
      scrollList(true);
    }

    const rewindToLast10Sec = function() {
      player.currentTime = player.duration - 10;
    }

    const focusPlayer = function() {
      $(".plyr").get(0).focus();
    }
      
    $(".playListButtons__prev").on("click", prevTrack);
    $(".playListButtons__next").on("click", nextTrack);
    $('.forwardBtn').click(rewindToLast10Sec);
    $("#audio").on("ended", function() { nextTrack(); audio.play(); });

    player.on("ready", function() {
      $('.plyr__controls > button:first-child').after($('.forwardBtn').show());
      $('.player-container .wrap').css('display', 'flex');
      focusPlayer();
      $('.player-container').on('focus click', focusPlayer);
    });
    
    $(".playerList").on("click", "li", function() {
      var id = +$(this).index();
      if (id !== index) playTrack(id);
    });

    loadPlaylist(tracks);
    loadTrack(index);
  } else {
    var noSupport = $("#audio").text();
    $(".player-container").append('<p class="no-support">' + noSupport + "</p>");
  }
});
