var options = {
  controls: [
    "play-large",
    "play",
    "progress",
    "current-time",
    "mute",
    "volume",
  ]
};
var tracks = [
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
  },
];

function isScrolledIntoView(elem, container) {
  var containerTop = $(container).scrollTop();
  var containerBottom = containerTop + $(container).get(0).clientHeight;

  var elemTop = $(elem).get(0).offsetTop - $(container).get(0).offsetTop;
  var elemBottom = elemTop + $(elem).get(0).clientHeight;

  return ((elemBottom <= containerBottom) && (elemTop >= containerTop));
}

$(function() {
  var supportsAudio = !!document.createElement("audio").canPlayType;
  if (supportsAudio) {
    var player = new Plyr("#audio", options);
    var index = 0;
    var trackCount = tracks.length;
    var playerTitle = $(".player-title");
    var audio = $("#audio").get(0);

    var updateList = function(id) {
      $(".playerListItem--selected").removeClass("playerListItem--selected");
      $(".playerList li:eq(" + id + ")").addClass("playerListItem--selected");
    }

    var updateTitle = function(id) {
      playerTitle.text(tracks[id].name);
    }

    var updatePlayer = function(id) {
      index = id;
      audio.src = tracks[id].src;
    }
    
    var loadTrack = function(id) {
      updateList(id);
      updateTitle(id);
      updatePlayer(id);
    };

    var playTrack = function(id) {
      loadTrack(id);
      audio.play();
    };
    
    var fillNumber = function(num) {
      var numLength = num.toString().length;
      var countLength = trackCount.toString().length - 1 || 1;
      var nulls = '';
      for(var i = 0; i < countLength - numLength + 1; i++) nulls += '0';
      return nulls + num;
    }

    var loadPlaylist = function (list) {
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

    var scrollList = function(dir) {
      var $selected = $(".playerListItem--selected");
      if (!isScrolledIntoView($selected, ".playerList")) {
        $selected.get(0).scrollIntoView(dir);
      }
    }

    var nextTrack = function() {
      var p = audio.paused;
      loadTrack(++index % trackCount);
      if (!p) audio.play();
      scrollList(false);
    }

    var prevTrack = function() {
      var p = audio.paused;
      loadTrack(index = (--index + trackCount) % trackCount);
      if (!p) audio.play();
      scrollList(true);
    }

    var rewindToLast10Sec = function() {
      player.currentTime = player.duration - 10;
    }

    var focusPlayer = function() {
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
