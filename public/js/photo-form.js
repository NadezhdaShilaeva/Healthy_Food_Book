document.querySelector('.parameter__input__photo').addEventListener('change', function () {
    console.log(this.files[0]);
    if (this.files && this.files[0]) {
        previewPhoto(this.files[0]);
    }
});

function previewPhoto(photoFile) {
    var fileReader = new FileReader();

    fileReader.addEventListener('load', function () {
    document.querySelector('.parameter__label__photo').style.backgroundImage = "url(" + fileReader.result + ")";
    }, false);

    fileReader.readAsDataURL(photoFile);
}

document.querySelector('#form').addEventListener('reset', () => {
    document.querySelector('.parameter__label__photo').style.backgroundImage = "";
});