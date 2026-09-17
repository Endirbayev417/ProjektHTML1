const loginForm = document.querySelector("#loginForm");

const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");

const loginEmailError = document.querySelector("#loginEmailError");
const loginPasswordError = document.querySelector("#loginPasswordError");

const loginMessage = document.querySelector("#loginMessage");


// ================================
// ВХОД В АККАУНТ
// ================================

loginForm.addEventListener("submit", async function(event) {

    // Не перезагружаем страницу

    event.preventDefault();


    // Получаем данные

    const email = loginEmail.value.trim();
    const password = loginPassword.value;


    // Очищаем старые сообщения

    loginEmailError.textContent = "";
    loginPasswordError.textContent = "";
    loginMessage.textContent = "";


    let hasError = false;


    // ================================
    // ПРОВЕРКА EMAIL
    // ================================

    if (email === "") {

        loginEmailError.textContent = "Введите Email";

        hasError = true;

    } else {

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            loginEmailError.textContent =
                "Введите корректный Email";

            hasError = true;

        }

    }


    // ================================
    // ПРОВЕРКА ПАРОЛЯ
    // ================================

    if (password === "") {

        loginPasswordError.textContent =
            "Введите пароль";

        hasError = true;

    }


    // Если есть ошибки

    if (hasError) {

        return;

    }


    // ================================
    // ОТПРАВЛЯЕМ ДАННЫЕ НА СЕРВЕР
    // ================================

    try {

        const response = await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        });


        const result = await response.json();


        // ================================
        // УСПЕШНЫЙ ВХОД
        // ================================

        if (result.success) {

            loginMessage.textContent =
                result.message;

            loginMessage.style.color =
                "#4ade80";


            // Через небольшую паузу
            // переходим в личный кабинет

            setTimeout(function() {

                window.location.href =
                    "profile.html";

            }, 700);


        } else {

            // Неправильные данные

            loginMessage.textContent =
                result.message;

            loginMessage.style.color =
                "#ef4444";

        }


    } catch (error) {

        // Сервер недоступен

        loginMessage.textContent =
            "Ошибка соединения с сервером";

        loginMessage.style.color =
            "#ef4444";

        console.error(error);

    }

});