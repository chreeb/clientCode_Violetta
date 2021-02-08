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
        let n = noise(tempTile.x*0.1 + (i*10),tempTile.z*0.1 + (i*10));
        n *= map(dist(x,y,gridWid,gridHei),0,gridWid,0,1);
        tempTile.y.push(n);
      }

      tempRow.push(tempTile);
    }
    grid.push(tempRow);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
  background(0,0,0,0);

  let size = (height/width) * 100;

  let heiMod = (Math.sin(frameCount/300) + 1) / 2;
  if (heiMod < 0.0001) { currentHeiChoice++; }
  if (currentHeiChoice >= numHeiChoices) { currentHeiChoice = 0; }
  let col;

  translate(0,height*0.3,0);
  rotateX(radians(70));
  rotateZ(radians(45));
  translate(-(size * (gridWid-1))*0.6,-(size * (gridHei-1))*0.6,0);

  strokeWeight(0.7);
  for (let y = 0; y < gridHei - 1; y++) {
    col = map(y,0,gridHei-1,200,255);
    fill(col);
    stroke(col-120);
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < gridWid; x++) {
      vertex(grid[x][y].x*size,
             grid[x][y].z*size,
             (grid[x][y].y[currentHeiChoice]*heiMod) * size*10);

      vertex(grid[x][y+1].x*size,
             grid[x][y+1].z*size,
             (grid[x][y+1].y[currentHeiChoice]*heiMod) * size*10);
    }
    endShape();
  }
}