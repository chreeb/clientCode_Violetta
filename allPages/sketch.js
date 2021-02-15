let baseLineArr,lineArr;
let numVerts,numLines,hei,noi;

p5.disableFriendlyErrors = true;

function setup() {
  let thisCanvas = createCanvas(window.innerWidth,window.innerHeight,WEBGL);
  thisCanvas.parent('sketch');
  resetCamera();

  lineArr = [];
  numVerts = 30;
  numLines = 100;
  startSize = 100;

  for (let line = 0; line < numLines; line++) {
    let tempLine = [];

    tempLine.push([noise(line*0.1 + 24),noise(line*0.08)]);

    let noiseSize = 0.05;
    for (let vert = 0; vert < numVerts; vert++) {
      if (noise(line*noiseSize,vert*noiseSize) < 0.4) { tempLine.push(0.5); }
      else { tempLine.push(noise(line*0.1,vert*0.3)); }
    }

    lineArr.push(tempLine);
  }
}

function resetCamera() {
  ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 10000);
}
function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
  resetCamera();
}


function draw() {
  clear();
  rotateX(radians(75));
  rotateX(radians(54.7));
  rotateZ(radians(45));

  let vert = 0;

  let adj;
  if (width < height) { adj = height; }
  else { adj = width; }

  let translateSize = adj / 10;
  let flatLineSize = adj / 10;
  let vertSize = adj / 120;
  let vertHeight = adj / 15;

  translate(-numLines * 5,
            (translateSize + flatLineSize + (numVerts * vertSize)) / 2,
            0);

  for (let line = 0; line < numLines; line++) {
    push();

    translate(line*10,-lineArr[line][vert][0] * translateSize,0);


    beginShape();
    vertex(0,0,0);
    vertex(0,-lineArr[line][vert][1] * flatLineSize,0);
    endShape();

    translate(0,-lineArr[line][vert][1] * flatLineSize,0);

    fill(0,0,0,0);
    beginShape();
    vertex(0,0,0);
    noi = noise(frameCount/100 + line*0.1) + 0.25;
    for (let vert = 1; vert < numVerts; vert++) {
      hei = (lineArr[line][vert]-0.5);
      vertex(0,-vert*vertSize,(hei*vertHeight)*noi);
    }
    vertex(0,-numVerts * vertSize,0);
    endShape();

    translate(0,-numVerts * vertSize,0);
    beginShape();
    vertex(0,0,0);
    vertex(0,-lineArr[line][vert][1] * flatLineSize,0);
    endShape();
    pop();
  }
}