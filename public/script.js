const passwordInput = document.querySelector("#password");
const showPasswordButton = document.querySelector("#showPassword");


// ================================
// ПОКАЗАТЬ / СКРЫТЬ ПАРОЛЬ
// ================================

showPasswordButton.addEventListener("click", function() {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        showPasswordButton.textContent = "Скрыть пароль";

    } else {

        passwordInput.type = "password";
        showPasswordButton.textContent = "Показать пароль";

    }

});


// ================================
// ФОРМА РЕГИСТРАЦИИ
// ================================

const form = document.querySelector("form");
const successMessage = document.querySelector("#successMessage");


form.addEventListener("submit", async function(event) {

    // Не перезагружаем страницу

    event.preventDefault();


    // Получаем данные

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = passwordInput.value;


    // Получаем поля ошибок

    const nameError = document.querySelector("#nameError");
    const emailError = document.querySelector("#emailError");
    const passwordError = document.querySelector("#passwordError");


    // Очищаем старые сообщения

    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    successMessage.textContent = "";


    let hasError = false;


    // ================================
    // ПРОВЕРКА ИМЕНИ
    // ================================

    if (name === "") {

        nameError.textContent = "Введите имя";

        hasError = true;

    }


    // ================================
    // ПРОВЕРКА EMAIL
    // ================================

    if (email === "") {

        emailError.textContent = "Введите Email";

        hasError = true;

    } else {

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            emailError.textContent =
                "Введите корректный Email";

            hasError = true;

        }

    }


    // ================================
    // ПРОВЕРКА ПАРОЛЯ
    // ================================

    if (password === "") {

        passwordError.textContent = "Введите пароль";

        hasError = true;

    } else if (password.length < 6) {

        passwordError.textContent =
            "Пароль должен содержать минимум 6 символов";

        hasError = true;

    }


    // Если есть ошибки — останавливаемся

    if (hasError) {

        return;

    }


    // ================================
    // ОТПРАВЛЯЕМ ДАННЫЕ НА СЕРВЕР
    // ================================

    try {

        const response = await fetch("/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })

        });


        const result = await response.json();


        // ================================
        // УСПЕШНАЯ РЕГИСТРАЦИЯ
        // ================================

        if (result.success) {

            successMessage.textContent =
                result.message;

            successMessage.style.color =
                "#4ade80";


            // Через 700 миллисекунд
            // переходим в личный кабинет

            setTimeout(function() {

                window.location.href =
                    "profile.html";

            }, 700);


        } else {

            // Email уже существует

            emailError.textContent =
                result.message;

        }


    } catch (error) {

        // Сервер не отвечает

        successMessage.textContent =
            "Ошибка соединения с сервером";

        successMessage.style.color =
            "#ef4444";

        console.error(error);

    }

});