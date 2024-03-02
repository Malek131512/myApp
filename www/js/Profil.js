if (typeof dir === 'undefined') {
    let dir = window.myGlobalDir;
}
document.addEventListener2('DOMContentLoaded', function () {

    function initMesLiens(iduser) {
        if(document.getElementById("idprofil")) var idprofil = document.getElementById("idprofil").value;
        console.log(idprofil);

        getLinksByIdUserIdProfil(iduser, idprofil).then(function (links) {
            links.forEach(function (link) {
                getIconByIdicon(link.idicon).then(function (icon) {
                    addIcon(icon.idicon, link.idlink, icon.libelle);
                });
            });

        });
    }

    function addIcon(idicon, idlink, iconName) {
        var divElement = document.createElement("div");
        divElement.classList.add("div-icon-style-1");
        var imgElement = document.createElement("img");
        imgElement.setAttribute("src", dir + "/img/" + idicon + ".png");
        imgElement.classList.add("icon-style-1", "editLink");
        imgElement.setAttribute("idlink", idlink);
        divElement.appendChild(imgElement);
        var pElement = document.createElement("p");
        pElement.classList.add("text-center");
        pElement.classList.add("text-ajust");
        pElement.textContent = iconName;
        divElement.appendChild(pElement);
        document.getElementById("MesLiens").appendChild(divElement);
    }

    function setCheckboxState(id, isChecked) {
        var checkbox = document.getElementById(id);
        if (checkbox && checkbox.type === 'checkbox') {
            if (isChecked) {
                checkbox.parentNode.querySelector('.toggle-on').classList.add('active');
                checkbox.parentNode.querySelector('.toggle-off').classList.remove('active');
            } else {
                checkbox.parentNode.querySelector('.toggle-on').classList.remove('active');
                checkbox.parentNode.querySelector('.toggle-off').classList.add('active');
            }
            checkbox.checked = isChecked;
        }
    }

    function getLinksByIdUserIdProfil(iduser, idprofil) {
        return new Promise(function (resolve, reject) {
            var data = "action=getLinksByIdUserIdProfil&iduser=" + iduser + "&idprofil=" + idprofil;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/LinkUtils.php');
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

    function getIconByIdicon(idicon) {
        return new Promise(function (resolve, reject) {
            var data = "action=getIconByIdicon&idicon=" + idicon;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/LinkUtils.php');
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

    function setUser(user) {
        return new Promise(function (resolve, reject) {

            var data = "action=setUser&user=" + JSON.stringify(user);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/ProfilUtils.php');
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

    function SetLink(link) {
        return new Promise(function (resolve, reject) {

            var data = "action=setLink&link=" + JSON.stringify(link);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/LinkUtils.php');
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

    function SetLinks(links) {
        return new Promise(function (resolve, reject) {

            var data = "action=setLinks&links=" + JSON.stringify(links);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/LinkUtils.php');
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

    function SetProfil(profil) {
        return new Promise(function (resolve, reject) {

            var data = "action=setProfil&profil=" + JSON.stringify(profil);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/ProfilUtils.php');
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

    function SetSetting(setting) {
        return new Promise(function (resolve, reject) {

            var data = "action=setSetting&setting=" + JSON.stringify(setting);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/settingUtils.php');
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


    function getPopup(iduser) {
        return new Promise(function (resolve, reject) {

            var data = "action=getPopupbyIduser&iduser=" + iduser;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/PopupUtils.php');
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

    function setProspect(prospect) {
        return new Promise(function (resolve, reject) {

            var data = "action=setProspect&prospect=" + JSON.stringify(prospect);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/ProspectUtils.php');
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

    function GetIdProspect(crypt, idprofil) {
        return new Promise(function (resolve, reject) {
            var data = "action=getIdProspect&crypt=" + crypt + "&idprofil=" + idprofil;
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
        console.log(response);
        const idUserConnect = response.IdUserConnect;
        console.log(idUserConnect);
        if (!idUserConnect) {
            var leadModal = document.getElementById('leadModal');
            var manualOpenButton = document.getElementById('manualOpenButton');
            if (manualOpenButton) {
                manualOpenButton.addEventListener2('click', function () {
                    leadModal.style.display = 'block';
                });
            }
            var iduser = document.getElementById('iduser').value;
            var idprofil = document.getElementById('idprofil').value;
            var crypt = document.getElementById('crypt').value;
            var formLead = document.getElementById('form-lead');

            console.log(crypt);
            console.log(idprofil);
            GetIdProspect(crypt, idprofil).then(function (response) {
                const idProspect = response.idProspect;
                console.log(idProspect);
                console.log(iduser);
                var prospect = {};
                prospect.crypt = crypt;
                prospect.idprofil = idprofil;
                var redirectLinks = document.querySelectorAll('.redirectLink');
                redirectLinks.forEach(function (redirectLink) {
                    redirectLink.addEventListener2('click', function () {
                        prospect.click = redirectLink.attributes.idlink.value;
                        console.log(prospect);
                        setProspect(prospect).then(function (data) {
                            console.log(data);
                        });
                    });
                });
                getPopup(iduser).then(function (data) {
                    console.log(data);

                    var popup = JSON.parse(data);
                    if (popup.actif === "1") {
                        var delay = parseInt(popup.time, 10);
                        if (delay > 0) {
                            setTimeout(function () {
                                leadModal.style.display = 'block';
                            }, delay * 1000);
                        }

                        // Sélectionnez l'élément qui contient les messages du chatbot
                        var chatbotContainer = document.getElementById('conversation');

// Fonction pour exécuter lorsque des mutations sont observées
                        var callback = function (mutationsList, observer) {
                            for (var mutation of mutationsList) {
                                if (mutation.type === 'childList') {
                                    mutation.addedNodes.forEach(function (node) {
                                        if (node.classList && node.classList.contains('chatbot-message')) {
                                            console.log("Nouveau message détecté: ", node);
                                        }
                                    });
                                }
                            }
                        };
// Sélectionnez l'élément qui contient les messages du chatbot
                        var chatbotContainer = document.getElementById('conversation');

// Fonction pour exécuter lorsque des mutations sont observées
                        var callback = function (mutationsList) {
                            for (var mutation of mutationsList) {
                                if (mutation.type === 'childList') {
                                    mutation.addedNodes.forEach(function (node) {
                                        // Vérifiez si le nouveau nœud contient l'élément souhaité
                                        var inputGroupLead = node.querySelector('.input-group-lead');
                                        if (inputGroupLead) {
                                            console.log("Nouveau 'input-group-lead' détecté: ", inputGroupLead);
                                            // Appliquez votre logique existante ici
                                            attachEventListeners(inputGroupLead);
                                        }
                                    });
                                }
                            }
                        };

// Fonction pour attacher des écouteurs d'événements
                        function attachEventListeners(inputGroupLead) {
                            var submitLeadModals = inputGroupLead.querySelectorAll('.submitLeadModal');
                            console.log("Nombre de modals trouvés: ", submitLeadModals.length);

                            submitLeadModals.forEach(function (submitLeadModal, index) {
                                console.log("Modal n°", index, " : ", submitLeadModal);

                                submitLeadModal.addEventListener2('click', function () {
                                    var fields = ['nom', 'prenom', 'email', 'tel', 'message'];
                                    var prospect = {};

                                    for (var i = 0; i < fields.length; i++) {
                                        var id = 'lead' + fields[i].charAt(0).toUpperCase() + fields[i].slice(1);
                                        var fieldElement = document.getElementById(id);
                                        // Observation de chaque élément de champ et de sa valeur
                                        console.log("Champ: ", id, ", Valeur: ", fieldElement ? fieldElement.value : "non trouvé");
                                        if (fieldElement) prospect[fields[i]] = fieldElement.value;
                                    }
                                    console.log("Objet prospect: ", prospect);

                                    if (Object.keys(prospect).length > 0) {
                                        setProspect(prospect).then(function (data) {
                                            console.log("Réponse de setProspect: ", data);
                                            if (data) {
                                                submitLeadModal.style.backgroundColor = "#28a745";
                                                fieldElement.addClass('border-success');
                                                var modalTitre = document.getElementById('modalTitre');
                                                var modalTexte = document.getElementById('modalTexte');
                                                modalTitre.textContent = popup.titre_envoyer;
                                                modalTexte.textContent = popup.text_envoyer;
                                            } else {
                                                fieldElement.addClass('border-danger');
                                            }
                                        });
                                    } else {
                                        console.log("L'objet prospect est vide");
                                    }
                                });
                            });
                        }

// Création d'une instance de MutationObserver avec la fonction callback
                        var observer = new MutationObserver(callback);

// Options de configuration de l'observer (dans ce cas, observer les ajouts d'enfants)
                        var config = {childList: true, subtree: true};

// Commencez à observer le chatbotContainer pour les mutations configurées
                        observer.observe(chatbotContainer, config);

                    }
                });

            });

        } else {
            var EditInfosProfils = document.getElementsByClassName('EditInfosProfil');

            Array.from(EditInfosProfils).forEach(function (EditInfosProfil) {
                EditInfosProfil.addEventListener2('click', function () {
                    editProfilModal.style.display = 'block';
                });
            });
            var editProfilModal = document.getElementById('editProfilModal');

            var editProfilClose = document.getElementById('editProfilClose');
            editProfilClose.addEventListener2('click', (event) => {
                editProfilModal.style.display = 'none';
            });

            var submitEditProfil = document.getElementById('submitEditProfil');
            submitEditProfil.addEventListener2('click', (event) => {
                var user = {};

                user.iduser = idUserConnect;
                user.nom = document.getElementsByName('userNom')[0].value;
                user.prenom = document.getElementsByName('userPrenom')[0].value;
                user.email = document.getElementsByName('userEmail')[0].value;
                user.tel = document.getElementsByName('userTel')[0].value;
                console.log(user);
                setUser(user).then(function (data) {
                    var json = JSON.parse(data);
                    var textAlertProfil = document.getElementById('textAlertProfil');
                    if (textAlertProfil) { // Vérifiez que textAlertProfil n'est pas null
                        textAlertProfil.innerHTML = '';
                        textAlertProfil.style.display = 'none';
                    }
                    $('.is-invalid').removeClass('is-invalid');
                    $('.is-valid').removeClass('is-valid');
                    $('.text-danger').hide();
                    console.log(json);
                    if (json.hasOwnProperty('success')) {
                        if (json.success.hasOwnProperty('false')) {
                            errors = json.success.false;
                            for (var name in errors) {
                                $('input[name=' + name + ']').addClass('is-invalid');
                                textAlertProfil.innerHTML = errors[name];
                            }
                        }
                        if (json.success.hasOwnProperty('true')) {
                            success = json.success.true;
                            console.log(success);
                            for (var key in success) {
                                console.log(key);
                                console.log(success[key]);
                                $('input[name=' + key + ']').addClass('is-valid');
                                if (success[key].hasOwnProperty('emailChanged')) {
                                    if (success[key].emailChanged == true) {
                                        textAlertProfil.innerHTML = 'Un email de confimation a été envoyer à  l\'adresse suivante : ' + success[key].newEmail;
                                        textAlertProfil.style.display = 'block';
                                    }
                                }
                            }
                        }

                        if (json.hasOwnProperty('emailChanged')) {
                            if (json.emailChanged == "true") {
                                $('input[name=userEmail]').addClass('is-valid');
                                $('input[name=userEmail]').addClass('is-valid');
                                $('#alertEmailChanged').css('display', 'block');
                                $('#textAlert').empty();
                                $('#textAlert').prepend('Un email de confimation a été envoyer à  l\'adresse suivante : ' + json.newEmail);
                            }
                        }
                    }
                });
            });
            var quill = new Quill('#div-description-profil', {
                theme: 'snow' // ou 'bubble'
            });
            quill.on('text-change', function () {
                var profil = {};
                profil.iduser = idUserConnect;
                profil.idprofil = document.getElementById('idprofil').value;
                profil.description = quill.root.innerHTML;

                console.log(profil);

                SetProfil(profil).then(function (result) {
                    if (result) {
                        areaDescription.classList.add('is-valid');
                    }
                });
            });

            //taille des icones
            var rangeInput = document.getElementById('customRange');
            rangeInput.addEventListener2('change', function () {
                console.log('change');
                var dimension = this.value;

                // Calculer la largeur et la hauteur en fonction de la dimension
                var width, height;
                switch (dimension) {
                    case '1':
                        width = '170px';
                        height = '170px';
                        break;
                    case '2':
                        width = '90px';
                        height = '90px';
                        break;
                    case '3':
                        width = '60px';
                        height = '60px';
                        break;
                }

                // Sélectionner toutes les icônes
                var icons = document.querySelectorAll('.previewIcon');

                // Mettre à jour la largeur et la hauteur de chaque icône
                for (var i = 0; i < icons.length; i++) {
                    icons[i].style.width = width;
                    icons[i].style.height = 'auto'; // Pour maintenir le ratio d'aspect
                }
                var setting = {};
                setting.iduser = idUserConnect;
                setting.number_icon = dimension;
                console.log(setting);
                SetSetting(setting).then(function (result) {
                    console.log(result);
                    if (result) {
                        areaDescription.classList.add('is-valid');
                    }
                });
            });
            rangeInput.dispatchEvent(new Event('input'));

            var backgroundInput = document.getElementById('background_color');
            backgroundInput.addEventListener2('input', function () {
                updateSetting('background_color', this.value);
            });

            /* var textProfilInput = document.getElementById('text_profil');
 textProfilInput.addEventListener2('input', function () {
                updateSetting('text_profil', this.value);
            });
       */


            function updateSetting(key, value) {
                var setting = {};
                setting.iduser = idUserConnect;
                setting[key] = value;
                console.log(setting);
                SetSetting(setting).then(function (result) {
                    console.log(result);
                    if (result) {
                        areaDescription.classList.add('is-valid');
                    }
                });
            }

            // basculement mes infos/setting
            var btnInformation = document.getElementById('btn-information');
            var btnSetting = document.getElementById('btn-setting');
            var informationDiv = document.getElementById('informationDiv');
            var settingDiv = document.getElementById('settingDiv');
            var btnSubmit = document.getElementById('submitEditProfil');


            btnInformation.addEventListener2('click', function () {
                informationDiv.style.display = 'block';
                btnSubmit.style.display = 'block';
                settingDiv.style.display = 'none';

                // Add active class to the button
                btnInformation.classList.add('active');
                btnSetting.classList.remove('active');

                // Change icon color
                document.querySelector("#btn-information .icon").style.color = "#ffffff"; // White for active state
                document.querySelector("#btn-setting .icon").style.color = "#6c757d"; // Grey for inactive state
            });

            btnSetting.addEventListener2('click', function () {
                btnSubmit.style.display = 'none';
                informationDiv.style.display = 'none';
                settingDiv.style.display = 'block';

                // Add active class to the button
                btnInformation.classList.remove('active');
                btnSetting.classList.add('active');

                // Change icon color
                document.querySelector("#btn-setting .icon").style.color = "#ffffff"; // White for active state
                document.querySelector("#btn-information .icon").style.color = "#6c757d"; // Grey for inactive state
            });


            btnInformation.click();
            console.log("window.jQuery");
            console.log(window.jQuery);
            if (window.jQuery) {
                // Utilisez jQuery pour attacher l'événement
                $('#icon_liste').change(function () {
                    var setting = {};
                    setting.iduser = idUserConnect;
                    if ($(this).prop('checked')) {
                        setting.est_liste = 1;
                        console.log('La case à cocher est sélectionnée');
                    } else {
                        setting.est_liste = 0;
                        console.log('La case à cocher n\'est pas sélectionnée');
                    }
                    SetSetting(setting).then(function (result) {
                        console.log(result);
                    });

                });
            }


            // Votre fonction UploadData
            function UploadData(method, fileName, file, iduser) {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    var formData = new FormData();
                    formData.append("iduser", iduser);
                    formData.append("method", method);
                    formData.append(fileName, file);

                    xhr.open("POST", dir + "/ajax/UploadDataUtils.php");
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

// Votre fonction updateSetting
            function updateSetting(key, value) {
                var setting = {};
                setting.iduser = idUserConnect;
                setting[key] = value;
                console.log(setting);
                SetSetting(setting).then(function (result) {
                    console.log(result);
                    if (result) {
                        areaDescription.classList.add('is-valid');
                    }
                });
            }

// Écouteur d'événements pour le changement de couleur
            var backgroundInput = document.getElementById('background_color');
            backgroundInput.addEventListener2('input', function () {
                if (document.getElementById('useColor').checked) {
                    updateSetting('background_color', this.value);
                }
            });

        }
    });

});



















