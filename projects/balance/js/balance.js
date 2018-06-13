(function() {
  console.log('v0.0.1');
  // graphics variable
  var canvas, ctx, width, height;

  // matter.js variables
  var engine, world, mouse;

  // matter.js modules
  var Engine = Matter.Engine,
      World  = Matter.World,
      Bodies = Matter.Bodies,
      Mouse  = Matter.Mouse;

  // balance.js objects
  var square1, square2;
  var bounds = { size: 20 }

  // @run() [psuedo]
  function run() {
    // graphics initiliaztion
    canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext('2d');
    window.onresize = resize;
    resize();

    // matter.js initiliaztion
    engine = Engine.create();
    world = engine.world;

    square1 = Bodies.rectangle(100,100,40,40, {label:"square"});
    square2 = Bodies.rectangle(200,100,40,40, {label:"square"});
    World.add(world, [square1, square2]);

    bounds.top    = Bodies.rectangle(width / 2, bounds.size / 2, width-(bounds.size*2), bounds.size, {isStatic: true, label:"bounds"});
    bounds.bottom = Bodies.rectangle(width / 2, height - (bounds.size / 2), width-(bounds.size*2), bounds.size, {isStatic: true, label:"bounds"});
    bounds.right  = Bodies.rectangle(width - (bounds.size / 2), height / 2, bounds.size, height-(bounds.size*2), {isStatic: true, label:"bounds"});
    bounds.left   = Bodies.rectangle(bounds.size  / 2, height / 2, bounds.size, height-(bounds.size*2), {isStatic: true, label:"bounds"});

    World.add(world, [bounds.top, bounds.bottom, bounds.right, bounds.left]);

    var mouse = Mouse.create(render.canvas);
        mouseConstraint = Matter.MouseConstraint.create(engine, {
           mouse: mouse,
           constraint: {
               stiffness: 0.2,
               render: {
                   visible: false
               }
           }
        });

    World.add(world, mouseConstraint);
    // start() call [psuedo]
    requestAnimationFrame(render);
  }

  run();

  /**
  * @update()
  * delta -> time since last render call
  */
  function update(delta) {
    // matter.js engine update
    Engine.update(engine, delta);

  }

  /**
  * @render()
  * stamp -> ms since first requestAnimationFrame call
  * last  -> last time of render call
  */
  var last = 0;
  function render(stamp) {
    delta = stamp - last;
    last = stamp;

    update(delta);

    ctx.fillStyle="white";
    ctx.fillRect(0,0,width,height);


    // temporary rendition
    var bodies = Matter.Composite.allBodies(engine.world);

    for (var i = 0; i < bodies.length; i += 1) {
      if(bodies[i].label == "bounds") ctx.fillStyle="white";
      else if(bodies[i].label == "square") ctx.fillStyle="#47efac";

      var vertices = bodies[i].vertices;

      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);

      for (var j = 1; j < vertices.length; j += 1) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
      }

      ctx.lineTo(vertices[0].x, vertices[0].y);
      //console.log(ctx.fillStyle, bodies[i].label);
      ctx.strokeStyle='#666';
      if(bodies[i].label == "bounds") ctx.stroke();
      else ctx.fill();
    }

    requestAnimationFrame(render);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

})();
