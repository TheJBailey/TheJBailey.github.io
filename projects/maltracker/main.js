var ctx = document.getElementById('chart').getContext('2d');

var data = {},
    options = {};

var chart = new Chart(ctx, {type: 'line', data: data, options: options});

var site = "https://myanimelist.net/profile/",
    users = ["sweatergod", "izuni", "detrho", "yggdrasi","xtprest"];

for(var i = 0; i < users.length; i++) {
  getUserAnimeData(users[i]);
}

function getUserAnimeData(user) {
  $.getJSON('http://allorigins.me/get?url=' + encodeURIComponent(site) + user + '&callback=?', function(data) {
    var content = data.contents;

    var preIndex = content.indexOf('stats anime');
    var index =  preIndex + content.substr(preIndex).indexOf(":")+9;

    content = content.substr(index);
    content = content.substr(0, content.indexOf("<"));
    user.days.push(parseFloat(content));
  });
}

console.log(users);
