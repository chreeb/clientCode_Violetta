// chreebClient.home
p5.disableFriendlyErrors = true;

let grid,gridWid,gridHei,numHeiChoices,currentHeiChoice;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight,WEBGL);
  smooth();
  
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
          n.push(getRandHei(tempTile,i,x,y,i+j));
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
  return n;
}

function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
  background(0,0,0,0);

  let size = (height/width) * 100;

  let minHeightLimit = 0.1;

  let heiMod = (Math.sin(frameCount/300) + 1) / 2;
  if (heiMod < 0.0001) { currentHeiChoice++; }
  if (currentHeiChoice >= numHeiChoices) { currentHeiChoice = 0; }
  currentHeiChoice = 0;

  let heiOne = (Math.sin(frameCount/300) + 1) / 2;
  let heiTwo = (Math.sin(180 + frameCount/300) + 1) / 2;

  translate(0,height*0.3,0);
  rotateX(radians(70));
  rotateZ(radians(45));
  translate(-(size * (gridWid-1))*0.6,-(size * (gridHei-1))*0.6,0);

  stroke(30);
  strokeWeight(0.7);
  for (let y = 0; y < gridHei - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    fill(map(y,0,gridHei-1,150,255));
    for (let x = 0; x < gridWid; x++) {

      let h1 = grid[x][y].y[currentHeiChoice][0]*heiOne;
      let h2 = grid[x][y].y[currentHeiChoice][1]*heiTwo;
      let n = (h1 + h2) / 2;
      if (n < minHeightLimit) { n = minHeightLimit; }

      vertex(grid[x][y].x*size,
             grid[x][y].z*size,
             (n) * size*10);
      
      h1 = grid[x][y+1].y[currentHeiChoice][0]*heiOne;
      h2 = grid[x][y+1].y[currentHeiChoice][1]*heiTwo;
      n = (h1 + h2) / 2;
      if (n < minHeightLimit) { n = minHeightLimit; }

      vertex(grid[x][y+1].x*size,
             grid[x][y+1].z*size,
             (n) * size*10);
    }
    endShape();
  }
}