let y,z,speed,stepAmt,numWaves,waveStepAmt,numStreams,streamStepAmt,minHeight,heightSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  y = 0;
  z = 0;
  speed = 0.003;
  stepAmt = 20;
  numWaves = 20;
  waveStepAmt = 0.02;
  numStreams = 3;
  streamsStepAmt = 5;
}

function draw() {
  background(255);
  noFill();

  minHeight = height * 0.1;
  heightSize = height * 0.7;
  let heightAdj = height * 0.15;
  strokeWeight(0.5);

  for (let streams = 0; streams < numStreams; streams++) {
    let s = map(streams,0,numStreams,0,150);
    for (let waves = 0; waves < numWaves; waves++) {
      stroke(s);
      beginShape();
      for (let x = 0; x < width; x+=stepAmt) {
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