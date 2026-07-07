const WARPS = 36;
const WEFTS = 196;

// spacing between threads
let cell = 22;

let offsetX = 160;
let offsetY = 100;

let draft = [];

let warpColors = [];
let weftColors = [];

let selectedType = "weft";
let selectedIndex = 0;

let picker;

function setup() {
  createCanvas(offsetX + WARPS * cell + 100, offsetY + WEFTS * cell + 100);

  // create weave draft

  for (let y = 0; y < WEFTS; y++) {
    draft[y] = [];

    for (let x = 0; x < WARPS; x++) {
      // random starting weave

      draft[y][x] = random() > 0.5;
    }
  }

  // all warp threads black

  for (let i = 0; i < WARPS; i++) {
    warpColors[i] = color("#000000");
  }

  // weft palette

  let palette = [
    "#960019",
    "#ff78f1",
    "#c300ff",
    "#ffffff",
    "#ffee00",
    "#06d6ba",
  ];

  for (let i = 0; i < WEFTS; i++) {
    weftColors[i] = color(palette[i % palette.length]);
  }

  picker = createColorPicker("#ff78f1");

  picker.position(20, 40);

  picker.input(updateColor);

  createP("Selected thread").position(20, 0);
}

function draw() {
  background(245);

  drawThreadColors();

  drawWeave();

  fill(0);
  noStroke();

  text("Selected: " + selectedType + " " + selectedIndex, 20, 110);
}

function drawThreadColors() {
  // warp colors

  for (let x = 0; x < WARPS; x++) {
    noStroke();

    fill(warpColors[x]);

    rect(offsetX + x * cell, offsetY - 25, cell, 25);
  }

  // weft colors

  for (let y = 0; y < WEFTS; y++) {
    fill(weftColors[y]);

    rect(offsetX - 25, offsetY + y * cell, 25, cell);
  }
}

function drawWeave() {
  for (let y = 0; y < WEFTS; y++) {
    for (let x = 0; x < WARPS; x++) {
      let px = offsetX + x * cell;

      let py = offsetY + y * cell;

      noStroke();

      // no grid background

      fill(245);

      rect(px, py, cell, cell);

      if (draft[y][x]) {
        // warp above

        stroke(warpColors[x]);

        strokeWeight(12);

        line(px + cell / 2, py + 2, px + cell / 2, py + cell - 2);

        stroke(weftColors[y]);

        strokeWeight(1);

        line(px + 2, py + cell / 2, px + cell - 2, py + cell / 2);
      } else {
        // weft above

        stroke(warpColors[x]);

        strokeWeight(1);

        line(px + cell / 2, py + 2, px + cell / 2, py + cell - 2);

        stroke(weftColors[y]);

        strokeWeight(12);

        line(px + 2, py + cell / 2, px + cell - 2, py + cell / 2);
      }
    }
  }
}

function mousePressed() {
  // select warp thread

  if (mouseY > offsetY - 25 && mouseY < offsetY) {
    let x = floor((mouseX - offsetX) / cell);

    if (x >= 0 && x < WARPS) {
      selectedType = "warp";

      selectedIndex = x;

      picker.value(colorToHex(warpColors[x]));
    }

    return;
  }

  // select weft thread

  if (mouseX > offsetX - 25 && mouseX < offsetX) {
    let y = floor((mouseY - offsetY) / cell);

    if (y >= 0 && y < WEFTS) {
      selectedType = "weft";

      selectedIndex = y;

      picker.value(colorToHex(weftColors[y]));
    }

    return;
  }

  // toggle weave

  let x = floor((mouseX - offsetX) / cell);

  let y = floor((mouseY - offsetY) / cell);

  if (x >= 0 && x < WARPS && y >= 0 && y < WEFTS) {
    draft[y][x] = !draft[y][x];
  }
}

function updateColor() {
  let c = color(picker.value());

  if (selectedType === "warp") {
    warpColors[selectedIndex] = c;
  } else {
    weftColors[selectedIndex] = c;
  }
}

function colorToHex(c) {
  return "#" + hex(red(c), 2) + hex(green(c), 2) + hex(blue(c), 2);
}
