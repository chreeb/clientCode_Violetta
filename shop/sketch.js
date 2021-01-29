// chreebClient.shop -> v1.26/01/21
p5.disableFriendlyErrors = true;
let movers,shapeDetail,numMovers,magSpeed,zLimit;

//1. Setup
function setup() {
  let thisCanvas = createCanvas(window.innerWidth,window.innerHeight,WEBGL);
  thisCanvas.parent('sketch');

  // -----
  resetCamera();
  
  movers = [];
  numMovers = 15;
  magSpeed = 0.5;
  zLimit = 100;
  for (let i = 0; i < numMovers; i++) {
    movers.push(new Mover(magSpeed,zLimit));
  }

 shapeDetail = 20;
}

// 2. Functional functions & Classes
function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
  resetCamera();
}

function resetCamera() {
  ortho();
  ortho.far = 500;
}

function getRandom(min,max) {
  return Math.random() * (max - min) + min;
}

class BoolVector {
  constructor() {
    this.x,this.y,this.z;

    if (Math.floor(getRandom(2))) { this.x = true; } else { this.x = false; }
    if (Math.floor(getRandom(2))) { this.y = true; } else { this.y = false; }
    if (Math.floor(getRandom(2))) { this.z = true; } else { this.z = false; }
  }
}

// 3. Global Draw
function draw() {
  background(0,0,0,0);
  stroke(50);

  let gravTrue = 0;
  movers.forEach((object) => {
    push();
    object.moveAwayCheck(movers);
    object.update();
    object.draw();
    pop();

    if (object.isCenterGravity) { gravTrue++; }
  });

  if (gravTrue > numMovers * 0.8) {
    movers.forEach((object) => {
        if (getRandom() < 0.5) { object.isCenterGravity = false; }
      });
  }
}

// 4. SubMover (spheres which orbit a main sphere)
class SubMover {
  constructor(isCenter,centerSize) {
    this.isCenter = isCenter;

    this.size = getRandom(0.01,0.03);
    this.rotation = createVector(getRandom(-90,90),getRandom(-90,90));
    this.position = createVector(0,0,0);
    this.boolVector = new BoolVector();

    this.centerSize;
    if (!this.isCenter) { 
      this.size = getRandom(0.01,centerSize);
      this.centerSize = centerSize;
      this.updatePosition(); 
    }
  }

  update() {
    this.rotation.x += 0.001;
    this.rotation.y += 0.001;
  }

  updatePosition() {
    let midSize = (this.centerSize/20) - this.size/2;
    if (this.boolVector.x) { this.position.x = ((height + width) * midSize); }
    if (!this.boolVector.x) { this.position.x = -((height + width) * midSize); }

    if (this.boolVector.y) { this.position.y = ((height + width) * midSize); }
    if (!this.boolVector.y) { this.position.y = -((height + width) * midSize); }

    if (this.boolVector.z) { this.position.z = ((height + width) * midSize); }
    if (!this.boolVector.z) { this.position.z = -((height + width) * midSize); }
  }

  getSize() {
    return (height + width) * this.size;
  }
}

// 5. Mover (spheres, torus & main orbiting spheres)
class Mover {
  constructor(magSpeed,zLimit) {
    this.zLimit = zLimit;
    
    let x = getRandom(-width/2,width/2);
    let y = getRandom(-height/2,height/2);
    let z = getRandom(-this.zLimit,this.zLimit);
    let magX = getRandom(-magSpeed,magSpeed);
    let magY = getRandom(-magSpeed,magSpeed);
    let magZ = getRandom(-magSpeed,magSpeed);
    
    this.rotSpeed;
    this.maxMagnitude = 2;

    this.position = createVector(x,y,z);
    this.rotation = createVector(getRandom(-180,180),getRandom(-180,180));
    this.magnitude = createVector(magX,magY,magZ);

    this.distanceFromMiddle;
    this.maxDistance;

    this.isCenterGravity = false;
    this.gravityTimer = 0;

    this.towardsCenterMag;
    
    this.moveAwayVec = createVector(0,0,0);
    this.numNeighbors;

    this.type = 0;
    this.randomType = getRandom(0,100);
    if (this.randomType < 30) { this.type = 0; }
    else if (this.randomType < 60) { this.type = 1; }
    else { this.type = 2; }

    this.size = getRandom(0.01,0.03);

    if (this.type == 0) {
      this.subMoverArr = [];
      for (let i = 0; i < getRandom(2,4); i++) {
        if (i == 0) { this.subMoverArr.push(new SubMover(true,0)); }
        else { this.subMoverArr.push(new SubMover(false,this.subMoverArr[0].size)); }
      }
    }
  }
  
  checkEdges() {
    if (this.position.x < -width/2 || this.position.x > width/2) { this.magnitude.x = -this.magnitude.x; }
    if (this.position.y < -height/2 || this.position.y > height/2) { this.magnitude.y = -this.magnitude.y; }
    if (this.position.z < -this.zLimit || this.position.z > this.zLimit) { this.magnitude.z = -this.magnitude.z; }
  }

  updateMiddleDistance() {
    this.distanceFromMiddle = dist(this.position.x,this.position.y,0,0);

    if (width > height) { this.maxDistance = width / 2 } else { this.maxDistance = height / 2; }

    stroke(map(this.distanceFromMiddle,0,this.maxDistance,0,150));
  }

  updateCenterGravity() {
    if (!this.isCenterGravity && this.gravityTimer <= 0) {
      if (getRandom() < 0.0003) { 
          this.isCenterGravity = true;
          this.gravityTimer = getRandom(1000,10000);
      }
    }

    if (this.isCenterGravity) {
      towardsCenterMag = p5.Vector.sub(createVector(0,0),this.position);
      towardsCenterMag.div(width * 5);
      this.magnitude.add(towardsCenterMag);
      this.gravityTimer--;
    }
  }

  moveAwayCheck(moversArr) {
    this.moveAwayVec.set(0,0,0);
    this.numNeighbors = 0;
    moversArr.forEach((other) => {
      if (other === this) { return; }
      
      let distance = dist(this.position.x,
                          this.position.y,
                          this.position.z,
                          other.position.x,
                          other.position.y,
                          other.position.z);
      
      if (distance < (height+width) * this.size * 3) {
        this.numNeighbors++;
        this.moveAwayVec.add(other.position);
      }
    });
    
    if (this.numNeighbors != 0) {
      this.moveAwayVec.div(this.numNeighbors);
  
      this.moveAwayVec = p5.Vector.sub(this.moveAwayVec,this.position);
      this.moveAwayVec.div(width * 2);
      this.magnitude.sub(this.moveAwayVec);
    }
  }

  update() {
    this.checkEdges()
    this.updateMiddleDistance();
    this.updateCenterGravity();

    this.magnitude.limit(this.maxMagnitude);

    this.rotation.x += this.magnitude.mag() / 2;
    this.rotation.y += this.magnitude.mag() / 2;

    this.position.add(this.magnitude);
  }

  getSize() {
    return (height + width) * this.size;
  }

  draw() {
    push();
    translate(this.position);
    rotateX(radians(this.rotation.x));
    rotateZ(radians(this.rotation.y));
    switch (this.type) {
      case 0:
        this.drawSubMovers();
        break;
      case 1:
        sphere(this.getSize(),shapeDetail,shapeDetail);
        break;
      case 2:
        torus(this.getSize(),shapeDetail,shapeDetail);
        break;
    }
    pop();
  }

  drawSubMovers() {
    sphere(this.subMoverArr[0].getSize(),shapeDetail,shapeDetail);
      push();
      this.subMoverArr.forEach((subMover,index) => {
        if (index == 0) { return; }
        subMover.update();
        push();
        rotateX(subMover.rotation.x);
        rotateY(subMover.rotation.y);
        translate(subMover.position);
        sphere(subMover.getSize(),shapeDetail,shapeDetail);
        pop();
      });
      pop();
  }
}