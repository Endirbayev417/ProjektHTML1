const welcomeMessage = document.querySelector("#welcomeMessage");
const logoutButton = document.querySelector("#logoutButton");


// ================================
// ПРОВЕРКА АВТОРИЗАЦИИ
// ================================

async function checkAuth() {

    try {

        const response = await fetch("/check-auth");

        const result = await response.json();


        // Если пользователь НЕ вошёл

        if (!result.success) {

            window.location.href = "login.html";

            return;

        }


        // Если пользователь вошёл

        welcomeMessage.textContent =
            `Добро пожаловать, ${result.user.name}!`;

    }

    catch (error) {

        console.error("Ошибка проверки авторизации:", error);

        welcomeMessage.textContent =
            "Ошибка соединения с сервером";

    }

}


// ================================
// ВЫХОД ИЗ АККАУНТА
// ================================

logoutButton.addEventListener("click", async function() {

    try {

        // Отправляем запрос серверу

        const response = await fetch("/logout", {

            method: "POST"

        });


        const result = await response.json();


        // Если выход успешный

        if (result.success) {

            window.location.href = "login.html";

        } else {

            alert("Не удалось выйти из аккаунта");

        }

    }

    catch (error) {

        console.error("Ошибка выхода:", error);

        alert("Ошибка соединения с сервером");

    }

});


// ================================
// ЗАПУСК ПРОВЕРКИ
// ================================

checkAuth();