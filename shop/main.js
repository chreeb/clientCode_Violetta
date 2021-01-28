let movers = [];
let sphereDetail;

let numMovers;
function setup() {
  createCanvas(window.innerWidth,window.innerHeight,WEBGL);
  
  ortho();
  ortho().far = 500;
  //ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
  
  numMovers = 20;
  let magSpeed = 0.5;
  let zLimit = 100;
  for (let i = 0; i < numMovers; i++) {
    movers.push(new Mover(magSpeed,zLimit));
  }

  sphereDetail = 20;
}

function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
  background(220);
  
  stroke(50);

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

  //console.log(`${gravTrue} / ${numMovers}`);
}

class BoolVector {
  constructor() {
    this.x,this.y,this.z;

    if (Math.floor(random(2))) { this.x = true; } else { this.x = false; }
    if (Math.floor(random(2))) { this.y = true; } else { this.y = false; }
    if (Math.floor(random(2))) { this.z = true; } else { this.z = false; }
  }
}
// ------------------------------------------------------------------------------------
class SubMover {
  constructor(isCenter,centerSize) {
    this.isCenter = isCenter;

    this.size = random(0.01,0.03);
    this.rotation = createVector(random(-90,90),random(-90,90));
    this.position = createVector(0,0,0);
    this.boolVector = new BoolVector();

    this.centerSize;
    if (!this.isCenter) { 
      this.size = random(0.01,centerSize);
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

    this.isCenterGravity = false;
    this.gravityTimer = 0;

    this.type = 0;
    this.randomType = random(100);
    if (this.randomType < 30) { this.type = 0; }
    else if (this.randomType < 60) { this.type = 1; }
    else { this.type = 2; }

    this.size = random(0.01,0.03);

    if (this.type == 0) {
      this.subMoverArr = [];
      for (let i = 0; i < random(2,4); i++) {
        if (i == 0) { this.subMoverArr.push(new SubMover(true,0)); }
        else { this.subMoverArr.push(new SubMover(false,this.subMoverArr[0].size)); }
      }
    }
  }

  updateSubMoverPositions() {

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

    this.rotation.x += this.magnitude.mag() / 2;
    this.rotation.y += this.magnitude.mag() / 2;

    //this.magnitude.sub(0,-0.01); // Drop Down Random
    this.position.add(this.magnitude);

    // ----------------------------------------------------------

    fill(map(this.position.x,-width/2,width/2,0,255));
    stroke(map(this.position.y,-height/2,height/2,0,255));

    //hi
  }
  
  draw() {

    push();
    translate(this.position);
    rotateX(radians(this.rotation.x));
    rotateZ(radians(this.rotation.y));
    if (this.type == 0) {
      sphere(this.subMoverArr[0].getSize(),sphereDetail,sphereDetail);
      push();
      this.subMoverArr.forEach((subMover,index) => {
        if (index == 0) { return; }
        subMover.update();
        push();
        rotateX(subMover.rotation.x);
        rotateY(subMover.rotation.y);
        translate(subMover.position);
        sphere(subMover.getSize(),sphereDetail,sphereDetail);
        pop();
      });
      pop();
    } else {
      push();
      let size = (height + width) * this.size;
      if (this.type == 1) { sphere(size,sphereDetail,sphereDetail); } 
      else if (this.type == 2) { torus(size,sphereDetail,sphereDetail); }
      pop();
    }
    pop();
  }
}