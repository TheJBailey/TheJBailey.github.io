// TODO fairly certain there's a memory leak somewhere


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
  var bounds = { size: 30 }

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

    circle1 = Bodies.circle(100,100,50,{label:"circle"});
    circle2 = Bodies.circle(200,100,50,{label:"circle"});
    World.add(world, [circle1, circle2]);

    bounds.top    = Bodies.rectangle(width / 2, bounds.size / 2, width, bounds.size, {isStatic: true, label:"bounds"});
    bounds.bottom = Bodies.rectangle(width / 2, height - (bounds.size / 2), width, bounds.size, {isStatic: true, label:"bounds"});
    bounds.right  = Bodies.rectangle(width - (bounds.size / 2), height / 2, bounds.size, height-(bounds.size*2), {isStatic: true, label:"bounds"});
    bounds.left   = Bodies.rectangle(bounds.size  / 2, height / 2, bounds.size, height-(bounds.size*2), {isStatic: true, label:"bounds"});

    World.add(world, [bounds.top, bounds.bottom, bounds.right, bounds.left]);

    var mouse = Mouse.create(render.canvas);
        mouseConstraint = Matter.MouseConstraint.create(engine, {
           mouse: mouse,
           constraint: {
               stiffness: 1,
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
      if(bodies[i].label == "bounds") ctx.fillStyle="#222";
      else if(bodies[i].label == "circle") ctx.fillStyle="#47efac";

      var vertices = bodies[i].vertices;

      ctx.beginPath();
      ctx.moveTo(Math.ceil(vertices[0].x), Math.ceil(vertices[0].y));

      for (var j = 1; j < vertices.length; j += 1) {
        ctx.lineTo(Math.ceil(vertices[j].x), Math.ceil(vertices[j].y));
      }

      ctx.lineTo(Math.ceil(vertices[0].x), Math.ceil(vertices[0].y));
      //console.log(ctx.fillStyle, bodies[i].label);
      ctx.fill();
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
