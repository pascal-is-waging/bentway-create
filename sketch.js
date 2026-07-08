const WARPS = 36;
const WEFTS = 196;
let img;

// spacing between threads
let cell = 22;

let offsetX = 360;
let offsetY = 100;

let draft = [];

let warpColors = [];
let weftColors = [];

let selectedType = "weft";
let selectedIndex = 0;

let picker;
let imageButton;
let patternButton;

let paletteButtons = [];
let importInput;
let colorcount = [];
let pixels = [];
let randomColor = false;

let weftPalette = [
  "#960019",
  "#ff78f1",
  "#c300ff",
  "#ffffff",
  "#ffee00",
  "#02a690",
];
let colorName = ["Burgundy", "Pink", "Purple", "White", "Yellow", "Teal"];
let span = 4;
let warpLen = [2250];
let weftLen = [150, 150, 300, 300, 300, 600];
const GROUP_SIZE = 39;
const GROUP_GAP = 22 * 7;

function setup() {
  const gaps = floor((WEFTS - 1) / GROUP_SIZE);

  createCanvas(
    offsetX + WARPS * cell + 100,
    offsetY + WEFTS * cell + gaps * GROUP_GAP + 100,
  );
  // second = createGraphics(offsetX + 100, offsetY + 100);

  for (let y = 0; y < WEFTS; y++) {
    draft[y] = [];

    for (let x = 0; x < WARPS; x++) {
      draft[y][x] = random() > 0.5;
    }
  }

  for (let i = 0; i < WARPS; i++) {
    warpColors[i] = color("#000000");
  }
  let fileInput = select("#fileInput");

  importInput = createFileInput(loadImageFile);
  // importInput.position(20, 240);
  importInput.parent("fileInput");
  // createP("Import Weave JSON").position(20, 200).style("font-size", "15px");

  randBtn = createButton("random colors OFF");
  randBtn.style("background", "black");
  randBtn.style("color", "white");
  // imageButton.position(20, 400);
  randBtn.mousePressed(() => {
    randomColor = !randomColor;
    randomColor
      ? randBtn.html("random colors ON")
      : randBtn.html("random colors OFF");
  });
  randBtn.parent("fileInput");

  imageButton = createButton("Export Image PNG");
  // imageButton.position(20, 400);
  imageButton.mousePressed(exportImage);
  imageButton.parent("exportImageButton");

  patternButton = createButton("Export Weave Pattern");
  // patternButton.position(20, 425);
  patternButton.mousePressed(exportPattern);
  patternButton.parent("exportPatternButton");

  // weft palette

  for (let i = 0; i < WEFTS; i++) {
    thing = i % weftPalette.length;
    weftColors[i] = color(weftPalette[thing]);
    weftLen[thing] -= span;
  }

  // createP("Palette").position(20, 60);

  let palContainer = select("#pal-container");
  for (let i = 0; i < weftPalette.length; i++) {
    let b = createButton("");

    // b.position(20 + i * 35, 105);

    b.size(30, 30);

    b.style("background", weftPalette[i]);

    b.mousePressed(function () {
      // b.style("border", "3px solid red");
      applyPaletteColor(weftPalette[i]);
    });
    // colorcount[i] = createP(weftLen[i])
    //   .position(20 + i * 35, 140)
    //   .style("font-size", "15px");
    colorcount[i] = createP(weftLen[i]).style("font-size", "15px");
    let temp = createDiv("");
    temp.child(b);
    temp.child(colorcount[i]);

    temp.parent("pal-container");

    paletteButtons.push(b);
  }
}

function draw() {
  background(255);

  drawThreadColors();

  drawWeave();
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
    let group = floor(y / GROUP_SIZE);
    let py = offsetY + y * cell + group * GROUP_GAP;
    strokeWeight(1);
    stroke(0);
    fill(weftColors[y]);
    rect(offsetX - 35, py, 25, cell);
  }
}

function drawWeave() {
  for (let y = 0; y < WEFTS; y++) {
    for (let x = 0; x < WARPS; x++) {
      let px = offsetX + x * cell;

      let group = floor(y / GROUP_SIZE);
      let py = offsetY + y * cell + group * GROUP_GAP;

      noStroke();

      fill(245);

      rect(px, py, cell, cell);

      if (draft[y][x]) {
        stroke(warpColors[x]);

        strokeWeight(12);

        line(px + cell / 2, py + 2, px + cell / 2, py + cell - 2);

        stroke(weftColors[y]);

        strokeWeight(1);

        line(px + 2, py + cell / 2, px + cell - 2, py + cell / 2);
      } else {
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
      console.log("Selected warp thread:", selectedIndex);
    }

    return;
  }

  if (mouseX > offsetX - 25 && mouseX < offsetX) {
    let y = floor((mouseY - offsetY) / cell);

    if (y >= 0 && y < WEFTS) {
      selectedType = "weft";

      selectedIndex = y;
      console.log("Selected wrfts thread:", selectedIndex);
    }

    return;
  }

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
function exportImage() {
  saveCanvas("loom_image", "png");
}
// function exportPattern() {
//   let pattern = {
//     warps: WARPS,
//     wefts: WEFTS,

//     // convert true/false into black/color

//     draft: draft.map((row, index) =>
//       row.map((cell) =>
//         cell ? "black" : colorName[findindex(weftColors[index])],
//       ),
//     ),

//     warpColors: warpColors.map(colorToHex),

//     weftColors: weftColors.map(colorToHex),
//   };

//   saveJSON(pattern, "weaving_pattern.json");
// }

function exportPattern() {
  const { jsPDF } = window.jspdf;
  let pdf = new jsPDF();

  let totalGroups = Math.ceil(WEFTS / GROUP_SIZE);

  for (let group = 0; group < totalGroups; group++) {
    if (group > 0) {
      pdf.addPage();
    }

    let startRow = group * GROUP_SIZE;
    let endRow = Math.min(startRow + GROUP_SIZE, WEFTS);

    let cellSize = 5;
    let xOffset = 20;
    let yOffset = 20;

    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < WARPS; col++) {
        let cellColor;

        if (draft[row][col]) {
          cellColor = warpColors[col];
        } else {
          cellColor = weftColors[row];
        }

        // convert p5 color to RGB
        let c = color(cellColor);

        pdf.setFillColor(red(c), green(c), blue(c));

        pdf.rect(
          xOffset + col * cellSize,
          yOffset + (row - startRow) * cellSize,
          cellSize,
          cellSize,
          "F",
        );
      }
    }

    // label each page
    pdf.setFontSize(10);
    pdf.text(`Rows ${startRow + 1} - ${endRow}`, 20, 10);
  }

  pdf.save("weaving_pattern.pdf");
}
function applyPaletteColor(hexColor) {
  let c = color(hexColor);

  if (selectedType === "warp") {
    warpColors[selectedIndex] = color("#000000");
  } else {
    console.log(
      c + " --- " + selectedIndex + " --- " + weftColors[selectedIndex],
    );
    let color1 = findindex(weftColors[selectedIndex]);
    let color2 = findindex(c);
    console.log(
      "indexes color rightnow" + color1 + " --- color selected" + color2,
    );
    console.log(weftLen[color1] + " --- " + weftLen[color2]);
    weftLen[color1] += span;
    weftLen[color2] -= span;
    console.log(weftLen[color1] + " --- " + weftLen[color2]);
    // console.log(colorcount[i].html() + " --- " + weftLen[i]);

    for (let i = 0; i < weftPalette.length; i++) {
      colorcount[i].html(weftLen[i]);
    }
    weftColors[selectedIndex] = c;
  }

  // picker.value(hexColor);
}
function findindex(col) {
  for (let i = 0; i < weftPalette.length; i++) {
    console.log("basssssssba " + color(weftPalette[i]) + " --- " + col);
    if (color(weftPalette[i]).toString() === col.toString()) {
      return i;
    }
  }
}
function importPattern() {
  // if (file.subtype !== "json") {
  //   console.log("Please select a JSON file");
  //   return;
  // }

  // let data = file.data;
  let draft2 = [];

  for (let y = 0; y < WEFTS; y++) {
    draft2[y] = [];

    for (let x = 0; x < WARPS; x++) {
      if (pixels[y][x] < 128) {
        draft2[y][x] = "black";
      } else {
        draft2[y][x] = "color";
      }
    }
  }

  let data = {
    warps: WARPS,

    wefts: WEFTS,

    draft: draft2,

    // your loom colors

    warpColors: Array(WARPS).fill("#000000"),

    weftColors: randomColor
      ? Array.from({ length: WEFTS }, () => random(weftPalette))
      : Array(WEFTS).fill("#ffffff"),
  };

  console.log(data);

  draft = [];

  for (let y = 0; y < data.wefts; y++) {
    draft[y] = [];

    for (let x = 0; x < data.warps; x++) {
      if (data.draft[y][x] === "black") {
        draft[y][x] = true;
      } else {
        draft[y][x] = false;
      }
    }
  }

  warpColors = [];

  for (let i = 0; i < data.warps; i++) {
    warpColors.push(color(data.warpColors[i]));
  }

  weftColors = [];

  for (let i = 0; i < data.wefts; i++) {
    weftColors.push(color(data.weftColors[i]));
  }

  console.log("Loaded:", data.warps, "warps x", data.wefts, "wefts");
}

function loadImageFile(file) {
  if (file.type === "image") {
    img = loadImage(file.data, processImage);
  }
}

function processImage() {
  // resize image to loom size

  img.resize(WARPS, WEFTS);

  img.loadPixels();

  pixels = [];

  for (let y = 0; y < WEFTS; y++) {
    pixels[y] = [];

    for (let x = 0; x < WARPS; x++) {
      let index = 4 * (y * WARPS + x);

      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      // grayscale

      let brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      pixels[y][x] = brightness;
    }
  }

  dither();
  importPattern();
}

function dither() {
  for (let y = 0; y < WEFTS; y++) {
    for (let x = 0; x < WARPS; x++) {
      let oldPixel = pixels[y][x];

      let newPixel = oldPixel < 128 ? 0 : 255;

      let error = oldPixel - newPixel;

      pixels[y][x] = newPixel;

      // Floyd Steinberg diffusion

      if (x + 1 < WARPS) {
        pixels[y][x + 1] += (error * 7) / 16;
      }

      if (x - 1 >= 0 && y + 1 < WEFTS) {
        pixels[y + 1][x - 1] += (error * 3) / 16;
      }

      if (y + 1 < WEFTS) {
        pixels[y + 1][x] += (error * 5) / 16;
      }

      if (x + 1 < WARPS && y + 1 < WEFTS) {
        pixels[y + 1][x + 1] += (error * 1) / 16;
      }
    }
  }
}
