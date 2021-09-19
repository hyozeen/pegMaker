function getUploadedImage(files) {
    const file = files[0];

    if (!file.type.match(/image.*/)) {
        alert('not image file!');
    }
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const ctx = document.getElementById('uploadedImg').getContext('2d');
            ctx.drawImage(img, 0, 0, 800, 800);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}
