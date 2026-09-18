// Получаем элементы со страницы
const balanceElement = document.getElementById("balance");
const depositButton = document.getElementById("depositButton");
const withdrawButton = document.getElementById("withdrawButton");
const logoutButton = document.getElementById("logoutButton");
const welcomeMessage = document.getElementById("welcomeMessage");
const userIdElement = document.getElementById("userId");


// Получаем имя пользователя
const username = localStorage.getItem("username");


// Если пользователь не вошёл в аккаунт
if (!username) {
    window.location.href = "index.html";
}


// Показываем имя пользователя
welcomeMessage.textContent = `Добро пожаловать, ${username}!`;


// Создаём ID пользователя
let userId = localStorage.getItem("userId");

if (!userId) {
    userId = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("userId", userId);
}

userIdElement.textContent = userId;


// Получаем баланс
let balance = Number(localStorage.getItem("balance")) || 0;


// Показываем баланс
function updateBalance() {
    balanceElement.textContent = balance.toLocaleString("ru-RU");
}

updateBalance();


// Кнопка "Пополнить"
depositButton.addEventListener("click", function () {

    const amount = prompt("Введите сумму пополнения:");

    if (amount === null) {
        return;
    }

    const number = Number(amount);

    if (isNaN(number) || number <= 0) {
        alert("Введите правильную сумму.");
        return;
    }

    balance += number;

    localStorage.setItem("balance", balance);

    updateBalance();

    alert(`Баланс пополнен на ${number.toLocaleString("ru-RU")} сум.`);
});


// Кнопка "Вывести"
withdrawButton.addEventListener("click", function () {

    const amount = prompt("Введите сумму вывода:");

    if (amount === null) {
        return;
    }

    const number = Number(amount);

    if (isNaN(number) || number <= 0) {
        alert("Введите правильную сумму.");
        return;
    }

    if (number > balance) {
        alert("Недостаточно средств.");
        return;
    }

    balance -= number;

    localStorage.setItem("balance", balance);

    updateBalance();

    alert(`Вы вывели ${number.toLocaleString("ru-RU")} сум.`);
});


// Кнопка "Выйти"
logoutButton.addEventListener("click", function () {

    localStorage.removeItem("username");

    window.location.href = "index.html";
});```
/* Меню навигации */

.navigation {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    gap: 10px;

    padding: 10px;

    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);

    border-radius: 15px;

    z-index: 10;
}


/* Кнопки меню */

.navigation button {
    border: none;

    padding: 12px 20px;

    border-radius: 10px;

    background: transparent;
    color: white;

    font-size: 15px;

    cursor: pointer;

    transition: 0.3s;
}


/* Наведение мышки */

.navigation button:hover {
    background: rgba(255, 255, 255, 0.2);

    transform: translateY(-2px);
}


/* Чтобы личный кабинет не залезал под меню */

.registration-box {
    margin-top: 100px;
}```