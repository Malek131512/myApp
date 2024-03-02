if (typeof dir === 'undefined') {
    let dir = window.myGlobalDir;
}
document.addEventListener2('DOMContentLoaded', function () {

    var directStateCount = 0;  // Compteur d'état direct

    function observeIconListElements(callback) {
        var parentElement = document.getElementById("MesLiens");
        console.log('Parent element:', parentElement);

        var divIcons = parentElement.querySelectorAll(".div-icon-style-1");

        var observer;  // Déclarer l'observateur ici.

        observer = new MutationObserver(function () {
            divIcons = parentElement.querySelectorAll(".div-icon-style-1");
            console.log('Mutation detected:', divIcons);
            callback(divIcons, observer);  // Passer l'observateur au rappel.
        });

        observer.observe(parentElement, {
            childList: true, subtree: true
        });

        callback(divIcons, observer);  // Appeler le rappel une fois avant d'observer les mutations et passer l'observateur.

        return observer;
    }

    function DirectLink(divIcons, IdLink, IdIcon, bool) {
        console.log("DirectLink called with bool:", bool);
        location.reload();

        /* divIcons.forEach(function (divIcon) {
            var img = divIcon.querySelector("img");
            var imgIdLink = img.getAttribute("idlink");
            var imgIdIcon = img.getAttribute("idicon");
            var divEstVisible = document.getElementById("div-est_visible");

            console.log("Processing divIcon with imgIdLink:", imgIdLink, "and imgIdIcon:", imgIdIcon);

            if (!divIcon.classList.contains('processed')) {
                if (parseInt(imgIdLink) === parseInt(IdLink) && parseInt(imgIdIcon) === parseInt(IdIcon)) {
                    directStateCount++;                        // Incrémenter le compteur d'état direct
                     if (bool) {
                        divIcon.style.display = "block";
                        console.log("Matching icon found, display set to:", divIcon.style.display);

                        let info = divIcon.querySelector("span");
                        if (info === null) {  // add info if it doesn't exist
                            divEstVisible.style.display = "none";
                             info = document.createElement("span");
                              info.textContent = "Mode lien direct activé!";
                            info.style.display = "inline-block";
                            info.style.textAlign = "center";
                            info.style.backgroundColor = "#f9f9f9";
                            info.style.margin = "5px";
                            info.style.padding = "5px";
                            divIcon.appendChild(info);
                            var btnCreateIcon = document.querySelectorAll(".non-draggable-icon");
                            btnCreateIcon.forEach(function (element) {
                                element.style.display = "none";
                            });
                            console.log("Info added to matching icon");
                        }
                    } else {
                        divEstVisible.style.display = "block";
                         var btnCreateIcon = document.querySelectorAll(".non-draggable-icon");
                         btnCreateIcon.forEach(function (element) {
                            element.style.display = "inline-block";
                        });
                        divIcon.style.display = "inline-block";
                        console.log("Matching icon found, display set to:", divIcon.style.display);

                        let info = divIcon.querySelector("span");
                        if (info !== null) {  // remove info if it exists
                            divIcon.removeChild(info);
                            console.log("Info removed from matching icon");
                        }
                    }

                } else {
                    divIcon.style.display = bool ? "none" : "inline-block";
                    console.log("Non-matching icon found, display set to:", divIcon.style.display);
                }
                divIcon.classList.add('processed');
            }
        });


        // Vérifier si le compteur d'état direct est égal à 2 et actualiser la page
        if (directStateCount === 2) {
            console.log("Direct state updated twice, refreshing the page...");
            location.reload();
        } */
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

    async function initMesLiens(iduser) {
        try {
            if(document.getElementById("idprofil"))  var idprofil = document.getElementById("idprofil").value;
            var loaderTimeout = setTimeout(showLoader, 10); // Show loader if more than 1s
            var links = await getLinksByIdUserIdProfil(iduser, idprofil);
            var result = {};

            links.sort((a, b) => a.ordre - b.ordre); // Trie en ordre croissant

            for (const link of links) {

                if (link.est_direct === "1") {
                    result.hasDirectLink = true;
                    result.directLinkId = link.idlink;
                    result.directIconId = link.idicon;
                }
            }

            for (const link of links) {
                document.getElementById("est_fichierUpload").style.display = (link.est_direct === "1") ? "block" : "none";


                if (parseInt(link.est_custom) == 1) {
                    const icon = await getIconCustomById(parseInt(link.idicon));
                    addIcon(icon.idicon_custom, result, link.idlink, (link.libelle !== null) ? link.libelle : icon.libelle, link.est_custom, 1, icon.path_logo, link.est_direct, link.ordre, link.est_visible);
                } else {
                    const icon = await getIconByIdicon(parseInt(link.idicon));
                    addIcon(link.idicon, result, link.idlink, (link.libelle !== null) ? link.libelle : icon.libelle, false, icon.logo_forme, icon.path, link.est_direct, link.ordre, link.est_visible);
                }
            }

            clearTimeout(loaderTimeout); // Clear timeout
            hideLoader(); // Hide loader

            var sortable = new Draggable.Sortable(document.querySelector('#MesLiens'), {
                draggable: '.icon-drag', handle: '.drag-handle', delay: {
                    mouse: 0, touch: 1000,
                },
            });
            sortable.on('sortable:stop', async function (event) {
                const iconsCollection = document.getElementById('MesLiens').getElementsByClassName('draggable-icon');
                const icons = Array.from(iconsCollection).filter(icon => !icon.classList.contains('draggable-mirror') && !icon.classList.contains('draggable--original'));
                let orderedIdLinks = [];

                icons.forEach(icon => {
                    let editLink = icon.getElementsByClassName('editLink');
                    if (editLink.length > 0) {
                        orderedIdLinks.push(editLink[0].getAttribute('idlink'));
                    }
                });

                // Étape 2 : Créer le tableau final des liens en utilisant l'ordre du tableau
                let orderedLinks = orderedIdLinks.map((idlink, index) => ({
                    idlink: idlink, ordre: index + 1 // L'ordre commence à 1
                }));

                const result = await SetLinks(orderedLinks);
                console.log(result);
                if (result) {
                    // Vous pouvez faire quelque chose ici si le résultat est vrai
                }
            });
        } catch (error) {
            console.error("An error occurred:", error);
            // Gérez l'erreur comme vous le jugez approprié
        }
    }

    function getNameIcon(idicon) {
        return (idicon == 1) ? "Email" : (idicon == 2) ? "Tel" : (idicon == 3) ? "Contact" : (idicon == 4) ? "Message" : idicon;
    }

    function addIcon(idicon, result, idlink, iconName, est_custom = false, logo_forme = 1, path = null, est_direct = false, ordre, est_visible) {
        return new Promise((resolve) => {
            var divElement = document.createElement("div");
            divElement.classList.add("div-icon-style-1", "icon-drag", "draggable-icon", "icon-container");
            // Ajout d'une poignée pour glisser-déposer
            var handleDiv = document.createElement("div");
            handleDiv.classList.add("drag-handle");

            // Ajout de l'icône Font Awesome pour la poignée de glissement
            var handleIcon = document.createElement("i");
            handleIcon.classList.add("fa-solid", "fa-grip-vertical");
            handleDiv.appendChild(handleIcon);

            // Ajout de la poignée à l'élément principal
            divElement.appendChild(handleDiv);

            if (result.hasDirectLink) {
                divElement.style.display = (est_direct == '1') ? "block" : "none";

                if (est_direct == '1') {
                    var info = document.createElement("span");
                    info.textContent = "Mode lien direct activé!";
                    info.style.display = "block";
                    info.style.textAlign = "center";
                    info.style.backgroundColor = "#f9f9f9";
                    info.style.margin = "5px";
                    info.style.padding = "5px";
                    divElement.appendChild(info);
                    var btnCreateIcon = document.querySelectorAll(".non-draggable-icon");
                    btnCreateIcon.forEach(function (element) {
                        element.style.display = "none";
                    });
                }

            } else {
                // Supprimer le message d'information s'il existe
                var info = divElement.querySelector("span");
                var btnCreateIcon = document.querySelectorAll(".non-draggable-icon");
                btnCreateIcon.forEach(function (element) {
                    element.style.display = "inline-table";
                });
                if (info) {
                    divElement.removeChild(info);
                }
            }
            var imgElement = document.createElement("img");
            var srcIcon = dir + '/img/';
            srcIcon += (path !== null && est_custom) ? "icon_custom/" + path : getNameIcon(idicon) + ".png";
            imgElement.setAttribute("src", srcIcon);
            imgElement.classList.add("icon-style-1", (parseInt(logo_forme) == 2) ? "social-icon-auto" : "social-icon", "editLink");
            imgElement.setAttribute("idlink", idlink);
            imgElement.setAttribute("idicon", idicon);
            imgElement.setAttribute("est_direct", est_direct);
            imgElement.setAttribute("iconcustom", est_custom);
            divElement.appendChild(imgElement);
            if (parseInt(est_visible) == 0) {
                console.log(parseInt(est_visible)+' '+idlink);
                console.log(imgElement);
                // Création de l'icône "œil fermé"
                addMaskingAndEyeIconByIdLink(idlink,imgElement);
            } else {
                removeMaskingAndEyeIconByIdLink(idlink);
            }

            var pElement = document.createElement("p");
            pElement.classList.add("text-center");
            pElement.classList.add("text-ajust");
            pElement.textContent = iconName;

            divElement.appendChild(pElement);
            var mesLiensContainer = document.getElementById("MesLiens");
            var length = mesLiensContainer.children.length - 1;
            mesLiensContainer.appendChild(divElement);
            resolve();
        });
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

    function getLinkById(idlink) {
        return new Promise(function (resolve, reject) {
            var data = "action=getLinkById&idlink=" + idlink;
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

    function getIconById(idicon) {
        return new Promise(function (resolve, reject) {
            var data = "action=getIconById&idicon=" + idicon;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/IconUtils.php');
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

    function getIconCustomById(idicon_custom) {
        return new Promise(function (resolve, reject) {
            var data = "action=getIconCustomById&idicon_custom=" + idicon_custom;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/IconCustomUtils.php');
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

    function GetUserInfos() {
        return new Promise(function (resolve, reject) {
            var data = "action=GetUserInfos";
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

    function DeleteLink(idlink) {
        return new Promise(function (resolve, reject) {

            var data = "action=DeleteLink&idlink=" + idlink;
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

    function SetLinkInModal(link, icon, type) {
        addLinkModal.style.display = 'block';
        var idicon = parseInt(link.idicon);
        var nameIcon = getNameIcon(idicon);
        var labelIcon = (parseInt(icon.est_url) ? (idicon == 1) ? "Adresse Email" : (idicon == 2) ? "Numéro de téléphone" : (idicon == 3) ? "Numéro de téléphone" : (idicon == 4) ? "Numéro de téléphone" : "Nom d'utilisateur" : "Lien");

        var previewIcon = document.getElementById("preview-edit-icon");        //'/bip/IconesReseauPerso/' + path : '/bip/img/' + idreseau + '.png';
        var srcIcon = dir + '/img/';
        console.log(link);
        console.log(icon);
        srcIcon += (parseInt(link.est_custom) == 1) ? "icon_custom/" + icon.path_logo : icon.logo;
        previewIcon.setAttribute("src", srcIcon);
        previewIcon.setAttribute("idicon", idicon);
        previewIcon.setAttribute("idlink", link.idlink);
        document.getElementById("est_custom").value = (link.est_custom) ? 1 : 0;
        var previewLabel = document.getElementById("preview-label-icon");
        previewLabel.innerHTML = (link.libelle !== null) ? link.libelle : icon.libelle;
        document.getElementById('link_value').placeholder = labelIcon;
        document.querySelector('label[for="link_value"]').textContent = labelIcon;
        addIconModal.style.display = 'none';
        var divEstFicher = document.getElementById("div-est_fichier");
        var divEstDirect = document.getElementById("div-est_direct");

        divEstDirect.classList.remove("hidden");
        document.getElementById('link_value2').style.display = 'none';
        document.getElementById('btnDeleteLink').value = link.idlink;
        document.getElementById('idicon').value = link.idicon;
        document.getElementById('idlink').value = link.idlink;
        document.getElementById('link_value').value = link.url;
        document.getElementById('link_name').value = link.libelle;
        document.getElementById('link_description').value = link.description;
        document.getElementById('idprofil').value = link.idprofil;
        document.getElementById('est_visible').checked = (link.est_visible === "1") ? true : false;
        document.getElementById('est_direct').checked = (link.est_direct === "1") ? true : false;
        document.getElementById('est_fichier').checked = (link.est_fichier === "1") ? true : false;

        $('#est_visible').bootstrapToggle((link.est_visible == 1) ? 'on' : 'off');
        $('#est_direct').bootstrapToggle((link.est_direct == 1) ? 'on' : 'off');
        $('#est_fichier').bootstrapToggle((link.est_fichier == 1) ? 'on' : 'off');

        if (link.est_visible) {
            removeMaskingAndEyeIconByIdLink(link.idlink);
        } else {
            addMaskingAndEyeIconByIdLink(link.idlink);
        }

        document.getElementById('type').value = type;
        document.getElementById('btnSubmitAddLink').innerHTML = (type == "edit") ? 'Modifier' : 'Créer';

        GetUserInfos().then(function (data) {
            var user = data.user;
            console.log(user);
            switch (idicon) {
                case 1:
                    divEstFicher.classList.add("hidden");
                    divEstDirect.classList.add("hidden");
                    if (type == "new") document.getElementById('link_value').value = user.email;
                    break;
                case 2:
                    divEstDirect.classList.add("hidden");
                    divEstFicher.classList.add("hidden");
                    if (type == "new") document.getElementById('link_value').value = user.tel;
                    break;
                case 3:
                    divEstDirect.classList.add("hidden");
                    divEstFicher.classList.add("hidden");
                    if (type == "new") document.getElementById('link_value').value = user.tel;
                    document.getElementById('link_value2').style.display = 'block';
                    if (type == "edit") document.getElementById('link_value2').value = link.url2; else if (type == "new") document.getElementById('link_value2').value = user.email;
                    break;
                case 4:
                    divEstDirect.classList.add("hidden");
                    divEstFicher.classList.add("hidden");
                    document.getElementById('link_value').value = user.tel;
                    break;
                default:

                    break;
            }

        });
        if (link.est_custom == 1) divEstFicher.classList.remove("hidden"); else divEstFicher.classList.add("hidden");

    }

    function createIconCustom(icon_custom) {
        return new Promise(function (resolve, reject) {

            var data = "action=createIconCustom&icon_custom=" + JSON.stringify(icon_custom);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/IconCustomUtils.php');
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

    function generateHtmlIconCustom(icon_custom) {
        // Créer l'élément div principal
        var squareDiv = document.createElement("div");
        squareDiv.classList.add("square-div");

        // Créer le bouton de suppression
        var deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn", "DeleteIcon_custom");
        deleteButton.setAttribute("idicon_custom", icon_custom.idicon_custom);

        // Créer l'icône de la corbeille à l'intérieur du bouton de suppression
        var trashIcon = document.createElement("i");
        trashIcon.classList.add("fa", "fa-trash", "delete-icon");
        trashIcon.setAttribute("aria-hidden", "true");
        deleteButton.appendChild(trashIcon);

        // Ajouter le texte 'Supprimer' au bouton de suppression
        var deleteText = document.createTextNode(" Supprimer");
        deleteButton.appendChild(deleteText);

        // Ajouter le bouton de suppression au div principal
        squareDiv.appendChild(deleteButton);

        // Créer l'élément image
        var squareImage = document.createElement("img");
        squareImage.classList.add("square-img");
        squareImage.setAttribute("src", "img/icon_custom/" + icon_custom.path_logo);
        squareDiv.appendChild(squareImage);

        // Créer l'élément de texte <p>
        var textP = document.createElement("p");
        textP.setAttribute("style", "text-align: center;");
        textP.innerText = icon_custom.libelle;
        squareDiv.appendChild(textP);

        // Vous pouvez maintenant ajouter squareDiv à votre document où vous le souhaitez
        // Par exemple, pour l'ajouter à la fin du body :
        document.getElementById('DeleteIcon_customList').prepend(squareDiv);
    }

    function generateSocialIconHtml(icon_custom) {
        // Créer l'élément div principal
        var squareDiv = document.createElement("div");
        squareDiv.classList.add("square-div");

        // Créer l'élément image
        var squareImage = document.createElement("img");
        squareImage.classList.add("square-img", "social-icon", "addIcon");
        squareImage.setAttribute("src", "img/icon_custom/" + icon_custom.path_logo);
        squareImage.setAttribute("idicon", icon_custom.idicon_custom);
        squareImage.setAttribute("iconcustom", "1"); // Vous pouvez remplacer "1" par la valeur appropriée si nécessaire
        squareDiv.appendChild(squareImage);

        // Créer l'élément de texte <p>
        var textP = document.createElement("p");
        textP.classList.add("text-center", "text-ajust");
        textP.innerText = icon_custom.libelle; // Assurez-vous que 'libelle' est la propriété correcte dans icon_custom
        squareDiv.appendChild(textP);

        // Ajouter squareDiv à l'élément avec l'ID 'IconsCustomList'
        var container = document.getElementById("IconsCustomList");
        container.prepend(squareDiv);
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


    function DeleteIconCustom(idicon_custom) {
        return new Promise(function (resolve, reject) {
            var data = "action=DeleteIconCustom&idicon_custom=" + idicon_custom;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/IconCustomUtils.php');
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

    function removeMaskingAndEyeIconByIdLink(idlink,imgElement= null) {
        // Trouver l'élément img en utilisant l'attribut idlink
        if(imgElement == null) var imgElement = document.querySelector(`img[idlink="${idlink}"]`);

        if (imgElement) {
            // Supprimer le filtre gris
            imgElement.style.filter = "none";

            // Trouver le parent div de imgElement
            var divElement = imgElement.closest(".icon-container");

            if (divElement) {
                // Trouver l'icône "œil fermé" dans divElement
                var eyeIcon = divElement.querySelector(".fa-eye-slash");

                if (eyeIcon) {
                    // Supprimer l'icône "œil fermé"
                    divElement.removeChild(eyeIcon);
                }
            }
        }
    }

    function addMaskingAndEyeIconByIdLink(idlink,imgElement = null) {
        // Trouver l'élément img en utilisant l'attribut idlink
        if(imgElement == null) var imgElement = document.querySelector(`img[idlink="${idlink}"]`);
        console.log(imgElement);

        if (imgElement) {
            // Trouver le parent div de imgElement
            var divElement = imgElement.closest(".icon-container");

            if (divElement) {
                // Créer l'icône "œil fermé"
                var eyeIcon = divElement.querySelector(".fa-eye-slash");

                if (!eyeIcon) {
                    var eyeIcon = document.createElement("i");
                    eyeIcon.classList.add("fa", "fa-eye-slash");
                    eyeIcon.style.position = "absolute";
                    eyeIcon.style.top = "50%";
                    eyeIcon.style.left = "50%";
                    eyeIcon.style.transform = "translate(-50%, -50%)";
                    eyeIcon.style.zIndex = "1"; // Pour s'assurer que l'icône est au-dessus de l'image
                    eyeIcon.style.fontSize = "50px"; // Augmenter la taille de l'icône
                    eyeIcon.style.marginTop = "-15px"; // Ajustement de la marge en haut
                    eyeIcon.style.filter = "drop-shadow(0 0 10px rgba(0, 0, 0, 2))";
                    eyeIcon.style.color = "white";
                    // Ajouter l'icône au div parent
                    divElement.appendChild(eyeIcon);

                    // Ajouter un filtre gris à imgElement
                    imgElement.style.filter = "grayscale(100%)";
                }
            }
        }
    }


    GetIdUserConnect().then(function (response) {
        const idUserConnect = response.IdUserConnect;
         (async () => {
            await initMesLiens(idUserConnect);
        })();

        var ConfirmDeleteLink = document.getElementById('ConfirmDeleteModal');
        var addIconModal = document.getElementById('addIconModal');
        var addLinkModal = document.getElementById('addLinkModal');
        var openModalAddIcon = document.getElementById('createIcon');
        var btnDeleteLink = document.getElementById('btnDeleteLink');
        var btnSubmitDeleteLink = document.getElementById('btnSubmitDeleteLink');


        btnDeleteLink.addEventListener2('click', function () {
            ConfirmDeleteLink.style.display = 'block';
            document.getElementById('body').scrollTop = 0;
            document.getElementById('hidden-idlink').value = document.getElementById('btnDeleteLink').value;
        });
        btnSubmitDeleteLink.addEventListener2('click', function () {
            var idlink = document.getElementById('idlink').value;
            DeleteLink(idlink).then(function (result) {
                ConfirmDeleteLink.style.display = 'none';
                addLinkModal.style.display = 'none';
                var Links = document.querySelectorAll('.editLink');
                Links.forEach((Link) => {
                    if (Link.attributes.idlink.value == idlink) {
                        Link.parentElement.remove();
                    }
                });
            });
        });
        document.getElementById("btnCancelDeleteLink").addEventListener2("click", function () {
            ConfirmDeleteLink.style.display = 'none';
        });

        console.log(openModalAddIcon);
        openModalAddIcon.addEventListener2('click', function () {
            addIconModal.style.display = 'block';
        });

        var buttonCloseModalAddIcon = document.getElementById('buttonCloseModalAddIcon');
        buttonCloseModalAddIcon.addEventListener2('click', function () {
            addIconModal.style.display = 'none';
        });

        var iconListContainers = document.querySelectorAll('.IconsList');

        iconListContainers.forEach((iconList) => {
            iconList.addEventListener2('click', (event) => {
                var Icon = event.target.closest('.addIcon');
                if (Icon) {
                    addLinkModal.style.display = 'block';
                    var idicon = parseInt(Icon.getAttribute('idicon'));
                    if (Icon.getAttribute('iconcustom') && parseInt(Icon.getAttribute('iconcustom')) === 1) {
                        getIconCustomById(idicon).then(icon => {
                            var link = {};
                            link.idicon = icon.idicon_custom;
                            link.idlink = 0;
                            link.url = "";
                            link.libelle = icon.libelle;
                            link.description = "";
                            link.idprofil = 1;
                            link.iduser = idUserConnect;
                            link.est_visible = 1;
                            link.est_direct = 0;
                            link.est_fichier = 0;
                            link.est_custom = 1;
                            SetLinkInModal(link, icon, 'new');

                            addIconModal.style.display = 'none';
                        });
                    } else {
                        getIconById(idicon).then(icon => {
                            var link = {};
                            link.idicon = icon.idicon;
                            link.idlink = 0;
                            link.url = "";
                            link.libelle = icon.libelle;
                            link.description = "";
                            link.idprofil = 1;
                            link.iduser = idUserConnect;
                            link.est_visible = 1;
                            link.est_direct = 0;
                            link.est_fichier = 0;
                            link.est_custom = 0;
                            SetLinkInModal(link, icon, 'new');

                            addIconModal.style.display = 'none';
                        });
                    }
                }
            });
        });
        document.getElementById("link_name").addEventListener2("input", function () {
            var labelText = this.value;            // Obtenir la valeur de l'élément d'entrée
            document.getElementById("preview-label-icon").textContent = labelText;            // Mettre à jour le texte de l'élément d'aperçu avec la nouvelle valeur
        });

        var btnSubmitAddLink = document.getElementById('btnSubmitAddLink');
        btnSubmitAddLink.addEventListener2('click', async (event) => {
            var link = {};
            var est_direct = document.getElementById('profil_est_direct').value;

            link.idicon = document.getElementById('idicon').value;
            link.idlink = document.getElementById('idlink').value;
            link.url = document.getElementById('link_value').value;
            if (parseInt(link.idicon) == 3) link.url2 = document.getElementById('link_value2').value;
            link.libelle = document.getElementById('link_name').value;
            link.description = document.getElementById('link_description').value;
            link.idprofil = document.getElementById('idprofil').value;
            link.iduser = idUserConnect;
            link.est_visible = (document.getElementById('est_visible').checked) ? 1 : 0;
            if (link.est_visible) {
                removeMaskingAndEyeIconByIdLink(link.idlink);
            } else {
                addMaskingAndEyeIconByIdLink(link.idlink);
            }
            link.est_direct = (document.getElementById('est_direct').checked) ? 1 : 0;
            link.est_fichier = (document.getElementById('est_fichier').checked) ? 1 : 0;
            link.est_custom = document.getElementById('est_custom').value;
            console.log('Preparing to submit link...');
            if (link.libelle !== "") {
                if (parseInt(link.est_direct) == parseInt(est_direct)) {
                    console.log('Icons est_direct...');
                    var observer = observeIconListElements(function (divIcons, observer) {
                        if (!observer) {
                            console.log('Observer is not defined yet');
                            return;
                        }
                        console.log('Observer callback called');
                        observer.disconnect();
                        console.log('Icons observed:', divIcons);
                        console.log('link:', link);
                        //DirectLink(divIcons, link.idlink, link.idicon, true);  // Set bool as true
                        observer.observe(document.getElementById("MesLiens"), {
                            attributes: false,childList: true, subtree: true
                        });
                        console.log('Icons updated...');
                    });
                } else {
                    location.reload();
                }

                SetLink(link).then(function (idlink) {
                    console.log(link);
                    addLinkModal.style.display = 'none';
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'childList') {
                                let imgElement = document.querySelector(`img[idlink="${link.idlink}"]`);
                                if (imgElement) {
                                    if (link.est_visible) {
                                        removeMaskingAndEyeIconByIdLink(link.idlink,imgElement);
                                    } else {
                                        addMaskingAndEyeIconByIdLink(link.idlink, imgElement);
                                    }
                                    observer.disconnect(); // Arrêter l'observation
                                }
                            }
                        });
                    });

                    // Configuration de l'observateur
                    const config = {
                        attributes: false,
                        childList: true,
                        subtree: true
                    };

                    // Démarrer l'observation
                    observer.observe(document.body, config);

                    var getIconPromise = parseInt(link.est_custom) == 1 ? getIconCustomById(parseInt(link.idicon)) : getIconById(parseInt(link.idicon));
                    getIconPromise.then(function (icon) {
                        if (parseInt(link.idlink) == 0) {
                            addIcon(link.idicon, {
                                hasDirectLink: link.est_direct == '1', directLinkId: idlink, directIconId: link.idicon
                            }, idlink, link.libelle, link.est_custom, icon.logo_forme, icon.path_logo || icon.path, link.est_direct, 9999, link.est_visible).then(function () {
                                console.log('Icon added...');
                            });
                        }

                    });
                });
            }
        });


        var openModalEditLink = document.getElementById('MesLiens');

        openModalEditLink.addEventListener2('click', (event) => {
            let targetElement = event.target;
            var idlink = targetElement.getAttribute('idlink');
            var idicon = targetElement.getAttribute('idicon');
            var iconcustom = targetElement.getAttribute('iconcustom');
            var est_visible = true;

            // Vérifier si l'élément cliqué est une balise "i" avec la classe "fa-eye-slash"
            if (targetElement.tagName.toLowerCase() === 'i' && targetElement.classList.contains('fa-eye-slash')) {
                // Votre logique pour récupérer les attributs de imgElement
                let parentDiv = targetElement.closest('div');
                let imgElement = parentDiv.querySelector('.icon-style-1');
                var est_visible = false;
                if (imgElement && imgElement.tagName.toLowerCase() === 'img') {
                    idlink = imgElement.getAttribute('idlink');
                    idicon = imgElement.getAttribute('idicon');
                    iconcustom = imgElement.getAttribute('iconcustom');
                }
            }
            if (idlink !== null && idicon !== null) {
                getLinkById(idlink).then(link => {
                    addLinkModal.style.display = 'block';
                    console.log(idlink + ' ' + idicon + ' ' + iconcustom);
                    if (parseInt(iconcustom) == 1) {
                        getIconCustomById(parseInt(idicon)).then(function (icon) {
                            link.est_custom = 1;
                            SetLinkInModal(link, icon, 'edit');
                        });
                    } else {
                        getIconById(parseInt(idicon)).then(function (icon) {
                            link.est_custom = 0;
                            SetLinkInModal(link, icon, 'edit');
                        });
                    }
                });
            }
        });


        var OpenModalCreateIconCustom = document.getElementById('OpenModalCreateIconCustom');
        var modalCreateCustomIcon = document.getElementById('modalCreateCustomIcon');
        var CloseModalCreateCustomIcon = document.getElementById('buttonCloseModalCustom');


        var UploadCustomIcon = document.getElementById('UploadCustomIcon');

        OpenModalCreateIconCustom.addEventListener2('click', function () {
            modalCreateCustomIcon.style.display = 'block';
            document.getElementById('body').scrollTop = 0;
        });

        CloseModalCreateCustomIcon.addEventListener2('click', function () {
            modalCreateCustomIcon.style.display = 'none';
        });
        var imageNameInput = document.getElementById("LibelleCustomIcon");
        var previewText = document.getElementById("prewiewIconCustomText");

        imageNameInput.addEventListener2("change", function () {
            var imageName = imageNameInput.value;
            var regex = /^[a-zA-Z0-9_\- \u00C0-\u00FF]+$/;
            if (imageName !== '') {
                console.log(imageName);
                if (!regex.test(imageName)) {
                    alert("Le nom de l'icône contient des caractères non autorisés.");
                    return;
                }
            }
            previewText.innerHTML = imageName;
        });
        var fileInput = document.getElementById("CustomIconFile");
        var btnCreateIconCustom = document.getElementById("createIconCustom");

        var deleteIconCustomModal = document.getElementById("ConfirmDeleteIconCustomModal");
        var btnSubmitDeleteIconCustom = document.getElementById("btnSubmitDeleteIconCustom");

        document.getElementById("DeleteIcon_customList").addEventListener2("click", function (event) {
            // Vérifie si l'élément cliqué ou un de ses ancêtres a la classe DeleteIcon_custom
            var targetElement = event.target;
            while (targetElement != null && !targetElement.classList.contains("DeleteIcon_custom")) {
                targetElement = targetElement.parentElement;
            }

            // Si l'élément cliqué ou un de ses ancêtres a la classe DeleteIcon_custom, ouvre la modal de confirmation
            if (targetElement != null) {
                var DeleteIcon_custom = targetElement;

                var idicon_custom = DeleteIcon_custom.getAttribute("idicon_custom");

                // Ouvre la modale de confirmation
                deleteIconCustomModal.style.display = "block";

                // Lorsque l'utilisateur clique sur "Supprimer" dans la modale
                btnSubmitDeleteIconCustom.onclick = function () {
                    DeleteIconCustom(idicon_custom).then(function (data) {
                        if (data) {
                            // Ferme la modale
                            deleteIconCustomModal.style.display = "none";

                            // Supprime les éléments du DOM
                            DeleteIcon_custom.parentElement.remove();
                            var iconElement = document.querySelector(`#IconsCustomList [idicon="${idicon_custom}"]`);
                            var linkElement = document.querySelector(`#MesLiens [idicon="${idicon_custom}"]`);
                            if (linkElement) linkElement.parentElement.remove();
                            if (iconElement) iconElement.parentElement.remove();
                        }
                    });
                };
            }
        });

        document.getElementById("btnCancelDeleteIconCustom").onclick = function () {
            deleteIconCustomModal.style.display = "none";
        };

        var croppedBlob; // Variable globale pour stocker le Blob rogné
        var cropperImage = document.getElementById("cropperImage");
        var previewImage = document.getElementById("prewiewIconCustom");
        var cropperContainer = document.getElementById("cropperContainer");
        var cropButton = document.getElementById("CropCustomIcon");

        var cropperInstance = null; // Variable pour stocker l'instance de Cropper
        fileInput.addEventListener2("change", function () {
            icon_custom = {};
            icon_custom.iduser = idUserConnect;
            var imageName = imageNameInput.value;
            icon_custom.libelle = previewText.innerHTML = imageName;

            if (fileInput.files.length > 0) {
                var file = fileInput.files[0];
                var reader = new FileReader();
                reader.onload = function (event) {
                    var image = new Image();
                    image.onload = function () {
                        if (image.width === image.height) {
                            // L'image est carrée, afficher dans l'aperçu
                            previewImage.src = event.target.result;
                            btnCreateIconCustom.style.display = 'block';
                        } else {
                            // L'image n'est pas carrée, afficher Cropper
                            cropperContainer.style.display = 'block';
                            cropperImage.src = event.target.result;

                            if (cropperInstance) {
                                cropperInstance.destroy();
                            }
                            cropperInstance = new Cropper(cropperImage, {
                                aspectRatio: 1,
                                autoCropArea: 1,
                                viewMode: 1
                            });
                            cropButton.addEventListener2("click", function () {
                                var canvas = cropperInstance.getCroppedCanvas();
                                canvas.toBlob(function (blob) {
                                    croppedBlob = blob; // Stockage du Blob rogné
                                    // Afficher l'image rognée dans l'aperçu
                                    var croppedImageUrl = URL.createObjectURL(blob);
                                    previewImage.src = croppedImageUrl;
                                    btnCreateIconCustom.style.display = 'block';
                                    cropperContainer.style.display = 'none';
                                });
                            });
                        }
                    };
                    image.src = event.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                btnCreateIconCustom.style.display = 'none';
                alert("Veuillez sélectionner une image.");
            }

            // Code pour gérer l'envoi de l'image lors du clic sur "Ajouter"
        });
        btnCreateIconCustom.addEventListener2("click", function () {
            this.disabled = true;

            icon_custom = {};
            icon_custom.iduser = idUserConnect;
            var imageName = previewText.innerHTML;
            icon_custom.libelle = imageName;
            var regex = /^[a-zA-Z0-9_\- \u00C0-\u00FF]+$/;
            if (imageName !== '') {
                if (!regex.test(imageName)) {
                    alert("Le nom de l'icône contient des caractères non autorisés.");
                    return;
                }
            }
            if (croppedBlob) {
                var file = new File([croppedBlob], "image-rognee.png", {type: "image/png"});
                var dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                croppedBlob = null;
            }
            var image = fileInput.files[0];

            UploadData('customIcon', 'CustomIconFile', image, idUserConnect).then(function (data) {
                var json = JSON.parse(data);
                console.log(json);
                if (json.result) {
                    prewiewIconCustom.attributes.src.value = json.data;
                    icon_custom.path_logo = json.data;

                    createIconCustom(icon_custom).then(function (newicon) {
                        if (newicon) {
                            icon_custom.idicon_custom = newicon;
                            generateHtmlIconCustom(icon_custom)
                            generateSocialIconHtml(icon_custom);
                            fileInput.value = "";
                            imageNameInput.value = "";
                            previewText.innerHTML = "";
                            previewImage.attributes.src.value = dir + "/img/24.png";
                            btnCreateIconCustom.style.display = 'none';
                            croppedBlob = null;
                        }
                        //modalCreateCustomIcon.style.display = 'none';
                    });
                }
            });
            setTimeout(() => {
                this.disabled = false;
            }, 1000);
        });
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');

        // Ajouter un écouteur d'événement pour chaque checkbox
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener2('change', function () {
                console.log('Checkbox:', checkbox.id, 'est maintenant', checkbox.checked ? 'coché' : 'décoché');
            });
        });
        var est_fichierUpload = document.getElementById('est_fichierUpload'); // Le champ de téléchargement de fichiers
        if (window.jQuery) {
            // Utilisez jQuery pour attacher l'événement
            $('#est_fichier').change(function () {
                if ($(this).prop('checked')) {
                    est_fichierUpload.style.display = 'block';
                    console.log('La case à cocher est sélectionnée');
                } else {
                    est_fichierUpload.style.display = 'none';
                    console.log('La case à cocher n\'est pas sélectionnée');
                }
            });
        }

        est_fichierUpload.addEventListener2("change", function () {
            var file = this.files[0]; // Le fichier sélectionné
            if (file) {
                UploadData('est_fichier', 'est_fichierUpload', file, idUserConnect).then(function (data) {
                    var json = JSON.parse(data);
                    console.log(json.data);
                    if (json.result) {
                        var url = dir + '/files/' + json.data;
                        console.log(url);
                        document.getElementById('link_value').value = url;
                    }
                    // Gérez la réponse ici...
                });
            }
        });

    });
});















