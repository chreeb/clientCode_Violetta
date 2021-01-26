function setup() {
  createCanvas(window.innerWidth,window.innerHeight,WEBGL);
  //ortho();
}

function windowResized() {
  resizeCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
  background(255);

  rotateX(radians(40));
  rotateZ(radians(50));

  translate(-height*0.3,width*0.3,0);

  let numLines = 50;
  let lineLength = width*0.7;
  for (let line = 0; line < numLines; line++) {
    push();
    beginShape();
    vertex(line*10,50,0); // First Point
    for (let wid = 0; wid < lineLength; wid += 50) {
      let nx = (wid * 100) + frameCount/500;
      let ny = line * 0.1;

      if (line < numLines * 0.1 || line > numLines * 0.9) {
        hei = 0;
      } else {
        hei = noise(nx,ny) * 200;
        
        // Horizonal Slope Cutoff
        if (wid < lineLength * 0.3) { hei *= map(wid,0,lineLength * 0.3,0,1); }
        else if (wid > lineLength * 0.7) { hei *= map(wid,lineLength*0.7,lineLength,1,0); }
        
        // Vertical Slope Cutoff
        if (line < numLines * 0.4) { hei *= map(line,0,numLines * 0.4,0,1); }
        else if (line > numLines * 0.6) { hei *= map(line,numLines * 0.6, numLines,1,0); }
      }

      vertex(line * 10,-wid,hei);
    }
    vertex(line*10,(-lineLength)-50,0);
    endShape(CLOSE);
    pop();
  }

}