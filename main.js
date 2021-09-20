const elements = {};
window.onload = function () {
    this.getElements();
    this.addClickEvent(elements.downloadBtn, this.downloadImage);
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
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}
