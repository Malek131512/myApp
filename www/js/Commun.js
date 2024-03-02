function showLoader() {
    var loader = document.querySelector('.wrapper');
    if (loader) {
        loader.style.display = 'flex';
    }
}

function hideLoader() {
    var loader = document.querySelector('.wrapper');
    if (loader) {
        loader.style.display = 'none';
    }
}

const scripts = document.querySelectorAll("script");
let dir = "https://bip-me.fr/bip";
const originalAddEventListener = EventTarget.prototype.addEventListener;

// Sauvegarder la référence originale de addEventListener
EventTarget.prototype.addEventListener2 = function(type, listener, options) {
    if (type === 'click') showLoader();
    if (type === 'DOMContentLoaded' && typeof cordova !== 'undefined') {
        type = 'deviceready';
    }
    // Vérifier si un écouteur pour ce type existe déjà sur cet élément
    if (!this.eventListenerTypes) {
        this.eventListenerTypes = {};
    }

    if (!this.eventListenerTypes[type] || (type === 'DOMContentLoaded' || 'deviceready')) {
        // Si aucun écouteur n'existe pour ce type, l'ajouter et marquer comme ajouté
        this.eventListenerTypes[type] = true;
        originalAddEventListener.call(this, type, listener, options);
    } else {
        // Si un écouteur existe déjà pour ce type, ne rien faire (ou gérer différemment)
        console.log(`Un écouteur pour l'événement ${type} existe déjà sur cet élément.`);
    }
    if (type === 'click') hideLoader();
};

for (const script of scripts) {
    if (script.getAttribute('data-name')) {
        window.myGlobalDir = dir = script.getAttribute('data-name');
        break;
    }
}
// Sélectionnez tous les éléments avec la classe "close"
const closeButtons = document.querySelectorAll(".close");

// Ajoutez un gestionnaire d'événement clic à chaque bouton "close"
closeButtons.forEach((button) => {
    button.addEventListener2("click", () => {
        // Trouvez la modal parente en remontant dans la hiérarchie des éléments
        let modal = button.closest(".modal-backdrop");

        // Vérifiez si la modal a été trouvée
        if (modal) {
            // Cachez la modal en modifiant son style
            modal.style.display = "none";
        }
    });
});

function GetUserInfos(iduser) {
    return new Promise(function (resolve, reject) {
        var data = "action=GetUserInfos&iduser=" + iduser;
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

document.addEventListener2('DOMContentLoaded', function () {
   console.log("COMMUN !!! DOMContentLoaded");
    const items = document.querySelectorAll(".item-footer");

    if (items.length > 0) { // Vérifie si des éléments ont été trouvés
        items.forEach(item => {
            if (item) { // Vérifie si l'élément existe
                item.addEventListener2("touchstart", function () {
                    this.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                    this.style.transform = "scale(1.1)";
                });

                item.addEventListener2("touchend", function () {
                    this.style.backgroundColor = "";
                    this.style.transform = "scale(1)";
                });
            }
        });
    }
    var navBarBtn = document.getElementById('navBarBtn');
    var dropDownMenu = document.getElementById('dropDownMenu');

    navBarBtn.addEventListener2('click', function () {
        if (dropDownMenu.classList.contains('open')) {
            dropDownMenu.parentElement.classList.remove('is-active');
            dropDownMenu.classList.remove('open');
        } else {
            dropDownMenu.parentElement.classList.add('is-active');
            dropDownMenu.classList.add('open');
        }
    });


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

        const redirects = document.querySelectorAll('.redirect');
        console.log(redirects);

        for (const redirect of redirects) {
            redirect.addEventListener2('click', redirectFunction);
        }

        function redirectFunction(event) {
            const redirect = event.target;
            for (const attr of redirect.attributes) {
                if (attr.name == 'controller') $.ajax({
                    type: "POST", url: dir + '/ajax/AjaxUtils.php', data: {
                        action: 'setController', controller: attr.value
                    }, success: function (data) {
                        var json = JSON.parse(data);
                        window.location.replace("index.php?" + json.name);
                    }
                });

            }

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

        async function isLinkAccessible(url) {
            try {
                const response = await fetch(url, {mode: 'no-cors'});
                return true;
            } catch (error) {
                return false;
            }
        }

        function Redirect(url) {
            fetch(url, {mode: 'no-cors'})
                .then((response) => {
                    console.log(response); // Affiche la réponse (qui sera opaque)
                })
                .catch((error) => {
                    console.error(error);
                });
            isLinkAccessible(url)
                .then((isAccessible) => {
                    if (isAccessible) {
                        window.location.href = url;
                    } else {
                        alert(MessageNotAccesible);
                        console.log(`Ce lien est non accessible`);
                    }
                    console.log(`Le lien est ${isAccessible ? 'accessible' : 'non accessible'}`);
                })
                .catch((error) => {
                    console.error(`Erreur lors de la vérification du lien : ${error}`);
                });
        }

        var redirectLink = document.querySelectorAll('.redirectLink');

        redirectLink.forEach((Link) => {
            console.log(Link);
            if (Link !== null) {
                var est_custom = (Link.attributes && 'est_custom' in Link.attributes) ? Link.attributes.est_custom.value : null;
                var idicon = (Link.attributes && 'idicon' in Link.attributes) ? Link.attributes.idicon.value : null;
                var idlink = (Link.attributes && 'idlink' in Link.attributes) ? Link.attributes.idlink.value : null;
                var est_direct = (Link.attributes && 'est_direct' in Link.attributes) ? (parseInt(Link.attributes.est_direct.value) == 1) ? true : false : false;

                if (idicon !== null && idlink !== null) {
                    if (parseInt(est_custom) == 1) {
                        getIconCustomById(parseInt(idicon)).then(icon_custom => {
                            getLinkById(parseInt(idlink)).then(link => {
                                var url = link.url;
                                console.log(url);
                                if (est_direct) {
                                    Redirect(url);
                                } else {
                                    Link.addEventListener2('click', function () {
                                        Redirect(url);
                                    });
                                }
                            });
                        });
                    } else {
                        getIconById(parseInt(idicon)).then(icon => {
                            getLinkById(parseInt(idlink)).then(link => {
                                var url = (icon.est_url == "0") ? icon.pre_url + link.url : link.url;
                                switch (parseInt(icon.idicon)) {
                                    case 1: // Déclencher l'envoi d'un email avec la valeur de link.url
                                        Link.addEventListener2('click', function () {
                                            window.location.href = 'mailto:' + link.url;
                                        });
                                        if (est_direct) {
                                            window.location.href = 'mailto:' + link.url;
                                        }
                                        break;
                                    case 2: // Déclencher l'appel téléphonique avec la valeur de link.url
                                        Link.addEventListener2('click', function () {
                                            window.location.href = 'tel:' + link.url;
                                        });
                                        if (est_direct) {
                                            window.location.href = 'tel:' + link.url;
                                        }
                                        break;
                                    case 3:
                                        var iduser = document.getElementById('iduser').value;
                                        console.log('iduser', iduser);
                                        console.log(est_direct);
                                        Link.addEventListener2('click', function () {
                                            GetUserInfos(iduser).then(function (data) {
                                                var user = {};
                                                user.prenom = data.user.prenom;
                                                user.nom = data.user.nom;
                                                user.entreprise = data.user.entreprise;
                                                user.tel = link.url;
                                                user.email = link.url2;
                                                console.log(user);
                                                var vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${user.prenom} ${user.nom}\nORG:${user.entreprise}\nTEL:${user.tel}\nEMAIL:${user.email}\nEND:VCARD`;                                             // en numéro de téléphone la valeur de link.url et en adresse email la valeur de link.url2
                                                var vCardBlob = new Blob([vCardData], {type: 'text/vcard'});
                                                var vCardUrl = URL.createObjectURL(vCardBlob);
                                                window.open(vCardUrl);
                                            });
                                        });
                                        if (est_direct) {
                                            Link.click();
                                        }
                                        break;
                                    case 4:
                                        // Déclencher l'envoi d'un SMS vers la valeur de link.url
                                        Link.addEventListener2('click', function () {
                                            window.location.href = 'sms:' + link.url;
                                        });
                                        if (est_direct) {
                                            window.location.href = 'sms:' + link.url;
                                        }

                                        break;
                                    default:
                                        Link.addEventListener2('click', function () {
                                            Redirect(url);
                                        });
                                        if (est_direct) {
                                            Redirect(url);
                                        }
                                        break;
                                }
                            });
                        });
                    }
                }
            }
        });
    });
});


