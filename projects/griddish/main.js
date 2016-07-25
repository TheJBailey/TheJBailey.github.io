var regexpImg = new RegExp("\.png|\.jpg|\.gif");
var regexpVid = new RegExp("\.webm|\.mp4");

var gridStackOptions = {
	
};

var grid;
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
	grid.addWidget(content, 0, 0, 2, 2, true);
}

$(function() {

	grid = $('.grid-stack').gridstack(gridStackOptions);
	grid.attr('data-gs-width', 6);

	grid = grid.data('gridstack');
	//grid.verticalMargin(0, false);
	//grid.disable();

	console.log(grid);
	load('assets/imgs/');
});
