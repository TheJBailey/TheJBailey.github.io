$(function() {

	var dirs = ["imgs/"];
	var regexp = new RegExp("\.png|\.jpg|\.gif");
	var regexpVid = new RegExp("\.webm|\.mp4");
	for(i = 0; i < dirs.length; i++) {
		var dir = dirs[i];
		if (typeof process !== "undefined" && process.versions['node-webkit']) {
			//nodewebkit is being used
		}else {
			$.ajax({
			    //This will retrieve the contents of the folder if the folder is configured as 'browsable'
			    url: dir,
			    success: function (data) {
			        //List all .png file names in the page
			        $(data).find("a").filter(function () {return regexp.test($(this).text()) || regexpVid.test($(this).text());}).each(function () {
			            var filename = this.href.replace(window.location.host, "").replace("http://", "");
			            if(regexpVid.test(filename)) $("body").append("<span><div></div><video loop><source src='" + dir + filename + "'></video></span>");
			            else $("body").append("<span><div></div><img src='" + dir + filename + "'></span>");

			        });
			    }
			});
		}
	}


	$(document).ajaxComplete(function() {
		
		spans = $('span').get();
		
		$('img').on('dragstart', function(event) { event.preventDefault(); });
		for(i = 0, $span; i < spans.length; i++) {
			var $span = $(spans[i]);
			$span.addClass('smallify');
			
			$span.click(function() {
				var shift;
				if($(this).hasClass("biggify")) { //checks if span is big
					$(this).addClass("smallify").removeClass("biggify"); //enlarges span
					
					var $video = $(this).children();
					if($video[1].tagName == 'VIDEO') $video[1].pause();
				} else {
					var $bigg = $('.biggify');
					if($bigg.length) {
						var $video = $bigg.children();
						if($video[1].tagName == 'VIDEO') $video[1].pause();

						$bigg.addClass('smallify').removeClass('biggify'); //makes big span small
					}
					$(this).addClass("biggify").removeClass("smallify"); //shrinks span
					
					var $video = $(this).children();
					if($video[1].tagName == 'VIDEO') $video[1].play();
					
					shift = 4; // compenstates for span changing rows
				}
				
				var index = $('span').index($(this));
				if(index >= shift) index += shift;
				// calaculates the correct scroll position
				var scroll = Math.floor(index / ($(window).width() / $('.smallify').width())) * $('.smallify').width();
				$('html, body').animate({ //smooth scrolling
					scrollTop: scroll
				}, 500);
				
			});
		}

	});

	var dropZone = document.getElementById('dropzone');

	function showDropZone() {
	    dropZone.style.visibility = "visible";
	    dropZone.style.background = 'rgba(255, 90, 90, 1)';
	    dropZone.style.color = 'rgba(240, 240, 240, 1)';
	}
	function hideDropZone() {
		dropZone.style.background = 'rgba(255, 90, 90, 0)';
	    dropZone.style.color = 'rgba(240, 240, 240, 0)';
		setTimeout(function(){ 
	        dropZone.style.visibility = "hidden";
	    }, 300);
	}

	function allowDrag(e) {
	    if (true) {  // Test that the item being dragged is a valid one
	        e.preventDefault();
	        e.dataTransfer.dropEffect = 'link';
	    }
	}

	function handleDrop(e) {
	    e.stopPropagation();
   		e.preventDefault();
   		e.dataTransfer.dropEffect = 'link';
	    hideDropZone();
	    var data = e.dataTransfer;
	    console.log(data);
	}

	// 1
	window.addEventListener('dragenter', function(e) {
		e.dataTransfer.dropEffect = 'link';
	    showDropZone();
	});

	// 2
	dropZone.addEventListener('dragenter', allowDrag);
	dropZone.addEventListener('dragover', allowDrag);

	// 3
	dropZone.addEventListener('dragleave', function(e) {
	    hideDropZone();
	});

	// 4
	dropZone.addEventListener('drop', handleDrop);
});

