if (typeof dir === 'undefined') {
    let dir = window.myGlobalDir;
}
// Fonction pour copier le lien du profil
function copyLink() {
    const copyText = document.getElementById("profileLink");
    const copyButton = document.getElementById("copyButton");
    const copyIcon = copyButton.querySelector("i");

    // Copier le texte
    copyText.select();
    document.execCommand("copy");

    copyIcon.classList.add("icon-hidden");

    setTimeout(() => {
        copyIcon.classList.remove("fa-copy");
        copyIcon.classList.add("fa-check", "icon-check");
    }, 500);

    setTimeout(() => {
        copyIcon.classList.remove("icon-check");
        copyIcon.classList.add("icon-hidden");
    }, 1500);

    setTimeout(() => {
        copyIcon.classList.remove("fa-check", "icon-hidden");
        copyIcon.classList.add("fa-copy");
    }, 2000);
}


// Fonction pour partager le profil
function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: 'Mon profil Bip', text: 'Découvrez mon profil sur Bip !', url: getLink(),
        })
            .then(() => console.log('Partage réussi'))
            .catch((error) => console.log('Erreur de partage', error));
    } else {
        alert("Votre navigateur ne prend pas en charge cette fonctionnalité de partage.");
    }
}
function getLink(){
    var crypt = document.getElementById('crypt').value;
    return dir+"/index.php?profil&cry=" + crypt;
}
document.addEventListener2("DOMContentLoaded", function () {
    const link = getLink();
    function getQrcode(iduser) {
        return new Promise(function (resolve, reject) {

            var data = "action=getQrcode&iduser=" + iduser;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir+'/ajax/QrcodeUtils.php');
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const responseqrcodeect = xhr.response;
                    resolve(responseqrcodeect);
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

    function setQrcode(qrcode) {
        return new Promise(function (resolve, reject) {

            var data = "action=setQrcode&qrcode=" + JSON.stringify(qrcode);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir+'/ajax/QrcodeUtils.php');
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const response = xhr.response;
                    resolve(response);
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

    var qrButton = document.querySelector(".GenerateQrCode");
    var modalEditQrcode = document.getElementById('modalEditQrcode');
    qrButton.addEventListener2("click", function () {
        modalEditQrcode.style.display = "block";
    });



// Ajout des écouteurs d'événements
    document.getElementById("copyButton").addEventListener2("click", copyLink);
    document.getElementById("shareButton").addEventListener2("click", shareProfile);

// Note : Le bouton AirDrop utilise la même fonction de partage,
// car AirDrop apparaîtra comme une option sur les appareils Apple.
   // document.getElementById("airDropButton").addEventListener2("click", shareProfile);


    var accButtons = document.getElementsByClassName('accordion');

    Array.from(accButtons).forEach(function (element) {
        element.addEventListener2('click', function () {
            var panel = this.getAttribute('data-panel');
            var panelElem = document.getElementById(panel);
            if (panelElem.classList.contains('open')) {
                panelElem.style.display = 'none';
                panelElem.classList.remove('open');
            } else {
                panelElem.style.display = 'block';
                panelElem.classList.add('open');
            }
        });
    });

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    UploadQrCode = function (qrCode, ext) {
        qrCode.download({name: "qr", extension: ext});
    };

    var GenererAffichageQrcode = function (iduser, width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize, typeNumber) {
        var vueQrcode = document.getElementById('vueQrcode');
        console.log(vueQrcode);
        var modalEditQrcode = document.getElementById('modalEditQrcode');
        const qrCodeObj = GenererQrcode(width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize, typeNumber);
        console.log(qrCodeObj);
        const qrcode = {
            WIDTH: width,
            HEIGHT: height,
            MARGIN: margin,
            TYPE: type,
            DATA: data,
            IMAGE: image,
            COLOR: color,
            TYPEDOTS: typeDots,
            BACKGROUND_COLOR: backgroundColor,
            IMAGE_CROSSORIGIN: crossOrigin,
            IMAGE_MARGIN: imageMargin,
            IMAGE_SIZE: imageSize,
            TYPENUMBER: typeNumber,
            IDUSER: iduser
        };
        console.log(qrcode);

        setQrcode(qrcode).then(function (data) {
            console.log(data);
        });
        console.log(qrCodeObj);
        vueQrcode.innerHTML = '';
        qrCodeObj.append(vueQrcode);
        const svgElement = vueQrcode.querySelector('svg');

        if (svgElement) {
            svgElement.style.margin = "-30px";
        }

        modalEditQrcode.style.display = 'none';
    };

    GenererQrcode = function (width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize, typeNumber) {
        const qrCode = new QRCodeStyling({
            width: width,
            height: height,
            margin: margin,
            type: type,
            data: data,
            image: dir+'/img/logo_qrcode' + (image !== null && image !== ''  ? image : '/Biplogo.png'),
            imageSize: imageSize,
            qrOptions: {
                typeNumber: typeNumber
            },
            dotsOptions: {
                color: color, type: typeDots
            },
            backgroundOptions: {
                color: backgroundColor,
            },
            imageOptions: {
                crossOrigin: crossOrigin, margin: imageMargin
            }

        });
        console.log(qrCode);
        //  qrCode.append(document.getElementById("canvas"));
        return qrCode;

    };


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



    var data = document.getElementById('form-data').value;

    GetIdUserConnect().then(function (response) {
        const idUserConnect = response.IdUserConnect;
        var width, height, margin, type, color, image, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize,
            typeNumber;

        getQrcode(idUserConnect).then(function (qrcode) {
            console.log(qrcode);
            console.log(typeof qrcode);
            qrcode = JSON.parse(qrcode);
            if (Object.keys(qrcode).length > 0) {
                width = parseInt(qrcode.width);
                height = parseInt(qrcode.height);
                margin = parseInt(qrcode.margin);
                type = qrcode.type;
                color = qrcode.color;
                image = qrcode.image;
                typeDots = qrcode.typedots;
                backgroundColor = qrcode.background_color;
                crossOrigin = qrcode.image_crossorigin;
                imageMargin = parseInt(qrcode.image_margin);
                imageSize = parseInt(qrcode.image_size);
                typeNumber = parseInt(qrcode.typenumber);
                GenererAffichageQrcode(idUserConnect, width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize, typeNumber);
            }
        });

        var formDotsColor = document.getElementById('form-dots-color');
        formDotsColor.addEventListener2('change', function () {
            var color = formDotsColor.value;
            console.log(color);
            GenererAffichageQrcode(idUserConnect, width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize, typeNumber);
        });

        var formBackgroundColor = document.getElementById('form-background-color');
        formBackgroundColor.addEventListener2('change', function () {
            var backgroundColor = formBackgroundColor.value;
            document.getElementById('vueQrcode').innerHTML = '';
            console.log(color);
            GenererAffichageQrcode(idUserConnect, width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize, typeNumber);
        });

        document.getElementById('form-dots-type').addEventListener2('change', function () {
            typeDots = this.value;
            console.log(typeDots);
            document.getElementById('vueQrcode').innerHTML = '';
            GenererAffichageQrcode(idUserConnect, width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize, typeNumber);
        });

        document.getElementById('form-data').addEventListener2('change', function () {
            data = this.value;
            console.log(data);
            document.getElementById('vueQrcode').innerHTML = '';
            GenererAffichageQrcode(idUserConnect, width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize, typeNumber);
        });

        document.getElementById('form-image-size').addEventListener2('change', function () {
            imageSize = parseInt(this.value);
            console.log(imageSize, typeNumber);
            document.getElementById('vueQrcode').innerHTML = '';
            GenererAffichageQrcode(idUserConnect, width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize, typeNumber);
        });

        document.getElementById('form-pixel').addEventListener2('change', function () {
            typeNumber = parseInt(this.value);
            document.getElementById('vueQrcode').innerHTML = '';
            GenererAffichageQrcode(idUserConnect, width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize, typeNumber);
        });

        document.getElementById('form-image-margin').addEventListener2('change', function () {
            imageMargin = parseInt(this.value);
            console.log(imageMargin);
            document.getElementById('vueQrcode').innerHTML = '';
            GenererAffichageQrcode(idUserConnect, width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, imageMargin, imageSize, typeNumber);
        });

        document.getElementById('qr-download').addEventListener2('click', function () {
            var ext = document.querySelector('#qr-extension option:checked').value;
            console.log(ext);
            document.getElementById('vueQrcode').innerHTML = '';
            var width = 1000;
            var height = 1000;
            var margin = 5;
            var Qrcode = GenererQrcode(width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, margin, imageSize, typeNumber);
            UploadQrCode(Qrcode, ext);
        });

        document.getElementById('button-cancel').addEventListener2('click', function () {
            const qrcode = {
                IMAGE: '',
                IDUSER: idUserConnect
            };
            console.log(qrcode);
            setQrcode(qrcode).then(function (data) {
                console.log(data);
            });
            document.getElementById('vueQrcode').innerHTML = '';
            GenererAffichageQrcode(idUserConnect, width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, margin, imageSize, typeNumber);
        });

        function UploadData(method, fileName, file, iduser) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                var formData = new FormData();
                formData.append("iduser", iduser);
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

        document.getElementById('form-image-file').addEventListener2('change', function () {
            var file = document.getElementById('form-image-file').files[0];
            console.log(file);
            UploadData('logoQrcode', 'form-image-file', file, idUserConnect).then(function (logo_qrcode) {
                console.log(image);
                logo_qrcode = JSON.parse(logo_qrcode);
                console.log(logo_qrcode);
                if (logo_qrcode.result) {
                    image = logo_qrcode.data;
                    document.getElementById('preview-image-file').attributes.src.value = dir+'/img/logo_qrcode' + (image !== null && image !== "" ? '/'+ image : '/Biplogo.png');
                    GenererAffichageQrcode(idUserConnect, width, height, margin, type, data, image, color, typeDots, backgroundColor, crossOrigin, margin, imageSize, typeNumber);
                } else {
                    console.error('Request failed.  Returned status of ' + xhr.status);
                }
            });
        });
    });
});
