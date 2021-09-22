const elements = {};
let gridSize = 40;
window.onload = function () {
    this.getElements();
    this.addClickEvent(elements.downloadBtn, this.downloadImage);
    this.addClickEvent(elements.canvas, this.showPixelColor);
};

function getElements() {
    elements.downloadBtn = this.document.getElementById('downloadBtn');
    elements.canvas = this.document.getElementById('uploadedImg');
    elements.gridSize = this.document.getElementById('gridSize');
}

function addClickEvent(element, handler) {
    element.addEventListener('click', handler);
}

function downloadImage() {
    const dataUrl = elements.canvas.toDataURL('image/png');
    elements.downloadBtn.href = dataUrl;
}

function getUploadedImage(files) {
    this.clearCanvas();
    const file = files[0];

    if (!file.type.match(/image.*/)) {
        alert('not image file!');
    }
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const ctx = elements.canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 800, 800);
            gridSize = elements.gridSize.value;
            drawGrid(gridSize);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

function clearCanvas() {
    const ctx = elements.canvas.getContext('2d');
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    ctx.beginPath();
}

function drawGrid(number) {
    const width = elements.canvas.width;
    const height = elements.canvas.height;
    const context = elements.canvas.getContext('2d');
    const gap = width / number;
    for (let x = 0; x <= width; x += gap) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.moveTo(0, x);
        context.lineTo(width, x);
    }
    context.strokeStyle = 'white';
    context.stroke();
}

function makeMosaic() {
    const width = elements.canvas.width;
    const height = elements.canvas.height;
    const context = elements.canvas.getContext('2d');
    for (let r = 0; r < width; r++) {
        for (let c = 0; c < height; c++) {
            const pixel = context.getImageData(r, c, 1, 1).data;
            const hex = '#' + ('000000' + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
            console.log(hex);
        }
    }
}

function makeGrayscale() {
    const width = elements.canvas.width;
    const height = elements.canvas.height;
    const context = elements.canvas.getContext('2d');
    let imgData = context.getImageData(0, 0, width, height);

    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }

    context.putImageData(imgData, 0, 0);
}

function makeBlackNWhite() {
    const width = elements.canvas.width;
    const height = elements.canvas.height;
    const context = elements.canvas.getContext('2d');
    let imgData = context.getImageData(0, 0, width, height);
    let buffer = imgData.data;
    let len = buffer.length;
    let threshold = 127;

    for (let i = 0; i < len; i += 4) {
        // get approx. luma value from RGB
        let luma = buffer[i] * 0.3 + buffer[i + 1] * 0.59 + buffer[i + 2] * 0.11;

        // test against some threshold
        luma = luma < threshold ? 0 : 255;

        // write result back to all components
        buffer[i] = luma;
        buffer[i + 1] = luma;
        buffer[i + 2] = luma;
    }

    // update canvas with the resulting bitmap data
    context.putImageData(imgData, 0, 0);
}

function showPixelColor(e) {
    const pos = findPos(this);
    const x = e.pageX - pos.x;
    const y = e.pageY - pos.y;
    const coord = 'x=' + x + ', y=' + y;
    const context = this.getContext('2d');
    const pixel = context.getImageData(x, y, 1, 1).data;
    const hex = '#' + ('000000' + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
    console.log(coord + ', ' + hex);
}

function findPos(obj) {
    let curleft = 0;
    let curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while ((obj = obj.offsetParent));
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) throw 'Invalid color component';
    return ((r << 16) | (g << 8) | b).toString(16);
}

function hexToRgb(hex) {
    return hex
        .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1)
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16));
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomColor() {
    return `rgb(${randomInt(256)}, ${randomInt(256)}, ${randomInt(256)})`;
}

function getDecimal(hex) {
    return parseInt(hex, 16);
}
