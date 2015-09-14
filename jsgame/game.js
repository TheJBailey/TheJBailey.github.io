(function() {

	var 
	canvas = document.getElementById("canvas"), 
	ctx = canvas.getContext("2d");
	width = canvas.width = 736, 
	height = canvas.height = 736;

	var mouse = { x: 0, y: 0, lmb: false, _time: 0 };
	var circle = 0;
	var fps = 0, fpsT = 60;

	function main() {
		initMouse();
		run();
	}

	var counter = 0, dt = 0, now, step = 1/fpsT;
	var last = currentTime();
	var tick = 0;

	function run() {
		tick = tick > 60 ? 0 : tick+1;
		now = currentTime();
		dt = dt + Math.min(1, (now - last) / 1000);
		while(dt > step) {
			dt = dt - step;
			update(step);
		}
		if (tick % 3 == 0) fps = Math.round(100 * dt * fpsT);
		render();
		last = now;
		counter++;
		requestAnimationFrame(run, canvas);
	}

	function update() {
		var inc = 2 * Math.PI / 100;
		var val = mouse.lmb ? circle + inc : circle - inc;
		circle = (val > 0) ? ((val < 2 * Math.PI) ? val : 2 * Math.PI) : 0;
	}

	function render() {
		//ctx.clearRect(0,0,width,height);
		ctx.fillStyle = "#000";
		ctx.fillRect(0,0, width, height);
		renderMouse();

		ctx.fillStyle = 'yellow';
		ctx.fillText(fps, 10, 20);
	}

	function renderMouse() {
		ctx.strokeStyle = "#EEE";
		ctx.beginPath();
		ctx.arc(mouse.x, mouse.y, 20, 0, circle);
		ctx.stroke();

		ctx.fillStyle = "#EEE";
		ctx.fillRect(mouse.x-5, mouse.y-5, 10, 10);
	}


	function initMouse() {
		canvas.addEventListener('mousemove', function(evt) {
			var rect = canvas.getBoundingClientRect();
			mouse.x = Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
			mouse.y = Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);
		}, false);
		canvas.addEventListener('mousedown', function(evt) {
			mouse.lmb = true;
		}, false);
		canvas.addEventListener('mouseup', function(evt) {
			mouse.lmb = false;
		}, false);
	}

	function currentTime() {
		return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
	}

	//------------------------------------------------
  	//------------------ POLYFILLS -------------------
	//------------------------------------------------

  	if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  		window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
  		window.mozRequestAnimationFrame    || 
  		window.oRequestAnimationFrame      || 
  		window.msRequestAnimationFrame     || 
  		function(callback, element) {
  			window.setTimeout(callback, 1000 / 60);
  		}
  	}

  	var readyStateCheckInterval = setInterval(function() {
  		if (document.readyState === "complete") {
  			clearInterval(readyStateCheckInterval);
  			main();
  		}
  	}, 10);
  	//main();
  })();