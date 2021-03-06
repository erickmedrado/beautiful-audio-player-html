var activeSong;
var onplayhead, songSlider, timelineWidth,
    trackProgress = document.querySelector('#trackProgress'),
    pointerButton = document.querySelector('#pointerButton'),
    songTime      = document.querySelector('#songTime'),
    songSlider    = document.querySelector('#songSlider')

jQuery(document).ready(function($) {
    activeSong = $("#song")[0];
    updateTime();
});


function playPause() {
    ballSeek();
    if (activeSong.paused) {
        document.querySelector("#songPlayPause").innerHTML = '<i class="las la-pause"></i>';
        activeSong.play();
    } else {
        document.querySelector("#songPlayPause").innerHTML = '<i class="las la-play"></i>';
        activeSong.pause();
    }
}

function stopSong() {
    activeSong.pause();
    activeSong.currentTime = 0;
    pointerButton.style.marginLeft = 0;
    document.querySelector("#songPlayPause").innerHTML = '<i class="las la-play"></i>';
}

function songMute() {
    if (activeSong.muted == false) {
        activeSong.muted = true;
        document.querySelector("#songMute").innerHTML = '<i class="las la-volume-mute"></i>';
    } else {
        activeSong.muted = false;        
        document.querySelector("#songMute").innerHTML = '<i class="las la-volume-up"></i>';
    }
}

function volumeBar(vol) {
    activeSong.volume = vol;
    activeSong.muted = false;        
    document.querySelector("#songMute").innerHTML = '<i class="las la-volume-up"></i>';
}

function updateTime() {
    var percentageOfSong = (activeSong.currentTime / activeSong.duration);
    var percentageOfSlider = songSlider.offsetWidth * percentageOfSong;
    var currentSeconds = (Math.floor(activeSong.currentTime % 60) < 10 ? '0' : '') + Math.floor(activeSong.currentTime % 60);
    var currentMinutes = Math.floor(activeSong.currentTime / 60);

    songTime.innerHTML = currentMinutes + ":" + currentSeconds + ' / ' + Math.floor(activeSong.duration / 60) + ":" + (Math.floor(activeSong.duration % 60) < 10 ? '0' : '') + Math.floor(activeSong.duration % 60);
    trackProgress.style.width = pointerButton.style.marginLeft = Math.round(percentageOfSlider) + "px";
    
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
    timelineWidth = songSlider.offsetWidth - pointerButton.offsetWidth;

    songSlider.addEventListener("click", seek);
    pointerButton.addEventListener('mousedown', drag);
    window.addEventListener('mouseup', mouseUp);

}

function seek(event) {
    activeSong.currentTime = activeSong.duration * clickPercent(event, songSlider, timelineWidth);
}

function clickPercent(e, songSlider, timelineWidth) {
    return (event.clientX - getPosition(songSlider)) / timelineWidth;
}

function getPosition(el) {
    return el.getBoundingClientRect().left;
}

function drag(e) {
    onplayhead = jQuery(this).attr("id");
    window.addEventListener('mousemove', dragFunc);
    activeSong.removeEventListener('timeupdate', timeUpdate);
}

function dragFunc(e) {
    var newMargLeft = e.clientX - getPosition(songSlider);

    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        pointerButton.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        pointerButton.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
        pointerButton.style.marginLeft = timelineWidth + "px";
    }
}

function mouseUp(e) {
    if (onplayhead != null) {
        window.removeEventListener('mousemove', dragFunc);
        activeSong.currentTime = activeSong.duration * clickPercent(e, songSlider, timelineWidth);
        activeSong.addEventListener('timeupdate', timeUpdate);
    }
    onplayhead = null;
}

function timeUpdate() {
    var playPercent = timelineWidth * (activeSong.currentTime / activeSong.duration);
    if (activeSong.currentTime == activeSong.duration) {
        activeSong.pause();
    }
}

function test() {
    let i = 1;
    let a = 2;

    let b = a+i;
    console.log(b);
}