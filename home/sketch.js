// chreebClient.home
p5.disableFriendlyErrors = true;

let grid,gridWidth,gridHeight,yChoice;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight,WEBGL);
  smooth();
  grid = [];
  gridWidth = 40;
  gridHeight = 40;
  for (let y = 0; y < gridHeight; y++) {
    let tempRow = [];
    for (let x = 0; x < gridWidth; x++) {
      let tempTile = new Tile(x,y);
      tempRow.push(tempTile);
      /*
      let n = noise(x*0.2,y*0.2);
      let d = map(dist(x,y,0,0),0,40,1,0);
      n = n*d;
      let tempVal = createVector(x,n,y);
      tempRow.push(tempVal);
      */
    }
    grid.push(tempRow);
  }

  yChoice = 0;
}
 
function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
  background(255);
  
  rotateX(radians(75));
  rotateZ(radians(45));
  translate(-50,-250,0);
  strokeWeight(0.7);

  let mainSin = (sin(frameCount/300) + 1) / 2;
  if(mainSin < 0.0003) { yChoice++; }
  if(yChoice > 50) { yChoice = 0; }

  let adj = width / 100;//70;
  let heiAdj = height*0.4;

  for (let y = 0; y < gridHeight - 1; y++) {
    beginShape(QUAD_STRIP);
    for (let x = 0; x < gridWidth - 1; x++) {
      vertex(grid[x][y+1].x*adj,   grid[x][y+1].z*adj,    (grid[x][y+1].y[yChoice] * mainSin)*heiAdj);
      vertex(grid[x][y].x*adj,     grid[x][y].z*adj,      (grid[x][y].y[yChoice] * mainSin)*heiAdj);
      vertex(grid[x+1][y].x*adj,   grid[x+1][y].z*adj,    (grid[x+1][y].y[yChoice] * mainSin)*heiAdj);
      vertex(grid[x+1][y+1].x*adj, grid[x+1][y+1].z*adj,  (grid[x+1][y+1].y[yChoice] * mainSin)*heiAdj);
    }
    endShape();
  }
}

class Tile {
  constructor(x,z) {
    this.x = x;
    this.z = z;

    this.y = [];
    for (let i = 0; i < 50; i++) {
      let n = noise(this.x*0.1 + (i*10),this.z*0.1 + (i*10)) * map(dist(this.x,this.z,0,0),0,40,1,0.1);
      this.y.push(n);
    }
  }
}

// Fill quad strips
// adjust camera (maybe using createGraphic and stretching to the size needed)
