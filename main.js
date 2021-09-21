const elements = {};
window.onload = function () {
    this.getElements();
    this.addClickEvent(elements.downloadBtn, this.downloadImage);
    this.addClickEvent(elements.canvas, this.showPixelColor);
};

function getElements() {
    elements.downloadBtn = this.document.getElementById('downloadBtn');
    elements.canvas = this.document.getElementById('uploadedImg');
}

function addClickEvent(element, handler) {
    element.addEventListener('click', handler);
}

function downloadImage() {
    const dataUrl = elements.canvas.toDataURL('image/png');
    elements.downloadBtn.href = dataUrl;
}

function getUploadedImage(files) {
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
            drawGrid(10);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
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
    const curleft = 0;
    const curtop = 0;
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

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomColor() {
    return `rgb(${randomInt(256)}, ${randomInt(256)}, ${randomInt(256)})`;
}
