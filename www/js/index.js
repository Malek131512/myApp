/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

function isUserLoggedIn() {
    return localStorage.getItem('isUserLoggedIn') === 'true';
}

// Modification de la fonction loadAndView pour inclure le rechargement des scripts
const scriptsNotLogged = [
    'js/Commun.js',
    'js/Inscription-connexion.js',
    'js/Background.js'];

const scriptsLoggedIn = [
    'js/Commun.js',
    'js/Background.js',
    'js/Accueil.js',
    'js/MesProspect.js',
    'js/Profil.js',
    'js/PhotoProfil.js',
    'js/Popup.js',
    'js/MesLiens.js',
    'js/QrCode.js',];

const mapRouteScriptsLoggedIn = [
    true,
    true,
    'home',
    'profil',
    'profil',
    'profil',
    'profil',
    'links',
    'qrcode',
];

// Fonction pour charger dynamiquement des scripts
function loadScripts() {
    const currentRouteId = localStorage.getItem('currentRouteId'); // Récupère l'ID de l'itinéraire courant
    const scriptsNeeded = isUserLoggedIn() ? scriptsLoggedIn : scriptsNotLogged;

    if (scriptsNeeded.length) {
        scriptsNeeded.forEach((script, index) => {
            const shouldLoadScript = mapRouteScriptsLoggedIn[index] === true || mapRouteScriptsLoggedIn[index] === currentRouteId;
            if (shouldLoadScript && !document.querySelector(`script[src="${script}"]`)) { // Vérifie si le script est déjà chargé et si il doit être chargé
                const scriptEl = document.createElement('script');
                scriptEl.src = script;
                // Assurez-vous que votre page contient une balise <footer> dans le <body>
                const footer = document.querySelector('footer'); // Trouve la balise <footer> dans le document
                if (footer) { // Vérifie si le footer existe
                    footer.appendChild(scriptEl); // Ajoute le script au footer
                } else {
                    console.error('Footer not found in the document');
                }
            }
        });
    }
}


/**
 * Charge une vue HTML depuis le dossier `vue` et remplace ses placeholders par les valeurs d'un objet JSON.
 * @param {string} viewName - Le nom du fichier de vue sans l'extension `.html`.
 * @param {Object} data - Un objet contenant les paires clé/valeur pour remplacer dans la vue.
 */
function loadAndView(html) {
    console.log(html); // Traiter la réponse ici
    document.getElementById('app').innerHTML = html;
    /*
      fetch(`vue/${viewName}.html`)
          .then(response => response.text())
          .then(template => {
             const filledTemplate = Object.keys(data).reduce((acc, key) => {
                  const regex = new RegExp(`{${key}}`, 'g');
                  return acc.replace(regex, data[key]);
              }, template);
            document.getElementById('app').innerHTML = data.html;
        })
        .catch(error => console.error('Erreur lors du chargement de la vue:', error));
*/
}

// Simuler une connexion utilisateur
function setUserLoggedIn(isLoggedIn) {
    localStorage.setItem('isUserLoggedIn', isLoggedIn ? 'true' : 'false');
    if(!isLoggedIn) localStorage.setItem('appToken', undefined);
}

function setAppToken(appToken) {
    localStorage.setItem('appToken', appToken);
}
function getAppToken() {
    return localStorage.getItem('appToken');
}

function changeRoute(routeId) {
    const currentRouteId = localStorage.getItem('currentRouteId');
    console.log(currentRouteId);
    localStorage.setItem('currentRouteId', routeId);
    if (routeId !== currentRouteId) {
        window.location.reload();
    }
    if (isAppEmpty()) {
        loadViewData(routeId).then(data => {
            const html = data.html;
            loadAndView(html);
        }).catch(error => {
            console.error("Erreur lors du chargement des données de la vue:", error);
        });
    }
}

function loadViewData(viewId) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://bip-me.fr/bip/ajax/LinkUtils.php', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Si la requête a réussi, résoudre la Promise avec la réponse
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    // Si la requête a échoué, rejeter la Promise avec le statut de la requête
                    reject(xhr.status);
                }
            }
        };

        xhr.send("action=getView&ViewName=" + viewId + "&userLoggedIn="+ isUserLoggedIn() + (isUserLoggedIn() ? "&appToken="+getAppToken() : ''));
    });
}

// Simuler une déconnexion utilisateur
function setUserLoggedOut() {
    localStorage.setItem('isUserLoggedIn', 'false');
    changeRoute('login');
}

function loadInitialRoute() {
    const savedRouteId = localStorage.getItem('currentRouteId');
    console.log(savedRouteId);
    changeRoute(savedRouteId || 'login');
}


function attachFormSubmitEvent() {
    const form = document.getElementById('auth-form'); // Assurez-vous que votre formulaire a cet ID
    if (form) {
        form.onsubmit = function (e) {
            e.preventDefault(); // Empêcher la soumission standard du formulaire
            loginUser();
        };
    }
}

function loginUser() {
    localStorage.setItem('isUserLoggedIn', 'true');
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Utilisation de Fetch API pour envoyer les données au serveur PHP
    fetch('http://votre_serveur.com/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Traiter la réponse du serveur
            // Après une connexion réussie
            // Gérer la réponse, par exemple en modifiant l'interface utilisateur en fonction de la réussite ou de l'échec de la connexion
        })
        .catch(error => console.error('Erreur:', error));
}


function isAppEmpty() {
    const app = document.getElementById('app');
    // Vérifier si l'élément app existe et s'il est vide
    return app && !app.innerHTML.trim();
}

function updateFooterBasedOnLoginState() {
    const footerIcons = document.getElementById('footer-icons');
    if (!isUserLoggedIn()) {
        // Cache les icônes si l'utilisateur n'est pas connecté
        footerIcons.style.display = 'none';
    } else {
        // Affiche les icônes si l'utilisateur est connecté
        footerIcons.style.display = 'flex';
    }
}

function onDeviceReady() {
    //  console.log('onDeviceReady');
  /*if (!isUserLoggedIn()) {
        attachFormSubmitEvent();
    }*/
}


document.addEventListener('DOMContentLoaded', async function () {
  //  console.log('DOMContentLoaded');
    loadScripts();
    updateFooterBasedOnLoginState();
    loadInitialRoute();
});


document.addEventListener('deviceready', onDeviceReady, false);

// S'assurer que les scripts communs sont chargés une fois que le DOM est prêt

