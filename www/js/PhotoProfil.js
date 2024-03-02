if (typeof dir === 'undefined') {
    let dir = window.myGlobalDir;
}

document.addEventListener2('DOMContentLoaded', function () {
    function UploadData(method, fileName, file, idprofil) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            var formData = new FormData();
            formData.append("idprofil", idprofil);
            formData.append("method", method);
            formData.append(fileName, file);

            xhr.open("POST", dir+"/ajax/UploadDataUtils.php");
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(Error(xhr.statusText));
                }
            };
            xhr.onerror = function () {
                reject(Error("Network Error"));
            };
            xhr.send(formData);
        });
    }

    function GetIdUserConnect() {
        return new Promise(function (resolve, reject) {
            var data = `action=getIdUserConnect&appToken=${getAppToken()}`;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/AjaxUtils.php');
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const responseObject = JSON.parse(xhr.response);
                    resolve(responseObject);
                } else {
                    reject(Error(xhr.statusText));
                }
            };
            xhr.onerror = function () {
                reject(Error("Network Error"));
            };
            xhr.send(data);
        });
    }


    var ModalPhotoProfil = document.getElementById('PhotoProfilModal');
    var opensModalPhotoProfil = document.querySelectorAll('.editProfilModal');
    var ModalPhotoProfilClose = document.getElementById('ModalPhotoProfilClose');

    opensModalPhotoProfil.forEach((openModalPhotoProfil) => {
        openModalPhotoProfil.addEventListener2('click', (event) => {
            ModalPhotoProfil.style.display = 'block';
        });
    });
    if(ModalPhotoProfilClose){
        ModalPhotoProfilClose.addEventListener2('click', function () {
            ModalPhotoProfil.style.display = 'none';
        });
    }
    var fileInputCouverture = document.getElementById('FileCouverture');
    var fileInputProfil = document.getElementById('FileProfil');


    function SetProfil(profil,deletePhoto=false) {
        return new Promise(function (resolve, reject) {

            var data = "action=setProfil"+ (deletePhoto ? "&deletePhoto=true":'') + "&profil=" + JSON.stringify(profil);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir+'/ajax/ProfilUtils.php');
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const responseObject = xhr.response;
                    resolve(responseObject);
                } else {
                    reject(Error(xhr.statusText));
                }
            };
            xhr.onerror = function () {
                reject(Error("Network Error"));
            };
            xhr.send(data);
        });
    }

    var viewProfil = document.getElementById('img-photo-profil');
    var viewCouverture = document.getElementById('img-couverture');

    var previewProfil = document.getElementById('profilPreview');
    var previewCouverture = document.getElementById('couverturePreview');
    if(document.getElementById("idprofil")) var idprofil = document.getElementById("idprofil").value;

    var cropperImageProfil = document.getElementById("cropperImageProfil");
    var cropperImageCouverture = document.getElementById("cropperImageCouverture");
    var cropperContainerProfil = document.getElementById("cropperContainerProfil");
    var cropperContainerCouverture = document.getElementById("cropperContainerCouverture");
    var saveProfilButton = document.getElementById("saveProfilButton");
    var saveCouvertureButton = document.getElementById("saveCouvertureButton");

    var deleteProfilButton = document.getElementById("deleteProfilButton");
    var deleteCouvertureButton = document.getElementById("deleteCouvertureButton");
    GetIdUserConnect().then(function (response) {
        const idUserConnect = response.IdUserConnect;
        deleteProfilButton.addEventListener2('click', function () {
            var profil = {};
            profil.idprofil = 1;
            profil.iduser = idUserConnect;
            profil.photo = true;
            SetProfil(profil,true).then(function (data) {
                if (data) {
                    previewProfil.src = dir+"/img/profil.jpg";
                    viewProfil.src = dir+"/img/profil.jpg";
                    deleteProfilButton.style.display = "none";
                }
            });
        });
        deleteCouvertureButton.addEventListener2('click', function () {
            var profil = {};
            profil.idprofil = document.getElementById('idprofil').value;
            profil.iduser = idUserConnect;
            profil.banniere = true;
            SetProfil(profil,true).then(function (data) {
                if (data) {
                    previewCouverture.src = dir+"/img/couverture/white.png";
                    viewCouverture.src = "";
                    deleteCouvertureButton.style.display = "none";
                }
            });
        });
    });

    var croppedBlobCouverture;

    fileInputCouverture.addEventListener2('change', function () {
        var file = fileInputCouverture.files[0];
        if (file) {
            var reader = new FileReader();
            saveCouvertureButton.style.display = 'block';
            reader.onload = function (event) {
                var image = new Image();
                image.onload = function () {
                    if (image.width / image.height === 16 / 9) {
                        // L'image est rectangulaire, afficher dans l'aperçu
                        previewCouverture.src = event.target.result;
                        UploadData('couverture', 'FileCouverture', file, idprofil).then(function (data) {
                            var json = JSON.parse(data);
                            if (json.result) {
                                saveCouvertureButton.style.display = 'none';
                                deleteCouvertureButton.style.display = 'block';
                                viewCouverture.attributes.src.value = previewCouverture.attributes.src.value = json.data;
                            }
                        });
                    } else {
                        cropperContainerCouverture.style.display = 'block';
                        cropperImageCouverture.src = event.target.result;
                        // initialisation de cropper.js...
                        var cropper = new Cropper(cropperImageCouverture, {
                            aspectRatio: 16 / 9, viewMode: 1, ready: function () {
                                var cropBoxData = cropper.getCropBoxData();
                                var canvasData = cropper.getCanvasData();
                                var sideLength = Math.min(canvasData.naturalWidth, canvasData.naturalHeight);
                                cropBoxData.left = (canvasData.naturalWidth - sideLength) / 2;
                                cropBoxData.top = (canvasData.naturalHeight - sideLength) / 2;
                                cropBoxData.width = sideLength;
                                cropBoxData.height = sideLength;
                                cropper.setCropBoxData(cropBoxData);
                            }
                        });

                        saveCouvertureButton.addEventListener2("click", function () {
                            if (cropper) {
                                var canvas = cropper.getCroppedCanvas();
                                cropper.destroy();
                                cropper = null;
                                if (canvas) {
                                    canvas.toBlob(function (blob) {
                                        croppedBlobCouverture = blob;
                                        var croppedImageUrl = URL.createObjectURL(blob);
                                        previewCouverture.src = croppedImageUrl;
                                        var file = new File([croppedBlobCouverture], "image-rognee.png", {type: "image/png"});
                                        var dataTransfer = new DataTransfer();
                                        dataTransfer.items.add(file);
                                        fileInputCouverture.files = dataTransfer.files;
                                        cropperContainerCouverture.style.display = 'none';

                                        //Upload cropped image
                                        UploadData('couverture', 'FileCouverture', file, idprofil).then(function (data) {
                                            json = JSON.parse(data);
                                            if (json.result) {
                                                cropperImageCouverture.src = "";
                                                cropperContainerCouverture.style.display = 'none';
                                                saveCouvertureButton.style.display = 'none';
                                                deleteCouvertureButton.style.display = 'block';
                                                viewCouverture.attributes.src.value = previewCouverture.attributes.src.value = json.data;
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }
                };
                image.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    var croppedBlobProfil;
    fileInputProfil.addEventListener2('change', function () {
        var file = fileInputProfil.files[0];
        if (file) {
            var reader = new FileReader();
            saveProfilButton.style.display = 'block';
            reader.onload = function (event) {
                var image = new Image();
                image.onload = function () {
                    if (image.width === image.height) {
                        // L'image est carrée, afficher dans l'aperçu
                        previewProfil.src = event.target.result;
                        UploadData('profil', 'FileProfil', file, idprofil).then(function (data) {
                            var json = JSON.parse(data);
                            if (json.result) {
                                saveProfilButton.style.display = 'none';
                                deleteProfilButton.style.display = 'block';
                                viewProfil.attributes.src.value = previewProfil.attributes.src.value = json.data;
                            }
                        });
                    } else {
                        cropperContainerProfil.style.display = 'block';
                        cropperImageProfil.src = event.target.result;
                        // initialisation de cropper.js...
                        var cropper = new Cropper(cropperImageProfil, {
                            aspectRatio: 1, viewMode: 1, ready: function () {
                                var cropBoxData = cropper.getCropBoxData();
                                var canvasData = cropper.getCanvasData();
                                var sideLength = Math.min(canvasData.naturalWidth, canvasData.naturalHeight);
                                cropBoxData.left = (canvasData.naturalWidth - sideLength) / 2;
                                cropBoxData.top = (canvasData.naturalHeight - sideLength) / 2;
                                cropBoxData.width = sideLength;
                                cropBoxData.height = sideLength;
                                cropper.setCropBoxData(cropBoxData);
                            }
                        });

                        saveProfilButton.addEventListener2("click", function () {
                            if (cropper) {
                                var canvas = cropper.getCroppedCanvas();
                                cropper.destroy();
                                cropper = null;
                                if (canvas) {
                                    canvas.toBlob(function (blob) {
                                        croppedBlobProfil = blob;
                                        var croppedImageUrl = URL.createObjectURL(blob);
                                        previewProfil.src = croppedImageUrl;
                                        var file = new File([croppedBlobProfil], "image-rognee.png", {type: "image/png"});
                                        var dataTransfer = new DataTransfer();
                                        dataTransfer.items.add(file);
                                        fileInputProfil.files = dataTransfer.files;
                                        cropperContainerProfil.style.display = 'none';

                                        //Upload cropped image
                                        UploadData('profil', 'FileProfil', file, idprofil).then(function (data) {
                                            json = JSON.parse(data);
                                            if (json.result) {
                                                cropperImageProfil.src = "";
                                                cropperContainerProfil.style.display = 'none';
                                                saveProfilButton.style.display = 'none';
                                                deleteProfilButton.style.display = 'block';
                                                viewProfil.attributes.src.value = previewProfil.attributes.src.value = json.data;
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }
                };
                image.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });


});



















