// Module aliases for Matter.js
const Engine = Matter.Engine;
const Body = Matter.Body;
const World = Matter.World;
const Bodies = Matter.Bodies;

// Global variables
let engine;
let world;

// An object to hold all the bodies for the current scene
let sceneObjects = {};
let currentScene = '';

function setup() {
    // --- p5.js setup ---
    const canvas = createCanvas(800, 600);
    canvas.parent('main');

    // --- Matter.js setup ---
    engine = Engine.create();
    world = engine.world;

    // --- Scene Selection Logic ---
    const selectCircleBtn = document.getElementById('select-circle');
    const selectWedgeBtn = document.getElementById('select-wedge');
    const selectCircleWedgeBtn = document.getElementById('select-circle-wedge');

    selectCircleBtn.addEventListener('click', () => {
        switchScene('circle');
        selectCircleBtn.classList.add('active');
        selectWedgeBtn.classList.remove('active');
        selectCircleWedgeBtn.classList.remove('active');
    });

    selectWedgeBtn.addEventListener('click', () => {
        switchScene('wedge');
        selectWedgeBtn.classList.add('active');
        selectCircleBtn.classList.remove('active');
        selectCircleWedgeBtn.classList.remove('active');
    });

    selectCircleWedgeBtn.addEventListener('click', () => {
        switchScene('circle-wedge');
        selectCircleWedgeBtn.classList.add('active');
        selectCircleBtn.classList.remove('active');
        selectWedgeBtn.classList.remove('active');
    });

    // Start with the circle scene
    switchScene('circle');
}

function switchScene(sceneName) {
    if (currentScene === sceneName) return;
    currentScene = sceneName;

    // Clear all bodies and composites from the world
    World.clear(world);
    Engine.clear(engine);
    sceneObjects = {};

    // Set up the new scene
    if (sceneName === 'circle') {
        setupCircleScene();
    } else if (sceneName === 'wedge') {
        setupWedgeScene();
    } else if (sceneName === 'circle-wedge') {
        setupCircleWedgeScene();
    }
}

function setupCircleScene() {
    world.gravity.y = 1; // Enable gravity to make the circle rest and roll on the floor

    // Use the same floor as the wedge scene for consistency. Add friction for rolling.
    sceneObjects.ground = Bodies.rectangle(width / 2, height - 20, width * 10, 40, {
        isStatic: true,
        friction: 0.5
    });

    const circleRadius = 40;
    // Adjust circle's Y position to match the new floor height
    sceneObjects.circle = Bodies.circle(100, height - 40 - circleRadius, circleRadius, { friction: 0.05, restitution: 0.5 });

    World.add(world, [sceneObjects.ground, sceneObjects.circle]);
    Body.setVelocity(sceneObjects.circle, { x: 7, y: 0 });
}

function setupWedgeScene() {
    world.gravity.y = 1; // Enable gravity for this scene

    // Create a frictionless floor
    sceneObjects.ground = Bodies.rectangle(width / 2, height - 20, width * 10, 40, { isStatic: true, friction: 0 });

    // Create the wedge
    const wedgeWidth = 300;
    const wedgeHeight = 150;
    const wedgeX = width / 2 - 100;
    const wedgeY = height - 40 - wedgeHeight / 2;
    const wedgeVertices = [
        { x: -wedgeWidth / 2, y:  wedgeHeight / 2 },
        { x:  wedgeWidth / 2, y:  wedgeHeight / 2 },
        { x: -wedgeWidth / 2, y: -wedgeHeight / 2 }
    ];
    sceneObjects.wedge = Bodies.fromVertices(wedgeX, wedgeY, [wedgeVertices], { friction: 0, frictionStatic: 0, frictionAir: 0 });

    // Create the box
    const boxSize = 50;
    const wedgeAngle = Math.atan2(wedgeHeight, wedgeWidth);
    const boxX = wedgeX - wedgeWidth / 4;
    const boxY = wedgeY - wedgeHeight / 4 - boxSize / 2;
    sceneObjects.box = Bodies.rectangle(boxX, boxY, boxSize, boxSize, { friction: 0, frictionStatic: 0, frictionAir: 0 });
    Body.setAngle(sceneObjects.box, wedgeAngle);

    World.add(world, [sceneObjects.ground, sceneObjects.wedge, sceneObjects.box]);
}

function setupCircleWedgeScene() {
    world.gravity.y = 1; // Enable gravity for this scene

    // Create a frictionless floor
    sceneObjects.ground = Bodies.rectangle(width / 2, height - 20, width * 10, 40, { isStatic: true, friction: 0 });

    // Create the wedge. For the circle to roll, the wedge surface needs friction.
    const wedgeWidth = 300;
    const wedgeHeight = 150;
    const wedgeX = width / 2 - 100;
    const wedgeY = height - 40 - wedgeHeight / 2;
    const wedgeVertices = [
        { x: -wedgeWidth / 2, y:  wedgeHeight / 2 },
        { x:  wedgeWidth / 2, y:  wedgeHeight / 2 },
        { x: -wedgeWidth / 2, y: -wedgeHeight / 2 }
    ];
    sceneObjects.wedge = Bodies.fromVertices(wedgeX, wedgeY, [wedgeVertices], { friction: 0, frictionStatic: 0, frictionAir: 0 });

    // Create the circle
    const circleRadius = 25;
    const wedgeAngle = Math.atan2(wedgeHeight, wedgeWidth);
    const circleX = wedgeX - wedgeWidth / 4;
    const circleY = wedgeY - wedgeHeight / 4 - circleRadius;
    // The circle also needs friction to be able to roll down the slope
    sceneObjects.circle = Bodies.circle(circleX, circleY, circleRadius, { friction: 0, frictionStatic: 0, frictionAir: 0 });

    World.add(world, [sceneObjects.ground, sceneObjects.wedge, sceneObjects.circle]);
}

function draw() {
    background(51);
    Engine.update(engine);

    noStroke();

    // Draw the current scene
    if (currentScene === 'circle') {
        drawCircleScene();
    } else if (currentScene === 'wedge') {
        drawWedgeScene();
    } else if (currentScene === 'circle-wedge') {
        drawCircleWedgeScene();
    }
}

function drawCircleScene() {
    fill(128);
    drawVertices(sceneObjects.ground.vertices);

    fill(255, 100, 100);
    drawVertices(sceneObjects.circle.vertices);
}

function drawWedgeScene() {
    fill(128);
    drawVertices(sceneObjects.ground.vertices);

    fill(200, 200, 0);
    drawVertices(sceneObjects.wedge.vertices);

    fill(0, 150, 255);
    drawVertices(sceneObjects.box.vertices);
}

function drawCircleWedgeScene() {
    fill(128);
    drawVertices(sceneObjects.ground.vertices);

    fill(200, 200, 0);
    drawVertices(sceneObjects.wedge.vertices);

    // Use a different color for this circle
    fill(255, 100, 100);
    drawVertices(sceneObjects.circle.vertices);
}

// Helper function to draw a shape from a list of vertices.
function drawVertices(vertices) {
    beginShape();
    for (let i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}
