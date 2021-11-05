// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;
//^^ I have no idea what the difference is between this one and the one above
//^^ Update, I think that's just to draw multiple bodies at hence (since a bridge is made of multiple bodies of rects)
const drawConstraint = Helpers.drawConstraint;

let engine;
let ground;
let ball;

// the top screw on
let topConstraint;
let bottomConstraint;
let constraint4;

// the slingshot shape
let rect1;
let rectTwo;
let baseRect;
let middleRect;
let leftPost;
let rightPost;

//Bridge Var's
let bridge;

let bridgeLeftConstraint;
let bridgeRightConstraint;

function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();
  
  //------------------------Bridge Stuff Start------------------------//

  // adding bridge
  const group = Body.nextGroup(true);
  const rects = Composites.stack(100, 200, 6, 1, 30, 50, function(x, y) {
    //stack syntax: xx, yy, col, row, colGap, rowGap, callback
    //Ian Notes: colGap controls tightness of the string
    return Bodies.rectangle(x, y, 50, 10, { collisionFilter: { group: group } });
  });
  bridge = Composites.chain(rects, 0.5, 0, -0.5, 0, {stiffness: 1.0, length: 1.0, render: {type: 'line'}});
  //Composites syntax: composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options(Ie stiffness, length, etc)
  World.add(engine.world, [bridge]);

    // left and right fix point of bridge

    bridgeLeftConstraint = Constraint.create({
      pointA: {x: 175, y: 250},
      bodyB: rects.bodies[0],
      pointB: {x: -10, y: 0},
      //Ian Notes: I changed the x on point B to center the rectanlges
      //Ian Notes: OG Value: -5
      stiffness: 0.3
    })

    Composite.add(rects, bridgeLeftConstraint);

    bridgeRightConstraint = Constraint.create({
      pointA: {x: 625, y: 250},
      bodyB: rects.bodies[rects.bodies.length-1],
      pointB: {x: -5, y: 0},
      stiffness: 0.3
    })
    Composite.add(rects, bridgeRightConstraint);

  //------------------------Bridge Stuff End------------------------//

    // add ball
    ball = Bodies.circle(400, 400, 20);
    World.add(engine.world, [ball]);

  // //Top Screw On
  // rect1 = Bodies.rectangle(200, 20, 100, 5); //sling shot shape
  // topConstraint = Constraint.create({
  //   pointA: { x: 50, y: 300 },
  //   bodyB: rect1,
  //   pointB: { x: +40, y: 0 },
  //   stiffness: 0.1
  // });
  // World.add(engine.world, [rect1, topConstraint]);

  // rect2 = Bodies.rectangle(300, 20, 100, 5);
  // bottomConstraint = Constraint.create({
  //   pointA: {x: 500, y: 300},
  //   bodyB: rect2,
  //   pointB: {x: -40, y: -40},
  //   stiffness: 0.1
  // });
  // World.add(engine.world, [rect1, bottomConstraint]);

  // constraint4 = Constraint.create({
  //   bodyA: rect1,
  //   pointA: { x: -50, y: 00 },
  //   bodyB: rect1,
  //   pointB: { x: -10, y: -10 },
  //   stiffness: 1.0,
  //   dampness: 0.4
  // });
  //World.add(engine.world, [rect1, rect2, constraint4]);

  baseRect = Bodies.rectangle(400, height-30, 80, 300, {isStatic: true});
  middleRect = Bodies.rectangle(400, height-180, 450, 50, {isStatic: true});
  leftPost = Bodies.rectangle(175, height-255, 20, 200, {isStatic: true});
  rightPost = Bodies.rectangle(625, height-255, 20, 200, {isStatic: true});
  // ground
  ground = Bodies.rectangle(400, height-10, 810, 30, {isStatic: true});
  
  World.add(engine.world, [baseRect, middleRect, leftPost, rightPost, ground]);

  // setup mouse
  const mouse = Mouse.create(canvas.elt);
  const mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0);
  // drawBody(rect1);
  // drawBody(rect2);
  noStroke();
  fill(128);
  stroke(128);
  strokeWeight(2);
  // drawConstraint(topConstraint);
  // drawConstraint(bottomConstraint);
  drawConstraint(bridgeLeftConstraint);
  drawConstraint(bridgeRightConstraint);
  //drawConstraint(bridge.constraints);
  // drawConstraint(constraint4);
  drawBody(ground);
  drawBody(baseRect);
  drawBody(middleRect);
  drawBody(leftPost);
  drawBody(rightPost);
  drawBodies(bridge.bodies);
  drawBody(ball);

  drawMouse(mouseConstraint);
}
