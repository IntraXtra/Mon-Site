// Identifiants valides
const validCredentials = {
    username: "WeAre",
    password: "Here2Work"
};

// Gestion du formulaire de connexion (uniquement pour login.html)
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Empêche le rechargement de la page

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (username === validCredentials.username && password === validCredentials.password) {
                // Identifiants corrects : enregistre la session et redirige
                sessionStorage.setItem("authenticated", "true");
                window.location.href = "travaux.html";
            } else {
                // Identifiants incorrects : afficher un message d'erreur
                const errorMessage = document.getElementById("error-message");
                errorMessage.style.display = "block";
            }
        });
    }
});
