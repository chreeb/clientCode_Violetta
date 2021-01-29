p5.disableFriendlyErrors = true;

let y,z,speed,numVertex,numWaves,waveStepAmt,numStreams,streamStepAmt,minHeight,heightSize;
let heightBetweenWaves,heightAdj,strokeArr,vertexFrameAdj,framerate;

function setup() {
  let thisCanvas = createCanvas(window.innerWidth,window.innerHeight);
  thisCanvas.parent('sketch');

  y = 0;
  z = 0;
  speed = 0.001;
  numWaves = 20;
  waveStepAmt = 0.015;
  numStreams = 4;
  streamsStepAmt = 5;
  vertexFrameAdj = 80;
  
  strokeArr = [];
  for (let i = 0; i < numStreams; i++) {
    strokeArr.push(map(i,0,numStreams,0,150));
  }
  
  resetValues();
}

function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
  resetValues();
}

function resetValues() {
  numVertex = Math.floor(width / vertexFrameAdj);
  heightBetweenWaves = height * 0.003;
  minHeight = height * 0.1;
  heightSize = height * 0.9;
  heightAdj = height * 0.05;
}

function draw() {
  background(0,0,0,0);
  clear();
  noFill();

  framerate = int(getFrameRate());
  if (framerate < 40 && vertexFrameAdj > 10) {
    vertexFrameAdj-=1;
    numVertex = Math.floor(width / vertexFrameAdj);
  }

  translate(0,height*0.2);

  strokeWeight(0.5);

  for (let streams = 0; streams < numStreams; streams++) {
    stroke(strokeArr[streams]);
    for (let waves = 0; waves < numWaves; waves++) {
      beginShape();
      for (let x = 0; x < width + (width*0.1); x+=numVertex) {
        y = ((-(noise((x * 0.001) + streams,z + (waves * waveStepAmt) * 1.5) + (sin((frameCount*0.003) + (x*0.003) + (streams*0.7)) + 1) / 2) / 2 * heightSize) + height - (heightAdj * streams)) + (waves * heightBetweenWaves) * 2;
        
        vertex(x,y);
      }
      endShape();
    }
  }

  z+=speed;
}