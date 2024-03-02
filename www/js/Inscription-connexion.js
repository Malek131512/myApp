if (typeof dir === 'undefined') {
    let dir = window.myGlobalDir;
}
const CLIENT_ID = '1095730700549-70lia023lrev7cn9cihpa758kgu22jgt.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBVSmClzvMHtPO9Jq-0nYZ05Fi6vYaxhgQ';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = ['https://script.googleapis.com/$discovery/rest?version=v1', 'https://people.googleapis.com/$discovery/rest?version=v1'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/userinfo.email';

let tokenClient;
let gapiInited = false;
let gisInited = false;

//document.getElementById('authorize_button').style.visibility = 'hidden';
//document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

function UserObject(UserInfo) {
    // Création d'un objet user vide avec des valeurs par défaut
    let user = {};

    // Extraction de l'ID Google
    user.idgoogle = UserInfo.resourceName.split('/')[1];

    // Extraction du nom et du prénom
    if (UserInfo.names && UserInfo.names.length > 0) {
        user.nom = UserInfo.names[0].familyName || 'NULL';
        user.prenom = UserInfo.names[0].givenName || 'NULL';
    }

    // Extraction de l'adresse e-mail
    if (UserInfo.emailAddresses && UserInfo.emailAddresses.length > 0) {
        user.email = UserInfo.emailAddresses[0].value || 'NULL';
        user.est_valide = UserInfo.emailAddresses[0].metadata.verified ? 1 : 0;
        user.email_est_valide = UserInfo.emailAddresses[0].metadata.verified ? 1 : 0;
    }
    // Note : Les champs comme le numéro de téléphone et le nom de l'entreprise ne sont pas fournis dans l'exemple d'objet UserInfo donné
    // Si ces informations sont disponibles, vous pouvez les extraire de manière similaire
    return user;
}

async function getUserInfo(userToken) {
    try {
        const response = await gapi.client.people.people.get({
            resourceName: 'people/me', personFields: 'names,emailAddresses,phoneNumbers,organizations'
        });
        console.log("User Info:", response.result);
        const user = UserObject(response.result);
        user.access_token = userToken.access_token;
        new Promise(function (resolve, reject) {
            var data = `action=googleAuth&user=` + JSON.stringify(user);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/LoginSingInUtils.php');
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
        }).then(function (json) {
            if (json.hasOwnProperty('redirect')) {
                if (parseInt(json.redirect) == 1) {
                    window.location.replace("index.php?links");
                }
            }
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
}


/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY, discoveryDocs: DISCOVERY_DOC,
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID, scope: SCOPES, callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    showLoader();
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        const user = {};
        user.access_token = resp.access_token;
        new Promise(function (resolve, reject) {
            var data = `action=googleAuth&user=` + JSON.stringify(user);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", dir + '/ajax/LoginSingInUtils.php');
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
        }).then(function (json) {
            if (json.hasOwnProperty('redirect')) {
                if (parseInt(json.redirect) == 1) {

                    changeRoute('links');
                    setUserLoggedIn(true);
                 //   window.location.replace("index.php?links");
                }
            }
        });
        //    document.getElementById('signout_button').style.visibility = 'visible';
        //   document.getElementById('authorize_button').innerText = 'Refresh';
        await createScript();
        await getUserInfo(user); // Ajout de l'appel à la fonction ici
    };
    hideLoader();
    console.log(gapi.client.getToken());

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
 *  Sign out the user upon button click.
 */

/*
function handleSignoutClick() {
    const token = gapi.client.getToken();
    console.log(token);
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        //  document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}*/

/**
 * Creates a new 'Hello world' script.
 */
async function createScript() {
    let response;
    try {
        const createRequest = {
            resource: {
                title: 'My Script',
            },
        };
        response = await gapi.client.script.projects.create(createRequest);

        const updateContentRequest = {
            scriptId: response.result.scriptId, resource: {
                files: [{
                    name: 'hello',
                    type: 'SERVER_JS',
                    source: 'function helloWorld() {\n  console.log("Hello, world!");\n}',
                }, {
                    name: 'appsscript',
                    type: 'JSON',
                    source: '{"timeZone":"America/New_York","' + 'exceptionLogging":"CLOUD"}',
                }],
            },
        };
        response = await gapi.client.script.projects.updateContent(updateContentRequest);
        const output = `Script URL: https://script.google.com/d/${response.result.scriptId}/edit`;
        console.log(output);
        //document.getElementById('content').innerText = output;
    } catch (err) {
        console.log(err);
        //document.getElementById('content').innerText = err.message;
        return;
    }
}

function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}

function onFailure(error) {
    console.log(error);
}

/*
gapi.load('auth2', function() {
// Initialiser le client auth2 avec votre client_id
gapi.auth2.init({
    client_id: '70lia023lrev7cn9cihpa758kgu22jgt.apps.googleusercontent.com'
});
});
}
function onSignIn(googleUser) {
// Récupérer le profil de l'utilisateur
var profile = googleUser.getBasicProfile();
console.log('ID: ' + profile.getId()); // Ne pas envoyer à votre serveur
console.log('Full Name: ' + profile.getName());
console.log('Given Name: ' + profile.getGivenName());
console.log('Family Name: ' + profile.getFamilyName());
console.log('Image URL: ' + profile.getImageUrl());
console.log('Email: ' + profile.getEmail());

// Vous pouvez maintenant envoyer ces informations à votre serveur
// ...
}*/
document.addEventListener2("DOMContentLoaded", function () {
    /*  document.querySelector("#BtnJetonActualise").addEventListener("click", function () {
          var email = document.querySelector("input[name=email]").value;
          var crypt = document.querySelector("input[name=crypt]").value;
          window.location.href = "index.php?cry=" + crypt + "&jt=0&emv&em=" + email;
      });
  */
    // For autocomplete, you may need a library or custom implementation
    // let's assume you have a function named autocomplete
    // autocomplete(document.querySelector(".input_flip1"));
    const haveBipBtn = document.getElementById("haveBipBtn");
    const formSection = document.getElementById("formSection");
    const toggleSection = document.querySelector(".myToggleSection");
    const noBipBtn = document.getElementById("noBipBtn");
    if (noBipBtn) {
        noBipBtn.addEventListener2("click", function () {
            window.location.href = dir + "/index.php?signin";
        });
    }
    let formVisible = false;
    if (haveBipBtn) {
        haveBipBtn.addEventListener2("click", function () {
            formVisible = !formVisible;

            if (formVisible) {
                toggleSection.style.height = "20%";
                formSection.classList.add("show");
            } else {
                toggleSection.style.height = "50%";
                formSection.classList.remove("show");
            }
        });
    }
    var connexionWithBip = document.querySelector('#connexionWithBip');
    console.log(document.querySelector('#connexionWithBip'));
    if (connexionWithBip) {
        connexionWithBip.style.display = 'none';
    }

    var btn_flip1 = document.querySelectorAll(".btn_flip1");
    if (btn_flip1) {
        btn_flip1.forEach((btn) => {
            btn.addEventListener2("click", function () {
                var type = this.name;
                var regex = /^[a-zA-Z\u00C0-\u00FF]*$/;
                regex = (type === "entreprise") ? /^[0-9a-zA-Z\u00C0-\u00FF]*$/ : regex;

                var oldErrorMessages = document.querySelectorAll('.Form' + type + '.text-danger');
                oldErrorMessages.forEach((message) => {
                    message.remove();
                });

                var val = this.value;
                console.log(val);

                var error = false;
                var errorText = (val === '') ? "remplir" : !regex.test(val) ? "corriger" : "";
                error = (val === '') ? true : !regex.test(val) ? true : false;
                error = ((errorText === "remplir") && (type === "entreprise")) ? false : error;
                console.log(errorText);

                if (error) {
                    var errorMessage = document.createElement('p');
                    errorMessage.className = "text-danger Form" + type;
                    errorMessage.style.textAlign = "left";
                    errorMessage.innerText = 'Veuillez ' + errorText + ' votre ' + type + '.';
                    let formElement = document.querySelector('#Form' + type);
                    console.log('Form Element:', formElement); // check if the element is null or not
                    if (formElement) { // only call the method if the element is not null
                        formElement.insertAdjacentElement('afterend', errorMessage);
                    }
                }
                if (document.querySelectorAll('.Formnom.text-danger').length === 0 && document.querySelectorAll('.Formprenom.text-danger').length === 0 && document.querySelectorAll('.Formentreprise.text-danger').length === 0) {
                    document.querySelector("#formulaire_flip1").style.display = "none";
                    document.querySelector("#formulaire_flip2").style.display = "block";
                }
            });
        });
    }
    let btn_flip2 = document.querySelectorAll(".btn_flip2");
    if (btn_flip2) {
        btn_flip2.forEach((btn) => {
            document.querySelector(".btn_flip2").addEventListener2("click", function () {
                document.querySelector("#formulaire_flip2").style.display = "none";
                document.querySelector("#formulaire_flip1").style.display = "block";
            });
        });
    }


    var btnSubmitInscription = document.getElementById('btnSubmitInscription');
    if (btnSubmitInscription) {
        btnSubmitInscription.addEventListener2('click', function () {
            var fields = document.querySelectorAll('.is-invalid');
            fields.forEach(function (field) {
                field.classList.remove('is-invalid');
            });
            var nom = document.querySelector('#Formnom').value;
            var prenom = document.querySelector('#Formprenom').value;
            var entreprise = document.querySelector('#Formentreprise').value;
            var email = document.querySelector('#Formemail').value;
            var tel = document.querySelector('#Formtel').value;
            var password = document.querySelector('#Formpassword').value;
            var confirmPassword = document.querySelector('#FormconfirmPassword').value;
            var crypt = document.querySelector('input[name="cryHidden"]').value;
            // Using Fetch API for AJAX request
            new Promise(function (resolve, reject) {
                var data = `action=inscription&nom=${nom}&prenom=${prenom}&entreprise=${entreprise}&email=${email}&tel=${tel}&password=${password}&confirmPassword=${confirmPassword}&crypt=${crypt}&appToken=true}`;
                var xhr = new XMLHttpRequest();
                xhr.open("POST", dir + '/ajax/LoginSingInUtils.php');
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
            }).then(function (json) {
                if (json.hasOwnProperty('data')) {
                    setAppToken(json.data.appToken);
                }
                if (json.hasOwnProperty('reload')) {
                    if (parseInt(json.reload) == 1) {
                        if (json.hasOwnProperty('crypt')) crypt = json.crypt;
                //                    changeRoute('links');
                        //                    window.location.replace(dir + "/index.php?email&cry=" + crypt);
                    }
                } else {
                    var fields_flip1 = ["Formnom", "Formprenom", "Formentreprise"];
                    if (json.hasOwnProperty('Place1')) {
                        document.getElementById(json.Place1).classList.add('is-invalid');
                    }

                    if (json.hasOwnProperty('Place2')) {
                        document.getElementById(json.Place2).classList.add('is-invalid');
                    }

                    if (fields_flip1.includes(json.Place1) || fields_flip1.includes(json.Place2)) {
                        document.querySelector("#formulaire_flip2").style.display = "none";
                        document.querySelector("#formulaire_flip1").style.display = "block";
                    }

                    if (json.hasOwnProperty('errorText')) {
                        document.getElementById('body').scrollTop = 0;
                        document.getElementById("errorText").innerText = json.errorText;
                        document.getElementById("alertIndex").style.display = 'block';
                    }
                }
            });
        });
    }

    var btnSubmitConnexion = document.getElementById('btnSubmitConnexion');
    if (btnSubmitConnexion) {
        btnSubmitConnexion.addEventListener2('click', function () {
            var password = document.querySelector('#formPassword').value;
            var email = document.querySelector('#formEmail').value;
            console.log(password + " " + email);

            new Promise(function (resolve, reject) {
                var data = `action=connexion&email=${email}&password=${password}&appToken=true`;
                var xhr = new XMLHttpRequest();
                xhr.open("POST", dir + '/ajax/LoginSingInUtils.php');
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
            }).then(function (json) {
                    if (json.hasOwnProperty('data')) {
                        setAppToken(json.data.appToken);
                        changeRoute('links');
                        setUserLoggedIn(true);
                    }
                    if (json.hasOwnProperty('redirect')) {
                    if (parseInt(json.redirect) == 1) {
//                        window.location.replace("index.php?links");
                    }
                } else if (json.hasOwnProperty('reload')) {
                    if (parseInt(json.reload) == 1) {
                        window.location.reload();
                    }
                } else {
                    if (json.hasOwnProperty('Place1')) $('#' + json.Place1).addClass('is-invalid');

                    if (json.hasOwnProperty('Place2')) $('#' + json.Place2).addClass('is-invalid');

                    if (json.hasOwnProperty('errorText')) {
                        document.getElementById("errorText").innerText = json.errorText;
                        document.getElementById("alertIndex").style.display = 'block';
                    }
                }
            });
        });
    }
// Password Reset
    var MdpOublie = document.getElementById('MdpOublie');
    if (MdpOublie) {
        MdpOublie.addEventListener2('click', function () {
            document.querySelector('#connexionWithPassword').style.display = 'none';
            document.querySelector('#connexionWithBip').style.display = 'none';
            document.querySelector('#MotDePasseOublier').style.display = 'block';
        });
    }

    const btnModifierMdp = document.getElementById('btnModifierMdp');
    if (btnModifierMdp) {
        btnModifierMdp.addEventListener2('click', function () {
            var password1 = document.querySelector('input[name="password1"]').value;
            var password2 = document.querySelector('input[name="password2"]').value;
            var mdptoken = document.querySelector('input[name="mdptoken"]').value;
            var crypt = document.querySelector('input[name="crypt"]').value;
            new Promise(function (resolve, reject) {
                var data = `action=editPassword&password1=${password1}&password2=${password2}&mdptoken=${mdptoken}&crypt=${crypt}`;
                console.log(data);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", dir + '/ajax/LoginSingInUtils.php');
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
            }).then(function (json) {
                console.log(json);
                if (json.hasOwnProperty('reload')) {
                    if (parseInt(json.reload) == 1) {
                        changeRoute('links');
                        setUserLoggedIn(true);

                        //           window.location.replace("index.php?links&cry=" + crypt);
                    }
                } else {
                    if (json.hasOwnProperty('Place1')) {
                        document.getElementById(json.Place1).classList.add('is-invalid');
                    }

                    if (json.hasOwnProperty('Place2')) {
                        document.getElementById(json.Place2).classList.add('is-invalid');
                    }

                    if (json.hasOwnProperty('errorText')) {
                        document.getElementById('body').scrollTop = 0;
                        document.getElementById("errorText").innerText = json.errorText;
                        document.getElementById("alertIndex").style.display = 'block';
                    }
                }
            });
        });
    }

// Password Forgot
    var btnConfirmerMotDePasseOublier = document.getElementById('btnConfirmerMotDePasseOublier');
    if (btnConfirmerMotDePasseOublier) {
        btnConfirmerMotDePasseOublier.addEventListener2('click', function () {
            var email = document.querySelector('input[name="emailMdpOublie"]').value;
            console.log(email);
            new Promise(function (resolve, reject) {
                var data = `action=editPasswordRequest&email=${email}`;
                var xhr = new XMLHttpRequest();
                xhr.open("POST", dir + '/ajax/LoginSingInUtils.php');
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
            }).then(function (json) {
                console.log(json);
            });
        });
    }
// Bip Connection
    var btnConfirmConnexionWithBip = document.getElementById('btnConfirmConnexionWithBip');
    if (btnConfirmConnexionWithBip) {
        btnConfirmConnexionWithBip.addEventListener2('click', function () {
            var bipid = document.querySelector('#bip_id').value;
            new Promise(function (resolve, reject) {
                var data = 'action=verifCrypt&crypt=' + bipid;
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
            }).then(function (json) {
                if (json.hasOwnProperty('redirect')) {
                    if (json.redirect) {
           //             window.location.replace("index.php?cry=" + bipid);
                    }
                } else {
                    if (json.hasOwnProperty('Place1')) $('#' + json.Place1).addClass('is-invalid');

                    if (json.hasOwnProperty('errorText')) {
                        document.getElementById("errorText").innerText = json.errorText;
                        document.getElementById("alertIndex").style.display = 'block';
                    }
                }
            });
        });
    }
// Connection methods buttons
    console.log('here');
    var btnsConnexionWithBip = document.querySelectorAll('.btnConnexionWithBip');
    console.log(btnsConnexionWithBip);
    btnsConnexionWithBip.forEach(btnConnexionWithBip => {
        console.log(btnConnexionWithBip);
        btnConnexionWithBip.addEventListener2('click', function () {
            document.getElementById("errorText").innerText = '';
            document.getElementById("alertIndex").style.display = 'none';
            document.getElementById('connexionWithBip').style.display = 'block';
            document.getElementById('connexionWithPassword').style.display = 'none';
            document.getElementById('MotDePasseOublier').style.display = 'none';
        });
    });
    var btnConnexionWithPassword = document.querySelectorAll('.btnConnexionWithPassword')
    if (btnConnexionWithPassword) {
        btnConnexionWithPassword.forEach(btn => {
            btn.addEventListener2('click', function () {
                document.getElementById("errorText").innerText = '';
                document.getElementById("alertIndex").style.display = 'none';
                document.querySelector('#connexionWithPassword').style.display = 'block';
                document.querySelector('#connexionWithBip').style.display = 'none';
                document.querySelector('#MotDePasseOublier').style.display = 'none';
            });
        });
    }
});

