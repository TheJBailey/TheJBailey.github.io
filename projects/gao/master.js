(function() {
  var video = document.getElementsByTagName('video')[0];
  video.onmouseover = function() {
    if(!video.paused) video.play();
  }
})();
