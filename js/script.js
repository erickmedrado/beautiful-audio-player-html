var activeSong;
var player1, onplayhead, playerId, timeline, playhead, timelineWidth;
jQuery(window).on("load", function() {
    ballSeek();
    initProgressBar();
});

function playPause(id) {
    activeSong = document.getElementById(id);
    if (activeSong.paused) {
        document.getElementById("songPlayPause").innerHTML = '<i class="las la-pause"></i>';
        isPlaying = true;
        activeSong.play();
    } else {
        document.getElementById("songPlayPause").innerHTML = '<i class="las la-play"></i>';
        activeSong.pause();
    }
}

function stopSong() {
    activeSong.currentTime = 0;
    activeSong.pause();
    document.getElementById('pointerButton').style.marginLeft = 0;
    document.getElementById("songPlayPause").innerHTML = '<i class="las la-play"></i>';
}

function updateTime() {
    var currentSeconds = (Math.floor(activeSong.currentTime % 60) < 10 ? '0' : '') + Math.floor(activeSong.currentTime % 60);
    var currentMinutes = Math.floor(activeSong.currentTime / 60);
    document.getElementById('songTime').innerHTML = currentMinutes + ":" + currentSeconds + ' / ' + Math.floor(activeSong.duration / 60) + ":" + (Math.floor(activeSong.duration % 60) < 10 ? '0' : '') + Math.floor(activeSong.duration % 60);

    var percentageOfSong = (activeSong.currentTime / activeSong.duration);
    var percentageOfSlider = document.getElementById('songSlider').offsetWidth * percentageOfSong;

    document.getElementById('trackProgress').style.width = Math.round(percentageOfSlider) + "px";
}

function initProgressBar() {
    jQuery(".play-pause").empty().text("PAUSE");
    player1 = document.getElementById("song");
    player1.addEventListener("timeupdate", timeCal);
    var playBtn = jQuery(".play-pause");
    playBtn.click(function() {
        if (player1.paused === false) {
            //asas
            player1.pause();
            isPlaying = false;
            jQuery(".play-pause").empty().text("PLAY");
        } else {
            player1.play();
            isPlaying = true;
            jQuery(".play-pause").empty().text("PAUSE");
        }
    });

}

function timeCal() {
    var width = jQuery("#trackProgress").width();
    var length = player1.duration;
    var current_time = player1.currentTime;

    var totalLength = calculateTotalValue(length);
    jQuery(".end-time").html(totalLength);

    var currentTime = calculateCurrentValue(current_time);
    jQuery(".start-time").html(currentTime);

    var progressbar = document.getElementById("pointerButton");
    progressbar.style.marginLeft = width * (player1.currentTime / player1.duration) + "px";

}

function calculateTotalValue(length) {
    var minutes = Math.floor(length / 60);
    var seconds_int = length - minutes * 60;
    if (seconds_int < 10) {
        seconds_int = "0" + seconds_int;
    }
    var seconds_str = seconds_int.toString();
    var seconds = seconds_str.substr(0, 2);
    var time = minutes + ':' + seconds;
    return time;
}

function calculateCurrentValue(currentTime) {
    var current_hour = parseInt(currentTime / 3600) % 24,
        current_minute = parseInt(currentTime / 60) % 60,
        current_seconds_long = currentTime % 60,
        current_seconds = current_seconds_long.toFixed(),
        current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);
    return current_time;
}

function ballSeek() {
    onplayhead = null;
    playerId = null;
    timeline = document.getElementById("songSlider");
    playhead = document.getElementById("pointerButton");
    timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

    timeline.addEventListener("click", seek);
    playhead.addEventListener('mousedown', drag);
    window.addEventListener('mouseup', mouseUp);

}

function seek(event) {
    var player = document.getElementById("song");
    player.currentTime = player.duration * clickPercent(event, timeline, timelineWidth);
}

function clickPercent(e, timeline, timelineWidth) {
    return (event.clientX - getPosition(timeline)) / timelineWidth;
}

function getPosition(el) {
    return el.getBoundingClientRect().left;
}

function drag(e) {
    player1.removeEventListener("timeupdate", timeCal);
    onplayhead = jQuery(this).attr("id");
    playerId = jQuery(this).parents("section").find("audio").attr("id");
    console.log(playerId);
    console.log(onplayhead);
    console.log(playerId);
    var player = document.getElementById(playerId);
    window.addEventListener('mousemove', dragFunc);
    player.removeEventListener('timeupdate', timeUpdate);
}


function dragFunc(e) {
    var player = document.getElementById(onplayhead);
    var newMargLeft = e.clientX - getPosition(timeline);

    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        playhead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        playhead.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
        playhead.style.marginLeft = timelineWidth + "px";
    }
}

function mouseUp(e) {
    if (onplayhead != null) {
        var player = document.getElementById(playerId);
        window.removeEventListener('mousemove', dragFunc);
        player.currentTime = player.duration * clickPercent(e, timeline, timelineWidth);
        player1.addEventListener("timeupdate", timeCal);
        player.addEventListener('timeupdate', timeUpdate);
    }
    onplayhead = null;
}

function timeUpdate() {
    console.log(onplayhead);
    var song = document.getElementById(onplayhead);
    var player = document.getElementById(playerId);
    var playPercent = timelineWidth * (player.currentTime / player.duration);
    song.style.marginLeft = playPercent + "px";
    if (player.currentTime == player.duration) {
        player.pause();
    }

}