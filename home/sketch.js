// chreebClient.home
p5.disableFriendlyErrors = true;

let grid,gridWid,gridHei,numHeiChoices,currentHeiChoice,z1,z2;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight,WEBGL);
  smooth();
  noiseSeed(10);
  
  gridWid = 36;
  gridHei = 36;
  numHeiChoices = 10;
  currentHeiChoice = 0;
  grid = [];

  for (let y = 0; y < gridHei; y++) {
    let tempRow = [];
    for (let x = 0; x < gridWid; x++) {
      let tempTile = {
        x:x,
        y:[],
        z:y
      }

      for (let i = 0; i < numHeiChoices; i++) {
        let n = [];
        for (let j = 0; j < 3; j++) {
          if (x == 0 || y == 0 || x == gridWid-1 || y == gridHei-1) { n.push(0); }
          else { n.push(getRandHei(tempTile,i,x,y,(i+j) * 1000)); }
        }
        tempTile.y.push(n);
      }

      tempRow.push(tempTile);
    }
    grid.push(tempRow);
  }
}

function getRandHei(obj,iter,x,y,adj) {
  let n = noise(obj.x*0.15 + (iter*10) + adj,obj.z*0.15 + (iter*10) + adj) * map(dist(x,y,gridWid,gridHei),0,gridWid,0,1);
  n - n * 0.5;
  return n;
}

function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
  background(0,0,0,0);

  let size = (height/width) * 120;

  let minHeightLimit = 0.2;
  let speed = 300;

  let heiOne = (Math.sin(frameCount/speed) + 1) / 2;
  let heiTwo = (Math.sin(180 + frameCount/speed) + 1) / 2;

  if (heiOne < minHeightLimit) {  }
  translate(0,height*0.3,0);
  rotateX(radians(70));
  rotateZ(radians(45));
  translate(-(size * (gridWid-1))*0.6,-(size * (gridHei-1))*0.6,-500);

  stroke(30);
  strokeWeight(0.7);
  for (let y = 0; y < gridHei - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    fill(map(y,0,gridHei-1,150,255));
    for (let x = 0; x < gridWid; x++) {
      z1 = (grid[x][y].y[currentHeiChoice][0]*heiOne +
            grid[x][y].y[currentHeiChoice][1]*heiTwo) * 0.8;
      if (z1 < minHeightLimit) { z1 = minHeightLimit; }
      
      z2 = (grid[x][y+1].y[currentHeiChoice][0]*heiOne +
              grid[x][y+1].y[currentHeiChoice][1]*heiTwo) * 0.8;
      if (z2 < minHeightLimit) { z2 = minHeightLimit; }

      vertex(grid[x][y].x*size,
             grid[x][y].z*size,
             (z1) * size*10);

      vertex(grid[x][y+1].x*size,
             grid[x][y+1].z*size,
             (z2) * size*10);
    }
    endShape();
  }
}