var regexpImg = new RegExp("\.png|\.jpg|\.gif");
var regexpVid = new RegExp("\.webm|\.mp4");

var gridStackOptions = {
	animate: true,
	disableDrag: true
};

var grid = $('.grid-stack').gridstack(gridStackOptions);

var COLUMNS = 6;

function load(dir) {
	$.ajax({
		url: dir,
		success: function (data) {
			$(data).find("a").filter(function () {return regexpImg.test($(this).text()) || regexpVid.test($(this).text());}).each(function () {
				var filename = this.href.replace(window.location.host, "").replace("http://", "").replace("/griddish/", "");
				var widget;
				if(regexpVid.test(filename)) 
					createTile("<div><video loop><source src='" + dir + filename + "'></video></div>");
				else
					createTile("<div><img src='" + dir + filename + "'></div>");
			});
		}
	});
}

function createTile(content) {
	grid.addWidget(content);
}

$(function() {

	load('assets/imgs/');

});
