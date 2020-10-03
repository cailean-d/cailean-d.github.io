function AudioPlayer(selector, playlist) {

  var dblclicked = 0;
  var tracks = playlist || [];
  var supportsAudio = !!document.createElement("audio").canPlayType;
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

  var $playerContainer = 
  $('<div class="player-container">'+
    '<div class="wrap">' +
      '<div class="player-title"></div> ' +
      '<div class="controlsWrap">' +
        '<div><audio data-audio preload>Your browser does not support HTML5 Audio!</audio></div>' +
        '<div class="playListButtons">' +
          '<a class="playListButtons__prev"><i class="glyphicon glyphicon-backward"></i></a>' +
          '<a class="playListButtons__edit" data-toggle="popoverE"><i class="glyphicon glyphicon-edit"></i></a>' +
          '<a class="playListButtons__next"><i class="glyphicon glyphicon-forward"></i></a>' +
        '</div>' +
      '</div>' +
      '<ul class="playerList"></ul>' +
      '<button class="forwardBtn" style="display: none;">' +
        '<span class="glyphicon glyphicon-fast-forward" aria-hidden="true"></span>' +
      '</button>' +
    '</div>' +
  '</div>');

  function isScrolledIntoView(elem, container) {
    var containerTop = $(container).scrollTop();
    var containerBottom = containerTop + $(container).get(0).clientHeight;

    var elemTop = $(elem).get(0).offsetTop - $(container).get(0).offsetTop;
    var elemBottom = elemTop + $(elem).get(0).clientHeight;

    return ((elemBottom <= containerBottom) && (elemTop >= containerTop));
  }

  var setDblClicked = function() {
    dblclicked = 2;
  }

  var preventDlbClicked = function(callback) {
    var self = this;
    var args = [].slice.call(arguments, 1);
    setTimeout(function() {
      if (dblclicked) return dblclicked--;
      callback.apply(self, args);
    }, 300);
  }

  if (supportsAudio) {
    $(selector).html($playerContainer);
    var audio = $playerContainer.find('[data-audio]').get(0);
    var player = new Plyr(audio, options);
    var index = 0;
    var trackCount = tracks.length;
    var playerTitle = $playerContainer.find(".player-title");

    var updateList = function(id) {
      $playerContainer.find(".playerListItem--selected").removeClass("playerListItem--selected");
      $playerContainer.find(".playerList li:eq(" + id + ")").addClass("playerListItem--selected");
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
        $playerContainer.find(".playerList").append(
          '<li>' + 
            '<div class="playerListItem">' +
              '<span class="playerListItem__number">' + fillNumber(index + 1) + '.</span>' +
              '<span class="playerListItem__title">' + track.name + '</span>' +
              '<div class="playerListItem__titleWrap">' +
                '<span class="playerListItem__titleWrap__author"></span>' + 
                '<span> - </span>' + 
                '<input type="text" class="form-control playerListItem__titleWrap__t">' + 
              '</div>' +
              '<span class="playerListItem__length">' + track.duration + '</span>' +
              '<input type="text" class="form-control playerListItem__length-editable">' + 
            '</div>' +
          '</li>'
        );
      });
    };

    var scrollList = function(dir) {
      var $selected = $playerContainer.find(".playerListItem--selected");
      var $playlist = $playerContainer.find(".playerList");
      if (!isScrolledIntoView($selected, $playlist)) {
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
    
    var resizeList = function() {
      var list = $playerContainer.find(".playerList").get(0);
      var h0 = parseInt(getComputedStyle(list).maxHeight);
      var h = window.innerHeight - list.getBoundingClientRect().y - 60;
      if (h > h0) list.style.maxHeight = h + 'px';
    }

    var clearTitleEditable = function($item) {
      // change visible items
      $item.find(".playerListItem__titleWrap").hide();
      $item.find(".playerListItem__title").show();

      // clear inputs
      $item.find(".playerListItem__titleWrap__author").text('');
      $item.find(".playerListItem__titleWrap__t").val('');
    }

    var clearLengthEditable = function($item) {
      // change visible items
      $item.find(".playerListItem__length-editable").hide();
      $item.find(".playerListItem__length").show();

      // clear inputs
      $item.find(".playerListItem__length-editable").val('');
    }

    var sendChanges = function() {
      var data = JSON.stringify(tracks);
      alert(data);

      // changes is saved, hide the button
      $playerContainer.find(".playListButtons__edit").removeClass('playListButtons__edit-show');
    }


    $playerContainer.find(".playListButtons__prev").on("click", prevTrack);
    $playerContainer.find(".playListButtons__next").on("click", nextTrack);
    $playerContainer.find(".playListButtons__edit").on("click", sendChanges);
    $playerContainer.find('.forwardBtn').click(rewindToLast10Sec);
    $(audio).on("ended", function() { nextTrack(); audio.play(); });

    player.on("ready", function() {
      $forwardBtn = $playerContainer.find('.forwardBtn').show();
      $playerContainer.find('.plyr__controls > button:first-child').after($forwardBtn);
      $playerContainer.find('.wrap').css('display', 'flex');
      resizeList();

      // activate popover for edit button
      $('[data-toggle="popoverE"]').popover({ 
        title: "Warning!",
        content: "List is edited. Press the button to save changes.",
        trigger: "hover",
        placement: "top",
      });
    });
    
    $playerContainer.find(".playerList").on("click", "li", function(e) {
      preventDlbClicked.call(this, function(target) {
        var isTitleInput = $(target).hasClass("playerListItem__titleWrap__t");
        var isLengthInput = $(target).hasClass("playerListItem__length-editable");
        if (isTitleInput || isLengthInput) return;
        var id = +$(this).index();
        if (id !== index) playTrack(id);
      }, e.target);
    });

    $playerContainer.find(".playerList").on("dblclick", ".playerListItem__title", function() {
      setDblClicked();
      var $item = $(this).closest(".playerListItem");
      $item.find(".playerListItem__titleWrap").css("display", "flex");
      $item.find(".playerListItem__title").hide();
      $item.find(".playerListItem__titleWrap__t").focus();

      // set author
      var author = $item.find(".playerListItem__title").text().split('-')[0].trim();
      $item.find(".playerListItem__titleWrap__author").text(author);
    });

    $playerContainer.find(".playerList").on("keypress", ".playerListItem__titleWrap__t", function(e) {
      // if pressed enter
      if (e.keyCode === 13) {
        var $item = $(this).closest(".playerListItem");
        var item_index = +$item.parent().index();

        // clear and exit if input is empty
        if (!this.value) return clearTitleEditable($item);

        // get data 
        var author = $item.find('.playerListItem__titleWrap__author').text();
        var title = $(this).val();
        
        // change item
        var newName = author + ' - ' + title;
        tracks[item_index].name = newName;
        $item.find(".playerListItem__title").text(newName);

        // update title if current playing item
        if (index === item_index) { 
          updateTitle(index);
        }

        // items if edited, show send button
        $playerContainer.find(".playListButtons__edit").addClass('playListButtons__edit-show');

        clearTitleEditable($item);
      }
    });

    $playerContainer.find(".playerList").on("dblclick", ".playerListItem__length", function() {
      setDblClicked();
      var $item = $(this).closest(".playerListItem");
      $item.find(".playerListItem__length").hide();
      $item.find(".playerListItem__length-editable").show().focus();

      // fill input with prev duration
      var len = $item.find(".playerListItem__length").text();
      $item.find(".playerListItem__length-editable").val(len);
    });

    $playerContainer.find(".playerList").on("keypress", ".playerListItem__length-editable", function(e) {
      // if pressed enter
      if (e.keyCode === 13) {
        var $item = $(this).closest(".playerListItem");
        var item_index = +$item.parent().index();
        
        // clear and exit if input is empty
        if (!this.value) return clearLengthEditable($item);

        // get data 
        var len = $(this).val();
        
        // change item
        tracks[item_index].duration = len;
        $item.find(".playerListItem__length").text(len);

        // items if edited, show send button
        $playerContainer.find(".playListButtons__edit").addClass('playListButtons__edit-show');

        clearLengthEditable($item);
      }

    })

    loadPlaylist(tracks);
    loadTrack(index);
  } else {
    var noSupport = $(audio).text();
    $playerContainer.find(".player-container").append('<p class="no-support">' + noSupport + "</p>");
  }
}