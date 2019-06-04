document.addEventListener("DOMContentLoaded", function(e) {
	elem = document.querySelector("body");
	document.getElementById("video_overlay").addEventListener("dblclick", function(e) {	toggleFullScreen(); }, false);
	elem.addEventListener("keyup", function(e) { if (e.keyCode == 32) { toggleplay(); }; }, false);
	setInterval(function() {
		if((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
			document.getElementById("cueOrig").style.bottom = (cueElement.offsetHeight + document.getElementById("buttons").offsetHeight + 120) + 'px';
		} else {
			if (inFS) toggleFullScreen();
			document.getElementById("cueOrig").style.bottom = (cueElement.offsetHeight + document.getElementById("buttons").offsetHeight + 120) + 'px';
		}
	}, 250);

	videoElement = document.querySelector("video");
	videoElement.addEventListener("loadedmetadata", function(e) {
		document.getElementById("player").style.width = this.videoWidth + 'px';
		document.getElementById("player").style.height = this.videoHeight + 'px';
		document.getElementById("time").innerHTML = toHHMMSS(this.currentTime) + ' / ' + toHHMMSS(this.duration);
		this.volume = 1;
	}, false);

	trackElements = document.querySelectorAll("track");
	cueElement = document.getElementById("cue");

	trackElements[0].addEventListener("load", function() {
		cueMaster = this.track;

		for (var j = 0; j < cueMaster.cues.length; ++j) {
			var cue = cueMaster.cues[j];

			cue.onenter = function() {
				// cueMaster = this.text;
				console.log(this.text)
			}
			cue.onexit = function() {

			}
		}

	});
	trackElements[1].addEventListener("load", function() {
		cueOrig = this.track;
/*
		for (var j = 0; j < textTrack.cues.length; ++j) {
			var cue = textTrack.cues[j];
			cue.onenter = function() {
				cueOrig = this.text;
			}
			cue.onexit = function() {

			}
		}
*/
	});

	trackElements[1].track.mode = 'showing';
	trackElements[1].track.mode = 'hidden';

	document.getElementById("understand").addEventListener("click", understand);
	document.getElementById("not_understand").addEventListener("click", not_understand);
	document.getElementById("know").addEventListener("click", knowit);
	document.getElementById("repeat").addEventListener("click", repeatit);


//Управление проигрывателем
	document.getElementById("seek").addEventListener("click", seek);
	videoElement.addEventListener('timeupdate', updateSeek, false);

	document.getElementById("full_scr").addEventListener("click", function(e) { openFullscreen(); }, false);

	videoElement.addEventListener('play', function() {
		document.getElementById("play").setAttribute('src', 'http://cannee.com/img/pause.png');
		document.getElementById("play").setAttribute('title', 'Приостановить');
		controlsActive = false;
		hideControls();
	}, false);
	videoElement.addEventListener('pause', function() {
		document.getElementById("play").setAttribute('src', 'http://cannee.com/img/play.png');
		document.getElementById("play").setAttribute('title', 'Возобновить');
		controlsActive = true;
		controlsElement.style.opacity = 1;
		controlsOpacity = 1;
	}, false);
	videoElement.addEventListener('volumechange', function(e) { 
		if (videoElement.muted) {
			document.getElementById("volume").setAttribute('src', 'http://cannee.com/img/mute.png');
			document.getElementById("volume").setAttribute('title', 'Включить звук');
		} else {
			document.getElementById("volume").setAttribute('src', 'http://cannee.com/img/volume.png');
			document.getElementById("volume").setAttribute('title', 'Отключить звук');
		}
	}, false);
	controlsElement = document.getElementById("controls");
	document.getElementById("player").addEventListener("mouseover", function(e) {
		controlsActive = true;
		controlsElement.style.opacity = 1;
		controlsOpacity = 1;
	});
	document.getElementById("player").addEventListener("mouseout", function(e) {
		if (!videoElement.paused) {
			controlsActive = false;
			hideControls();
		}
	});
	hideControls();


(function() {
	user = getCookie('username');
	if (user) {
		document.getElementById("user").innerHTML = user;
		setCookie('username', user, 525600); //Обновим куки на год
		loadDictionary();
	} else {
		document.getElementById("user").innerHTML = '<form id="loginForm" action="" method="post"><input type="text" placeholder="user@example.com" pattern="[A-Za-z0-9\-\_\.]+@[A-Za-z0-9\-\_]+\.[A-Za-z]{2,}" /><input type="submit" /></form>';
		document.getElementById("loginForm").addEventListener("submit", function(e) {
			e.preventDefault();
			var input = this.querySelector('input[type="text"]');
			if (input.value.match(/^[\d\w]+\@[\d\w]+\.[\w]{2,}$/)) {
				user = input.value;
				document.getElementById("user").innerHTML = user;
				setCookie('username', user, 525600);
				loadDictionary();
			}
			return false;
		});
	}
})();


});

var videoElement;
var trackElements;
var startCue;
var endCue;
var textCue;
var cueElement;
var cueOrig;
var cueMaster;
var inFS = false;
var elem; //Контейнер для полноэкранного режима
var controlsElement;
var controlsActive = false;
var controlsOpacity = 1;
var blocks;
var understanding = true;
var user;
var wordsAjax;
var cueActive;
var cueActiveIndex;
var cueActiveShow;
var cueLast;

var ai = [[],[]];

function aiText(text) {
	blocks = text.replace(/[\r\n]/g, ' ').replace(/([A-Za-z0-9]{1}) [A-Z]{1}[a-z]+( |\.|\,)/g, '$1 $2').split(/\:|\.|\,|\!|\?|\;/).filter(function(el) { return el; }).filter(function(value, index, self) { return self.indexOf(value) === index; });
	blocks = [blocks.join(' ')];
	for (var j = 0; j < blocks.length; j++) {
		var words = blocks[j].toLowerCase().replace(/[^0-9a-z\s+\']/gi, ' ').trim().split(' ').filter(function(el) { return el; }).filter(function(value, index, self) { return self.indexOf(value) === index; }).sort(function(a, b){ return b.length - a.length; });
		for (var i = 0; i < words.length; i++) {
			var index = ai[0].indexOf(words[i]);
			var s = false;
			if (index == -1 && words[i].length > 2 && words[i].substring(words[i].length - 1) == 's') {
				index = ai[0].indexOf(words[i].substring(0, (words[i].length - 1)));
				s = true;
			}
			if (index > -1) {
				var val = ai[1][index];
				var re = new RegExp('(\\s|^)(' + ai[0][index] + (s? 's?' : '') + ')(?=[^a-z0-9]|$)', 'gi');
				if (val > 1) {
					text = text.replace(re, '<strong>$1$2</strong>');
				} else {
					text = text.replace(re, '<i>$1$2</i>');
				}
			}
		}

	}

	return text.replace(/[\r\n]/g, '<br />');
}

function videoPause(enter = false) {
	if (enter) {
		understanding = true;
		for (var j = 0; j < blocks.length; j++) {
			var words = blocks[j].toLowerCase().replace(/[^0-9a-z\s+\']/gi, ' ').trim().split(' ').filter(function(el) { return el; }).filter(function(value, index, self) { return self.indexOf(value) === index; }).sort(function(a, b){ return b.length - a.length; });
			for (var i = 0; i < words.length; i++) {
				var index = ai[0].indexOf(words[i]);
				var s = false;
				if (index == -1 && words[i].length > 2 && words[i].substring(words[i].length - 1) == 's') {
					index = ai[0].indexOf(words[i].substring(0, (words[i].length - 1)));
					s = true;
				}
				if (index == -1) {
					understanding = false;
					break;
				}
			}

		}
		if (!understanding) return true;
	} else {
		if (understanding) return true;
	}
	return false;
}
function process(act = true) {
	wordsAjax = [[],[]];
	for (var j = 0; j < blocks.length; j++) {
		var words = blocks[j].toLowerCase().replace(/[^0-9a-z\s+\']/gi, ' ').trim().split(' ').filter(function(el) { return el; }).filter(function(value, index, self) { return self.indexOf(value) === index; });

		for (var i = 0; i < words.length; i++) {
			var index = ai[0].indexOf(words[i]);

			var indexAjax = wordsAjax[0].length;
			wordsAjax[0][indexAjax] = words[i];

			if (act) {
				if (index == -1) {
					index = ai[0].length;
					ai[0][index] = words[i];
					ai[1][index] = 1;
				} else {
					ai[1][index] += 1;
				}

				wordsAjax[1][indexAjax] = ai[1][index];

			} else {
				if (index > -1) {
					ai[1][index] -= 1;

					wordsAjax[1][indexAjax] = ai[1][index];

					if (ai[1][index] == 0) {
						ai[1].splice(index, 1);
						ai[0].splice(index, 1);
					}
				}
			}
		}

	}
	deltaDictionary();
}
function understand() {
	cueElement.innerHTML = '';
	document.getElementById("buttons").style.display = 'none';
	document.getElementById("cueOrig").innerHTML = '';
	videoElement.play();
}
function knowit(plus = true) {
	process();
	understand();
}
function not_understand() {
	process(false);
	var showOrigs = false;
console.log(cueActiveShow);
	if (!cueActiveShow) {
		if (document.getElementById("know").style.display == 'none' && document.getElementById("repeat").style.display == 'none') {
			showOrigs = true;
		} else {
			document.getElementById("know").style.display = 'none';
			cueElement.innerHTML = aiText(cueLast.text);
			cueElement.style.display = null;
			document.getElementById("repeat").style.display = 'none';
			document.getElementById("understand").style.display = null;
		}
	} else {
		showOrigs = true;
	}

	if (showOrigs) {
		document.getElementById("cueOrig").style.bottom = (cueElement.offsetHeight + document.getElementById("buttons").offsetHeight + 120) + 'px';

		var cueOrigShow = '';
		for (var j = 0; j < cueOrig.cues.length; j++) {
			var cue = cueOrig.cues[j];
			if (cue.startTime >= endCue) break;
			if (cue.startTime >= startCue) {
				cueOrigShow += cueOrigShow ? "\n" : '';
				cueOrigShow += cue.text;
			}
		}

		document.getElementById("cueOrig").innerHTML = cueOrigShow.replace(/[\r\n]/g, '<br />');
		document.getElementById("know").style.display = 'none';
		document.getElementById("not_understand").style.display = 'none';
	}
}

function repeatit() {
	cueActiveIndex--;
	cueActive = cueMaster.cues[cueActiveIndex];
	videoElement.currentTime = cueLast.startTime;
	endCue = cueActive.endTime;
	cueActiveShow = true;
	videoElement.play();
}

//Управление проигрывателем
function seek(e) {
	var percent = e.offsetX / this.offsetWidth;
	videoElement.currentTime = percent * videoElement.duration;
	document.getElementById("seekPlayed").style.width = Math.floor(percent * 100) + '%';
	cueActive = null;
	cueLast = null;
	cueActiveIndex = null;
	cueActiveShow = false;
	cueElement.innerHTML = '';
	document.getElementById("buttons").style.display = 'none';
}
function updateSeek() {
	var percent = 100 * videoElement.currentTime / videoElement.duration;
	document.getElementById("seekPlayed").style.width = percent + '%';
	document.getElementById("time").innerHTML = toHHMMSS(videoElement.currentTime) + ' / ' + toHHMMSS(videoElement.duration);


	if (cueMaster) {
		if (!cueActive && !cueActiveIndex) {
			for (var j = 0; j < cueMaster.cues.length; j++) {
				var cue = cueMaster.cues[j];
				if (cue.startTime > videoElement.currentTime) {
					cueActive = cue;
					cueActiveIndex = j;
					break;
				}
			}
// console.log(cueActive);
		} else if (!cueActive && cueActiveIndex) {
			cueActiveIndex++;
			cueActive = cueMaster.cues[cueActiveIndex];
// console.log(cueActive);
		}
		if (cueActive) {
			if (videoElement.currentTime >= cueActive.endTime && cueActiveShow) {
// console.log(videoElement.currentTime);
// console.log(cueActive.endTime);
// console.log(cueActive.text + 'gone');
//videoElement.pause();
				cueActiveShow = false;
				cueElement.innerHTML = '';
				cueLast = cueActive;
				cueActive = null;
				if(videoPause()) {
					videoElement.pause();
					document.getElementById("know").style.display = null;
					document.getElementById("repeat").style.display = null;
					document.getElementById("not_understand").style.display = null;
					document.getElementById("understand").style.display = null;
					document.getElementById("buttons").style.display = null;
				} else {
					cueElement.innerHTML = '';
					document.getElementById("buttons").style.display = 'none';
				}
			}
// console.log(cueActive);
// console.log(cueActiveShow);
// console.log((parseFloat(cueLast ? cueLast.endTime : 0.00) + 0.3 <= videoElement.currentTime));
			if (cueActive && videoElement.currentTime >= cueActive.startTime && !cueActiveShow && (parseFloat(cueLast ? cueLast.endTime : 0) + 0.3 <= videoElement.currentTime)) {
				cueActiveShow = true;
				cueElement.innerHTML = aiText(cueActive.text);
				startCue = cueActive.startTime;
				endCue = cueActive.endTime;
				textCue = cueActive.text;
				if(videoPause(true)) {
					cueElement.style.display = null;
					videoElement.pause();
					document.getElementById("know").style.display = null;
					document.getElementById("repeat").style.display = 'none';
					document.getElementById("not_understand").style.display = null;
					document.getElementById("understand").style.display = null;
					document.getElementById("buttons").style.display = null;
				} else {
					cueElement.style.display = 'none';
				}
// console.log(videoElement.currentTime);
// console.log(cueActive.startTime);
// console.log(cueActive.text);
//videoElement.pause();
			}
		}

	}


}
function toggleFullScreen() {
	if (!inFS) {
		inFS = true;
		document.getElementById("full_scr").setAttribute('src', 'http://cannee.com/img/exitFS.png');
		document.getElementById("full_scr").setAttribute('title', 'Выйти из полноэкранного режима');
		openFullscreen();
	} else {
		inFS = false;
		document.getElementById("full_scr").setAttribute('src', 'http://cannee.com/img/FS.png');
		document.getElementById("full_scr").setAttribute('title', 'На весь экран');
		exitFullScreen();
	}
}
function openFullscreen() {
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.mozRequestFullScreen) { /* Firefox */
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { /* IE/Edge */
		elem.msRequestFullscreen();
	}
}
function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
 }
function toggleplay() {
	if (videoElement.paused) videoElement.play(); else videoElement.pause();
}
function toHHMMSS(secs) {
	hours = Math.floor(secs / 3600);
	secs %= 3600;
	minutes = n(Math.floor(secs / 60));
	seconds = n(Math.round(secs % 60));
	return hours < 1 ? minutes + ':' + seconds : hours + ':' + minutes + ':' + seconds;
}
function n(n){
	return n > 9 ? "" + n: "0" + n;
}
function toggleSound() {
	if (videoElement.muted) videoElement.muted = false; else videoElement.muted = true;
}
function hideControls() {
	if (!controlsActive) {
		controlsOpacity -= 0.1;
		controlsElement.style.opacity = controlsOpacity;
		if (parseFloat(controlsElement.style.opacity) > 0) setTimeout(hideControls, 100);
	}
}
(function() {
    var mouseTimer = null, cursorVisible = true;

    function disappearCursor() {
    	if (!videoElement.paused) {
	        mouseTimer = null;
	        document.body.style.cursor = "none";
	        cursorVisible = false;
	        controlsActive = false;
	        hideControls();
	    }
    }

    document.onmousemove = function() {
        if (mouseTimer) {
            window.clearTimeout(mouseTimer);
        }
        if (!cursorVisible) {
            document.body.style.cursor = "default";
            cursorVisible = true;
            controlsActive = true;
            controlsElement.style.opacity = 1;
            controlsOpacity = 1;
        }
        mouseTimer = window.setTimeout(disappearCursor, 5000);
    };
})();
//Сохраняем словарь
function setCookie(name, value, expires = 60) { //minutes
	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000 * 60);
		expires = d;
	}
	if (expires && expires.toUTCString) {
  		expires = expires.toUTCString();
	}
	value = encodeURIComponent(value);
	var updatedCookie = name + "=" + value + (expires ? '; expires=' + expires : '') + '; path=/';
	document.cookie = updatedCookie;
}
function deleteCookie(name) {
	setCookie(name, "", -1)
}
function getCookie(name) {
	var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : null;
}
function loadDictionary() {
	var url = 'ajax.php?user=' + user + '&task=load';
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = xhttp.responseText;
			eval(response);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}
function deltaDictionary() {
//console.log(wordsAjax);
	var url = 'ajax.php?user=' + user + '&task=add&words=' + wordsAjax[0].join(',') + '&rates=' + wordsAjax[1].join(',');
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = xhttp.responseText;
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}
