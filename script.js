const pixelGrid = document.getElementById("pixelGrid");
const gridSize = document.getElementById("gridSize");
const createGridButton = document.getElementById("createGrid");
const colorPicker = document.getElementById("colorPicker");
const eraseButton = document.getElementById("erase");
const clearGridButton = document.getElementById("clearGrid");
const colorOptions = document.querySelectorAll(".color-option");
const downloadButton = document.getElementById("downloadButton");

let isDrawing = false;
let isErasing = false;

function colorPixel(pixel) {
    if (isErasing) {
        pixel.style.backgroundColor = "white";
    } else {
        pixel.style.backgroundColor = colorPicker.value;
    }
}

eraseButton.addEventListener("click", function() {
    isErasing = true;
    eraseButton.classList.add("active");
});

colorPicker.addEventListener("input", function() {
    isErasing = false;
    eraseButton.classList.remove("active");
});

colorOptions.forEach(function(option) {
    option.addEventListener("click", function() {
        const selectedColor = option.dataset.color;
        colorPicker.value = selectedColor;
        isErasing = false;
        eraseButton.classList.remove("active");
    });
});

function createGrid() {
    const size = Number(gridSize.value);
    pixelGrid.innerHTML = "";
    pixelGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel");

        pixel.addEventListener("click", function() {
            colorPixel(pixel);
        });

        pixel.addEventListener("mousedown", function() {
            isDrawing = true;
            colorPixel(pixel);
        });
        
        pixel.addEventListener("mouseenter", function() {
            if (isDrawing) {
                colorPixel(pixel);
            }
        });
        pixelGrid.appendChild(pixel);
    }
}

document.addEventListener("mouseup", function() {
    isDrawing = false;
});

clearGridButton.addEventListener("click", function() {
    const confirmClear = confirm(
        "Are you sure you want to clear your artwork?"
    );
    if (confirmClear) {
        const pixels = document.querySelectorAll(".pixel");
        pixels.forEach(function(pixel) {
            pixel.style.backgroundColor = "white";
        });
        isErasing = false;
        eraseButton.classList.remove("active");
    }
});

function download() {
    const canvas = document.createElement("canvas");
    const size = Number(gridSize.value);
    const pixels = document.querySelectorAll(".pixel");
    const pixelSize = 30; 
    canvas.width = size * pixelSize;
    canvas.height = size * pixelSize;
    const ctx = canvas.getContext("2d");
    pixels.forEach(function(pixel, index) {
        const row = Math.floor(index / size);
        const col = index % size;
        const color = getComputedStyle(pixel).backgroundColor;
        ctx.fillStyle = color;
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    });
    const link = document.createElement("a");
    link.download = "pixel_art.png";
    link.href = canvas.toDataURL();
    link.click();
}

downloadButton.addEventListener("click", download);
createGridButton.addEventListener("click", createGrid);