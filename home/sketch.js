// chreebClient.home
p5.disableFriendlyErrors = true;

let grid,gridWidth,gridHeight;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight,WEBGL);

  grid = [];
  gridWidth = 30;
  gridHeight = 30;
  for (let y = 0; y < gridHeight; y++) {
    let tempRow = [];
    for (let x = 0; x < gridWidth; x++) {
      let tempVal = createVector(x,0,y);
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

  rotateX(radians(57.4));
  rotateZ(radians(45));

  let adj = 20;

  for (let y = 0; y < gridHeight - 1; y++) {
    for (let x = 0; x < gridWidth - 1; x++) {

      beginShape();
      vertex(grid[x][y+1].x*adj,grid[x][y+1].z*adj,0);
      vertex(grid[x][y].x*adj,grid[x][y].z*adj,0);
      vertex(grid[x+1][y].x*adj,grid[x+1][y].z*adj,0);
      vertex(grid[x+1][y+1].x*adj,grid[x+1][y+1].z*adj,0);
      endShape();
    }
  }
}

