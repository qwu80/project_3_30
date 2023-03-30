let canvasWidth = 600;
let canvasHeight = 400;
let emissionX = canvasWidth / 2;
let emissionY = canvasHeight - 10;
let slitWidth = 10;
let slitHeight = 20;
let doubleSlitX1 = canvasWidth / 3;
let doubleSlitX2 = 2 * canvasWidth / 3;
let doubleSlitY = canvasHeight / 2;
let hoverX = null;
let probabilityData = [];
let incrementValue = 2;
let balls = [];

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  // for (let i = 0; i < canvasWidth / incrementValue; i++) {
  //   let x = random(0, canvasWidth);
  //   balls.push(new Ball(x));
  // }

  createButton("Generate Ball").mousePressed(generateBall);
  createButton("Clear Ball").mousePressed(clearBall);

  mouseMoved(showWave);
  for (let x = 0; x < canvasWidth; x += incrementValue) {
    let distanceFromLeft = dist(x, doubleSlitY, doubleSlitX1 - slitWidth / 2, doubleSlitY);
    let distanceFromRight = dist(x, doubleSlitY, doubleSlitX2 + slitWidth / 2, doubleSlitY);
    let phaseLeft = distanceFromLeft * 2 * PI / slitWidth;
    let phaseRight = distanceFromRight * 2 * PI / slitWidth;
    let amplitudeLeft = cos(phaseLeft);
    let amplitudeRight = cos(phaseRight);
    let amplitudeTotal = amplitudeLeft * amplitudeRight;
    let probability = amplitudeTotal ** 2;
    probabilityData.push(probability);
  }
}

function draw() {
  background(0);

  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].display();
  }

  
  for (let i = 0; i < probabilityData.length; i++) {
    let x = i * incrementValue;
    let distanceFromTop = dist(hoverX, canvasHeight / 2, x, canvasHeight / 2);
    let phase1 = distanceFromTop * 2 * PI / slitWidth;
    let phase2 = distanceFromTop * 2 * PI / slitWidth;
    let amplitudeLeft = cos(phase1);
    let amplitudeRight = cos(phase2);
    let amplitudeTotal = amplitudeLeft * amplitudeRight;
    let probability = amplitudeTotal ** 2;
    probabilityData[i] = probability;
  }
  noStroke();
  for (let i = 0; i < probabilityData.length; i++) {
    let probability = probabilityData[i];
    let probabilityHeight = map(probability, 0, 1, 0, 10);
    let x = i * incrementValue;
    let y = canvasHeight / 4 + (i % 5) * incrementValue;
    fill(0, 255, 0);
    rect(x, y - probabilityHeight, incrementValue, probabilityHeight);
  }
  fill(100, 70, 0);
  rect(0, canvasHeight / 2 - slitHeight / 2, canvasWidth, slitHeight);
  fill(255);
  rect(doubleSlitX1 - slitWidth / 2, doubleSlitY - slitHeight / 2, slitWidth, slitHeight);
  rect(doubleSlitX2 - slitWidth / 2, doubleSlitY - slitHeight / 2, slitWidth, slitHeight);
  fill(255);
  ellipse(hoverX, emissionY, 10, 10);
}

function showWave() {
  hoverX = mouseX;
}

function generateBall() {
  let x = random(0, canvasWidth);
  balls.push(new Ball(x));
}

function clearBall() {

  balls=[]
}

function mouseMoved() {
  showWave();
}


class Ball {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.speed = 5;
    this.stopped = false;
  }

  update() {
    if (!this.stopped) {
      this.y += this.speed;
    }
    if (this.y >= canvasHeight / 5) {
      this.speed = 0;
      this.stopped = true;
    }
   
  }

  display() {
    fill(255, 255, 153);
    ellipse(this.x, this.y, 10, 10);


    let distanceFromLeft = dist(this.x, this.y, hoverX, emissionY);
  let distanceFromRight = dist(this.x, this.y, hoverX, emissionY);
  let phaseLeft = distanceFromLeft * 2 * PI / slitWidth;
  let phaseRight = distanceFromRight * 2 * PI / slitWidth;
  let amplitudeLeft = cos(phaseLeft);
  let amplitudeRight = cos(phaseRight);
  let amplitudeTotal = amplitudeLeft + amplitudeRight;
  this.probability = amplitudeTotal ** 2;

    textSize(10);
    text(this.probability.toFixed(2), this.x + 10, this.y);
  }
}

function mousePressed() {
  for (let i = balls.length - 1; i >= 0; i--) {
    if (balls[i].probability < 0.5 && mouseX >= 0 && mouseX <= canvasWidth && mouseY >= 0 && mouseY <= canvasHeight) {
      balls.splice(i, 1);
    }
  }
}