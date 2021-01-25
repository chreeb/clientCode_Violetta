let movers = [];

function setup() {
  createCanvas(window.innerWidth,window.innerHeight,WEBGL);
  
  ortho();
  
  let numMovers = 10;
  let minSize = 30;
  let maxSize = 60;
  let magSpeed = 0.5;
  let rotSpeed = 90;
  let zLimit = 100;
  for (let i = 0; i < numMovers; i++) {
    movers.push(new Mover(minSize,maxSize,magSpeed,rotSpeed,zLimit));
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
  background(220);
  
  stroke(50);
  strokeWeight(0.7);

  movers.forEach((object) => {
    push();
    object.update();
    object.draw();
    pop();
  });
}

class SubMover {
  constructor() {
    let xLimit = 100;
    let yLimit = 100;
    let zLimit = 50;

    this.position = createVector(random(-xLimit,xLimit),random(-yLimit,yLimit),random(-zLimit,zLimit));
    this.rotation = createVector(random(-1,1),random(-1,1));
    this.magnitude = createVector(random(-1,1),random(-1,1));
    this.sizeMod = random(0.02,0.06);
    this.isSphere;
    if (random(1) < 0.5) { this.isSphere = true; } else { this.isSphere = false; }

    this.isCenterGravity = true;
  }

  update(arr) {
    let isOutsideOfLimits = false;
    let limit = 25;
    if (this.position.x > limit || this.position.x < -limit) { isOutsideOfLimits = true; }
    if (this.position.y > limit || this.position.y < -limit) { isOutsideOfLimits = true; }

    if (isOutsideOfLimits) {
      if (this.isCenterGravity) {
        let towardsCenterMag = p5.Vector.sub(createVector(0,0),this.position);
        towardsCenterMag.div(width/2);
        this.magnitude.add(towardsCenterMag);
        this.magnitude.limit(2);
        this.magnitude.div(2);
      }
    }

    this.magnitude.limit(0.5);
    this.position.add(this.magnitude);
  }

  draw() {
    push();
    translate(this.position);
    rotateX(frameCount/90 + this.rotation.x);
    rotateZ(frameCount/90 + this.rotation.y);
    if (this.isSphere) { sphere(width*this.sizeMod*0.7); } else { torus(width*this.sizeMod); }
    pop();
  }
}

class Mover {
  constructor(minSize,maxSize,magSpeed,rotSpeed,zLimit) {
    this.zLimit = zLimit;
    
    let x = random(-width/2,width/2);
    let y = random(-height/2,height/2);
    let z = random(-this.zLimit,this.zLimit);
    let magX = random(-magSpeed,magSpeed);
    let magY = random(-magSpeed,magSpeed);
    let magZ = random(-magSpeed,magSpeed);
    let rotX = random(-1,1);
    let rotY = random(-1,1);
    
    this.rotSpeed = rotSpeed
    
    this.position = createVector(x,y,z);
    this.rotation = createVector(rotX,rotY);
    this.magnitude = createVector(magX,magY,magZ);

    this.randColor = color(random(100,255),random(100,255),random(100,255));
    this.subMoverArr = [];

    for (let i = 0; i < Math.floor(random(2,5)); i++) {
      this.subMoverArr.push(new SubMover());
    }

    this.isCenterGravity = true;
  }
  
  distanceFromMiddle() {
    let middleDistance = dist(this.position.x,this.position.y,0,0);
    let maxDist;
    if (width > height) { maxDist = width / 2; }
    else { maxDist = height / 2; }
    
    let s = map(middleDistance,0,maxDist,0,150);
    stroke(s);
  }
  
  checkEdges() {
    if (this.position.x < -width/2 || this.position.x > width/2) { this.magnitude.x = -this.magnitude.x; }
    if (this.position.y < -height/2 || this.position.y > height/2) { this.magnitude.y = -this.magnitude.y; }
    if (this.position.z < -this.zLimit || this.position.z > this.zLimit) { this.magnitude.z = -this.magnitude.z; } 
  }

  update() {
    this.checkEdges();
    this.distanceFromMiddle();
    
    if (Math.random() < 0.01) { this.isCenterGravity = !this.isCenterGravity; }
    if (this.isCenterGravity) {
      let towardsCenterMag = p5.Vector.sub(createVector(0,0),this.position);
      towardsCenterMag.div(width * 10);
      this.magnitude.add(towardsCenterMag);
    }
    
    this.magnitude.limit(3);
    this.position.add(this.magnitude);
  }
  
  draw() {
    push();
    translate(this.position);
    //fill(this.randColor);
    this.subMoverArr.forEach((subMover) => {
      push();
      subMover.update(this.subMoverArr);
      subMover.draw();
      pop();
    });
    pop();
  }
}












/*
class Mover {
  constructor(minSize,maxSize,magSpeed,rotSpeed,zLimit) {
    this.isCenterGravity = true;

    this.zLimit = zLimit;
    
    let x = random(-width/2,width/2);
    let y = random(-height/2,height/2);
    let z = random(-this.zLimit,this.zLimit);
    let magX = random(-magSpeed,magSpeed);
    let magY = random(-magSpeed,magSpeed);
    let magZ = random(-magSpeed,magSpeed);
    let rotX = random(-1,1);
    let rotY = random(-1,1);
    
    this.rotSpeed = rotSpeed
    
    this.position = createVector(x,y,z);
    this.rotation = createVector(rotX,rotY);
    this.magnitude = createVector(magX,magY,magZ);
    this.size = random(minSize,maxSize);
    
    this.isSphere = 0;
    if (random(1) < 0.5) { this.isSphere = true; }
    else { this.isSphere = false; }
  }
  
  distanceFromMiddle() {
    let middleDistance = dist(this.position.x,this.position.y,0,0);
    let maxDist;
    if (width > height) { maxDist = width / 2; }
    else { maxDist = height / 2; }
    
    let s = map(middleDistance,0,maxDist,0,150);
    stroke(s);
  }
  
  checkEdges() {
    if (this.position.x < -width/2 || this.position.x > width/2) { this.magnitude.x = -this.magnitude.x; }
    if (this.position.y < -height/2 || this.position.y > height/2) { this.magnitude.y = -this.magnitude.y; }
    if (this.position.z < -this.zLimit || this.position.z > this.zLimit) { this.magnitude.z = -this.magnitude.z; } 
  }
  
  checkNeighbors(arr) {
    let neighborArr = [];

    for (let other of arr) {
      if (other == this) { continue; }

      if (dist(this.position.x,this.position.y,other.position.x,other.position.y) < 50) {
        neighborArr.push(other);
      }
    }

    let moveTowardsVec = createVector(0,0);
    if (neighborArr.length != 0) {
      var avgPos = createVector(0,0);

      neighborArr.forEach((other) => {
        avgPos.add(other.position);
      });

      avgPos.div(neighborArr.length);
      moveTowardsVec = p5.Vector.sub(avgPos,this.position);
      moveTowardsVec.normalize();

      moveTowardsVec.limit(0.01);
      this.magnitude.add(moveTowardsVec);
    }

    if (Math.random() < 0.01) { this.isCenterGravity = !this.isCenterGravity; }
    if (this.isCenterGravity) {
      let towardsCenterMag = p5.Vector.sub(createVector(0,0),this.position);
      towardsCenterMag.div(width * 10);
      this.magnitude.add(towardsCenterMag);
      this.magnitude.limit(5);
    }

  }

  update() {
    this.position.add(this.magnitude);
    this.checkEdges();
    this.distanceFromMiddle();
    
    
  }
  
  draw() {
    push();
    translate(this.position.x,this.position.y,this.position.z);
    rotateX(frameCount/this.rotSpeed + this.rotation.x);
    rotateZ(frameCount/this.rotSpeed + this.rotation.y);
    if (this.isSphere) { sphere(this.size); }
    else { torus(this.size,this.size/4); }
    pop;
  }
}
*/