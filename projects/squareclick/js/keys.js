var $body = $(document.body)

keyboardJS.bind('alt + o', function(e) {
  //if (state == GAME_STATE.MENU) state = GAME_STATE.PLAYING;
  //else if (state == GAME_STATE.PLAYING) state = GAME_STATE.MENU;
})

keyboardJS.bind('alt + l', function(e) {
  dark = !dark;
  $body.toggleClass('night');
  $body.toggleClass('day');
})

keyboardJS.bind('alt + b', function(e) {
  map.binds = !map.binds;
})

keyboardJS.bind('alt + m', function(e) {
  map.nextMode();
})

keyboardJS.bind('ctrl', function(e) { ctrl = true },function(e) { ctrl = false });
keyboardJS.bind('alt', function(e) { alt = true },function(e) { alt = false });
