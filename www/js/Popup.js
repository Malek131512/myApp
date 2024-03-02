if (typeof dir === 'undefined') {
    let dir = window.myGlobalDir;
}
document.addEventListener2("DOMContentLoaded", function () {

    function getPopup(iduser) {
        return new Promise(function (resolve, reject) {

            var data = "action=getPopupbyIduser&iduser=" + iduser;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir+'/ajax/PopupUtils.php');
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

    function setPopup(popup) {
        return new Promise(function (resolve, reject) {

            var data = "action=setPopup&popup=" + JSON.stringify(popup);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir+'/ajax/PopupUtils.php');
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

    GetIdUserConnect().then(function (response) {
        const idUserConnect = response.IdUserConnect;
        var InitPopup = {
            iduser: idUserConnect,
            nom: null,
            prenom: null,
            email: null,
            tel: null,
            message: null,
            time: null,
            bouton: null,
            text_bouton: null,
            actif: null,
            champs: null,
            titre: null,
            texte: null,
            titre_envoyer: null,
            text_envoyer: null
        };
        var modalLeadCapture = document.getElementById('modalLeadCapture');
        if (window.jQuery) {
            // Utilisez jQuery pour attacher l'événement
            $('#lead_capture').change(function () {
                var popup = InitPopup;
                if ($(this).prop('checked')) {
                    modalLeadCapture.style.display = 'block';
                    popup.actif = 1;
                    console.log('La case à cocher est sélectionnée');
                } else {
                    modalLeadCapture.style.display = 'none';
                    popup.actif = 0;
                    console.log('La case à cocher n\'est pas sélectionnée');
                }
                setPopup(popup).then(function (data) {
                    console.log(data);
                });
            });
        }

//time_popup titre-envoyer text-envoyer titre-popup texte-popup placeholder-champs
        var time_popup = document.getElementById('time_popup');
        if (time_popup && time_popup.length > 0) {
            time_popup.addEventListener('change', function () {
                var popup = InitPopup;
                popup.time = this.value;
                setPopup(popup).then(function (data) {
                    console.log(data);
                });
            });
        }
        var titre_envoyer = document.getElementById('titre-envoyer');
        if (titre_envoyer && titre_envoyer.length > 0) {
            titre_envoyer.addEventListener('change', function () {
                var popup = InitPopup;
                popup.titre_envoyer = this.value;
                setPopup(popup).then(function (data) {
                    console.log(data);
                });
            });
        }
        var text_envoyer = document.getElementById('text-envoyer');
        if (text_envoyer && text_envoyer.length > 0) {
            text_envoyer.addEventListener('change', function () {
                var popup = InitPopup;
                popup.text_envoyer = this.value;
                setPopup(popup).then(function (data) {
                    console.log(data);
                });
            });
        }
        var titre_popup = document.getElementById('titre-popup');
        if (titre_popup && titre_popup.length > 0) {
            titre_popup.addEventListener('change', function () {
                var popup = InitPopup;
                popup.titre = this.value;
                setPopup(popup).then(function (data) {
                    console.log(data);
                });
            });
        }
        var texte_popup = document.getElementById('texte-popup');
        if (texte_popup && texte_popup.length > 0) {
            texte_popup.addEventListener('change', function () {
                var popup = InitPopup;
                popup.texte = this.value;
                setPopup(popup).then(function (data) {
                    console.log(data);
                });
            });
        }
        var text_bouton_ouverture = document.getElementById('text_bouton_ouverture');
        if (text_bouton_ouverture && text_bouton_ouverture.length > 0) {
            text_bouton_ouverture.addEventListener('change', function () {
                var popup = InitPopup;
                popup.text_bouton = this.value;
                setPopup(popup).then(function (data) {
                    console.log(data);
                });
            });
        }


        var placeholderChamps = document.querySelectorAll('.placeholder-champs');
        if (placeholderChamps && placeholderChamps.length > 0) {
            placeholderChamps.forEach(function (champ) {
                champ.addEventListener('change', function () {
                    var popup = InitPopup;

                    // Get the 'data-typeName' attribute
                    var type = this.getAttribute('data-typeName');

                    // Use the type to modify the corresponding property in the 'popup' object
                    popup[type] = this.value;

                    setPopup(popup).then(function (data) {
                        console.log(data);
                    });
                });
            });
        }
        var editLeadCapture = document.getElementById('editLeadCapture');
        if (editLeadCapture && editLeadCapture.length > 0) {
            editLeadCapture.addEventListener('click', function () {
                if (editLeadCapture.style.display == "contents") {
                    modalLeadCapture.style.display = 'block';
                }
            });
        }
        var popup = InitPopup;
        if (window.jQuery) {
            $('.actif_champs_popup').change(function () {
                var allValues = "";
                $('.actif_champs_popup').each(function () {
                    allValues += $(this).prop('checked') ? "1," : "0,";
                });

                allValues = allValues.slice(0, -1); // To remove the trailing comma
                console.log(allValues);

                popup.champs = allValues;
                popup.type = this.getAttribute('data-type');

                setPopup(popup).then(function (data) {
                    console.log(data);
                });
            });
            // Utilisez jQuery pour attacher l'événement
            $('#activer_boutton').change(function () {
                var popup = InitPopup;
                if ($(this).prop('checked')) {
                    modalLeadCapture.style.display = 'block';
                    editLeadCapture.style.display = 'contents';
                    popup.bouton = 1;
                    console.log('La case à cocher est sélectionnée');
                } else {
                    modalLeadCapture.style.display = 'none';
                    editLeadCapture.style.display = 'none';
                    popup.bouton = 0;
                    console.log('La case à cocher n\'est pas sélectionnée');
                }
                setPopup(popup).then(function (data) {
                    console.log(data);
                });
            });
        }


    });

});
