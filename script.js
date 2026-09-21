
const passwordInput = document.getElementById("password");
const showPassword = document.getElementById("showPassword");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

// Відображення або приховування пароля
showPassword.addEventListener("change", function () {
    if (showPassword.checked) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});

// Обробка відправлення форми
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    message.textContent = "Форму успішно заповнено!";
});
