$(function load() {

	// Gridster INIT
	var gridster;

	gridster = $(".gridster > ul").gridster({
		widget_base_dimensions: [150, 150]
	}).data('gridster');

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
			        	var filename = this.href.replace(window.location.host, "").replace("http://", "").replace("/grid-image-viewer/", "");
			        	//if(regexpVid.test(filename)) $("body").append("<span><div></div><video loop><source src='" + dir + filename + "'></video></span>");
			        	//else $("body").append("<span><div></div><img src='" + dir + filename + "'></span>");
			        	var widget = ["<li><div></div><img src='" + dir + filename + "'></li>", 1, 1];
			        	gridster.add_widget.apply(gridster, widget);
			        });
			    }
			});
		}
	}


	$(document).ajaxComplete(function() {
		
		li_elems = $('li').get();
		
		$('img').on('dragstart', function(event) { event.preventDefault(); });
		for(i = 0, $li_el; i < li_elems.length; i++) {
			var $li_el = $(li_elems[i]);
			$li_el.addClass('smallify');
			
			$li_el.click(function() {
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
				
				var index = $('li').index($(this));
				if(index >= shift) index += shift;
				// calaculates the correct scroll position
				var scroll = Math.floor(index / ($(window).width() / $('.smallify').width())) * $('.smallify').width();
				$('html, body').animate({ //smooth scrolling
					scrollTop: scroll
				}, 500);
				
			});
		}

	});

	window.requestFileSystem = window.requestFileSystem ||
	window.webkitRequestFileSystem;
	window.resolveLocalFileSystemURL = window.webkitResolveLocalFileSystemURL ||
	window.webkitResolveLocalFileSystemURL;

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
	    }
	}

	var cwd = null;
	
	function handleDrop(e) {
		e.preventDefault();
		e.stopPropagation();

		var items = e.dataTransfer.items;
		var files = e.dataTransfer.files;

		for (var i = 0, item; item = items[i]; ++i) {
	    	// Skip this one if we didn't get a file.
	    	if (item.kind != 'file') {
	    		continue;
	    	}

	    	var entry = item.webkitGetAsEntry();
	    	if (entry.isDirectory) {
	    		//setLoadingTxt({
	    		//	txt: 'Importing directory: ' + entry.name,
	    		//	stayOpen: true
	    		//});

		      // Copy the dropped DirectoryEntry over to our local filesystem.
		      entry.copyTo(cwd, null, function(copiedEntry) {
		      	//setLoadingTxt({txt: DONE_MSG});
		      	renderImages(cwd);
		      }, onError);  
		  } else {
		  	if (entry.isFile && files[i].type.match('^image/')) {
			        // Copy the dropped entry into local filesystem.
			        entry.copyTo(cwd, null, function(copiedEntry) {
			        	//setLoadingTxt({txt: DONE_MSG});
			        	renderImages(cwd);
			        }, onError); 
			    } else {
			    	//setLoadingTxt({txt: NOT_IMG_MSG, error: true});
			    }
			}
		}
	}

	function toArray(list) {
		return Array.prototype.slice.call(list || [], 0);
	}

	function readDirectory(dirEntry, callback) {
		var dirReader = dirEntry.createReader();
		var entries = [];

		// Call the reader.readEntries() until no more results are returned.
		var readEntries = function() {
			dirReader.readEntries (function(results) {
				if (!results.length) {
					callback(entries);
				} else {
					entries = entries.concat(toArray(results));
					readEntries();
				}
			}, onError);
		};

		readEntries(); // Start reading dirs.
	}

	function renderImages(dirEntry) {
		readDirectory(dirEntry, function(entries) {
    		// Handle no files case.
    		if (!entries.length) {
    			//footer.textContent = 'Add some files chief!';
    			//footer.classList.add('nofiles');
    			return;
    		}

    		//footer.classList.remove('nofiles');

    		var frag = document.createDocumentFragment();

    		//var span = document.createElement('span');
    		//span.innerHTML = '&laquo;';
    		//span.title = 'Move up a directory;';
    		//span.addEventListener('click', onThumbnailClick);
    		//frag.appendChild(span);

    		entries.forEach(function(entry, i) {
    			//var div = document.createElement('div');
    			
    			//div.dataset.fullPath = entry.fullPath;

    			//var img = new Image();
    			if (entry.isDirectory) {
    				//img.src = 'folder.png';
    				//div.dataset.isDirectory = 'true';
    				console.log(entry);
    			} else {
    				console.log(entry);
        		//img.src = window.URL.createObjectURL(files[i]); // Equivalent to item.getAsFile().
        		entry.file(function(f) {
        			//img.src = f.type.match('^image/') ? entry.toURL() : 'file.png';
        		}, onError);
        	}

	        	//img.title = entry.name;
	        	//img.alt = entry.name;

	        	//var span = document.createElement('span');
	        	//span.textContent = entry.name;

	        	//var span2 = document.createElement('span');
	        	//span2.textContent = 'X';
	        	//span2.classList.add('close');
	        	//span2.addEventListener('click', onClose);

	        	//div.appendChild(span2);
	        	//div.appendChild(img);
	        	//div.appendChild(span);
	        	//div.addEventListener('click', onThumbnailClick);

	        	//frag.appendChild(div);
	        });

    		//footer.innerHTML = '';
    		//footer.appendChild(frag);
    	});
	}

	function onError(e) {
		var msg = '';
		msg= e.name + " " + e.message + " " + e.toString();

		console.log('Error: ' + msg);
	}

	// 1
	window.addEventListener('dragenter', function(e) {
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
	function init() {
		window.requestFileSystem(TEMPORARY, 1024 * 1024, function(fileSystem) {
			fs = fileSystem;
			cwd = fs.root;
			renderImages(cwd);
		}, onError);
	}

	init();
});


