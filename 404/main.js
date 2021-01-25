let y,z,speed,numVertex,numWaves,waveStepAmt,numStreams,streamStepAmt,minHeight,heightSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  y = 0;
  z = 0;
  speed = 0.003;
  numVertex = 20;
  numWaves = 20;
  waveStepAmt = 0.02;
  numStreams = 5;
  streamsStepAmt = 5;
}

function draw() {
  background(255);
  noFill();

  minHeight = height * 0.1;
  heightSize = height * 0.7;
  let heightAdj = height * 0.1;
  strokeWeight(0.5);

  for (let streams = 0; streams < numStreams; streams++) {
    let s = map(streams,0,numStreams,0,150);
    for (let waves = 0; waves < numWaves; waves++) {
      stroke(s);
      beginShape();
      for (let x = 0; x < width; x+=numVertex) {
      let nx = (x * 0.001) + streams;
      let ny = z + (waves * waveStepAmt);
      y = (-noise(nx,ny) * heightSize) + height - (heightAdj * streams);
      vertex(x,y);
      }
      endShape();
    }
  }

  z+=speed;
}

function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
}

class Stream {
  constructor() {
    this.arr = [];
    
    let numWaves = 10;
    for (let i = 0; i < numWaves; i++) {
      this.arr.push(0);
    }

    
  }
}