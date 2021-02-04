// chreebClient.home
p5.disableFriendlyErrors = true;

let grid,gridWidth,gridHeight;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight,WEBGL);

  grid = [];
  gridWidth = 40;
  gridHeight = 40;
  for (let y = 0; y < gridHeight; y++) {
    let tempRow = [];
    for (let x = 0; x < gridWidth; x++) {
      let n = noise(x*0.2,y*0.2);
      let tempVal = createVector(x,n,y);
      tempRow.push(tempVal);
    }
    grid.push(tempRow);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
  background(255);

  rotateX(radians(60));
  rotateZ(radians(45));

  let mainSin = (sin(frameCount/20) + 1) / 2;

  let adj = width / 50;
  let heiAdj = height*0.2;

  for (let y = 0; y < gridHeight - 1; y++) {
    beginShape(QUAD_STRIP);
    for (let x = 0; x < gridWidth - 1; x++) {
      vertex(grid[x][y+1].x*adj,   grid[x][y+1].z*adj,    (grid[x][y+1].y * mainSin)*heiAdj);
      vertex(grid[x][y].x*adj,     grid[x][y].z*adj,      (grid[x][y].y * mainSin)*heiAdj);
      vertex(grid[x+1][y].x*adj,   grid[x+1][y].z*adj,    (grid[x+1][y].y * mainSin)*heiAdj);
      vertex(grid[x+1][y+1].x*adj, grid[x+1][y+1].z*adj,  (grid[x+1][y+1].y * mainSin)*heiAdj);
    }
    endShape();
  }
}

// Fill quad strips
// adjust camera (maybe using createGraphic and stretching to the size needed)
