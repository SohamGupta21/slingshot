// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;
//^^ I have no idea what the difference is between this one and the one above
const drawConstraint = Helpers.drawConstraint;

let engine;
let ground;

let constraint1;
let poly1;

let constraint2;
let poly2;

let constraint3;
let rect3;
let ball3;

let constraint4;
let polyA4;
let polyB4;

//--------------------Bridge Variables--------------------//
let bridge;

let baseRect;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  //------------------------Bridge Stuff Start------------------------//

  // adding bridge
  const group = Body.nextroup(true);
  const rects = Composites.stack(100, 200, 10, 1, 10, 10, function(x, y) {
    return Bodies.rectangle(x, y, 50, 5, { collisionFilter: { group: group } });
  });
  bridge = Composites.chain(rects, 0.5, 0, -0.5, 0, {stiffness: 1.0, length: 2, render: {type: 'line'}});
  World.add(engine.world, [bridge]);

    // left and right fix point of bridge
    Composite.add(rects, Constraint.create({
      pointA: {x: 100, y: 200},
      bodyB: rects.bodies[0],
      pointB: {x: -25, y: 0},
      stiffness: 0.1
    }));
    Composite.add(rects, Constraint.create({
      pointA: {x: 700, y: 200},
      bodyB: rects.bodies[rects.bodies.length-1],
      pointB: {x: +25, y: 0},
      stiffness: 0.02
    }));

  //------------------------Bridge Stuff End------------------------//


  // add stiff global constraint
  poly1 = Bodies.polygon(300, 200, 5, 40);
  constraint1 = Constraint.create({
    pointA: { x: 150, y: 50 },
    bodyB: poly1,
    pointB: { x: -10, y: -20 }
  });
  World.add(engine.world, [poly1, constraint1]);

  // add damped soft global constraint
  poly2 = Bodies.polygon(400, 100, 4, 30);
  constraint2 = Constraint.create({
    pointA: { x: 400, y: 120 },
    bodyB: poly2,
    pointB: { x: -10, y: -10 },
    stiffness: 0.001, //makes the string "stretchy"//
    damping: 0.05 //How fast the string goes back to normal position
  });
  World.add(engine.world, [poly2, constraint2]);

  // add revolute constraint
  rect3 = Bodies.rectangle(600, 200, 200, 20);
  constraint3 = Constraint.create({
    pointA: { x: 600, y: 200 },
    bodyB: rect3,
    length: 0
  });
  // add a ball3 to play with the constraint
  ball3 = Bodies.circle(550, 150, 20);
  World.add(engine.world, [rect3, ball3, constraint3]);

  // add stiff multi-body constraint
  polyA4 = Bodies.polygon(100, 400, 6, 20);
  polyB4 = Bodies.polygon(200, 400, 1, 50);
  constraint4 = Constraint.create({
    bodyA: polyA4,
    pointA: { x: 0, y: 0 },
    bodyB: polyB4,
    pointB: { x: -10, y: -10 },
    stiffness: 0.01
  });
  World.add(engine.world, [polyA4, polyB4, constraint4]);

  // base of slingshot
  baseRect = Bodies.rectangle(400, height-30, 80, 30, {isStatic: true});
  World.add(engine.world, [baseRect]);

  // ground
  ground = Bodies.rectangle(400, height-10, 810, 30, {isStatic: true});
  World.add(engine.world, [ground]);

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

  stroke(255);
  fill(255);
  drawBody(poly1);
  drawBody(poly2);
  drawBody(rect3);
  drawBody(ball3);
  drawBody(polyA4);
  drawBody(polyB4);
  drawBodies(bridge.bodies);
  stroke(128);
  strokeWeight(2);
  drawConstraint(constraint1);
  drawConstraint(constraint2);
  drawConstraint(constraint3);
  drawConstraint(constraint4);
  drawConstraint(bridge.constraints);

  noStroke();
  fill(128);
  drawBody(ground);
  drawBody(baseRect)
  drawMouse(mouseConstraint);
}
