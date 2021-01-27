let movers = [];

// HELLO THIS IS MY NAME

let numMovers;
function setup() {
  createCanvas(window.innerWidth,window.innerHeight,WEBGL);
  
  ortho();
  
  numMovers = 20;
  let magSpeed = 0.5;
  let zLimit = 100;
  for (let i = 0; i < numMovers; i++) {
    movers.push(new Mover(magSpeed,zLimit));
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
  background(220);
  
  stroke(50);
  strokeWeight(0.7);

  let gravTrue = 0;
  movers.forEach((object) => {
    push();
    object.update();
    object.draw();
    pop();

    if (object.isCenterGravity) { gravTrue++; }
  });

  if (gravTrue > numMovers * 0.8) {
    movers.forEach((object) => {
        if (random() < 0.5) { object.isCenterGravity = false; }
      });
  }

  console.log(`${gravTrue} / ${numMovers}`);
}

class Mover {
  constructor(magSpeed,zLimit) {
    this.zLimit = zLimit;
    
    let x = random(-width/2,width/2);
    let y = random(-height/2,height/2);
    let z = random(-this.zLimit,this.zLimit);
    let magX = random(-magSpeed,magSpeed);
    let magY = random(-magSpeed,magSpeed);
    let magZ = random(-magSpeed,magSpeed);
    
    this.rotSpeed;
    this.maxMagnitude = 2;

    this.position = createVector(x,y,z);
    this.rotation = createVector(random(-180,180),random(-180,180));
    this.magnitude = createVector(magX,magY,magZ);

    this.size = random(0.01,0.03);
    this.shape = Math.floor(random(2));

    this.isCenterGravity = false;
    this.gravityTimer = 0;
  }
  
  checkEdges() {
    if (this.position.x < -width/2 || this.position.x > width/2) { this.magnitude.x = -this.magnitude.x; }
    if (this.position.y < -height/2 || this.position.y > height/2) { this.magnitude.y = -this.magnitude.y; }
    if (this.position.z < -this.zLimit || this.position.z > this.zLimit) { this.magnitude.z = -this.magnitude.z; } 
  }

  update() {
    this.checkEdges();
    
    let distanceFromMiddle = dist(this.position.x,this.position.y,0,0);
    let maxDistance;

    if (width > height) { maxDistance = width / 2 } else { maxDistance = height / 2; }

    stroke(map(distanceFromMiddle,0,maxDistance,0,150));

    if (!this.isCenterGravity && this.gravityTimer <= 0) {
        if (random() < 0.0003) { 
            this.isCenterGravity = true;
            this.gravityTimer = random(1000,10000);
        }
    }

    if (this.isCenterGravity) {
        let towardsCenterMag = p5.Vector.sub(createVector(0,0),this.position);
        towardsCenterMag.div(width * 15);
        this.magnitude.add(towardsCenterMag);
        this.gravityTimer--;
    }
    
    this.magnitude.limit(this.maxMagnitude);

    this.rotation.x += this.magnitude.mag();
    this.rotation.y += this.magnitude.mag();

    //this.magnitude.sub(0,-0.01); // Drop Down Random
    this.position.add(this.magnitude);
  }
  
  draw() {
    push();
    translate(this.position);
    let size = (height + width) * this.size;
    rotateX(radians(this.rotation.x));
    rotateZ(radians(this.rotation.y));
    if (this.shape) { sphere(size); } else { torus(size); }
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