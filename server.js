const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const db = require("./database");

const app = express();

const PORT = 3000;


// ================================
// НАСТРОЙКИ СЕРВЕРА
// ================================

// Разрешаем серверу принимать JSON

app.use(express.json());


// Включаем сессии

app.use(session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false
}));


// Подключаем папку с сайтом

app.use(express.static("public"));


// ================================
// РЕГИСТРАЦИЯ
// ================================

app.post("/register", async function(req, res) {

    const { name, email, password } = req.body;

    console.log("Получены данные:", name, email);


    // Проверяем поля

    if (!name || !email || !password) {

        return res.json({
            success: false,
            message: "Заполните все поля"
        });

    }


    // Создаём хеш пароля

    const hashedPassword = await bcrypt.hash(password, 10);


    try {

        // Добавляем пользователя в базу

        const insertUser = db.prepare(`
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `);

        insertUser.run(name, email, hashedPassword);


        // Получаем только что созданного пользователя

        const newUser = db.prepare(`
            SELECT * FROM users
            WHERE email = ?
        `).get(email);


        // Сразу создаём сессию

        req.session.userId = newUser.id;
        req.session.userName = newUser.name;
        req.session.userEmail = newUser.email;


        // Отправляем ответ браузеру

        res.json({
            success: true,
            message: "Пользователь зарегистрирован!"
        });


    } catch (error) {

        console.error(error);

        res.json({
            success: false,
            message: "Такой Email уже зарегистрирован"
        });

    }

});


// ================================
// ВХОД
// ================================

app.post("/login", async function(req, res) {

    const { email, password } = req.body;


    // Ищем пользователя

    const user = db.prepare(`
        SELECT * FROM users
        WHERE email = ?
    `).get(email);


    // Пользователь не найден

    if (!user) {

        return res.json({
            success: false,
            message: "Неверный Email или пароль"
        });

    }


    // Проверяем пароль

    const passwordCorrect = await bcrypt.compare(
        password,
        user.password
    );


    // Пароль неправильный

    if (!passwordCorrect) {

        return res.json({
            success: false,
            message: "Неверный Email или пароль"
        });

    }


    // ================================
    // СОХРАНЯЕМ ПОЛЬЗОВАТЕЛЯ В СЕССИИ
    // ================================

    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;


    // Успешный вход

    res.json({
        success: true,
        message: `Добро пожаловать, ${user.name}!`
    });

});


// ================================
// ПРОВЕРКА АВТОРИЗАЦИИ
// ================================

app.get("/check-auth", function(req, res) {

    // Проверяем наличие пользователя в сессии

    if (!req.session.userId) {

        return res.json({
            success: false
        });

    }


    // Пользователь авторизован

    res.json({
        success: true,

        user: {
            id: req.session.userId,
            name: req.session.userName,
            email: req.session.userEmail
        }

    });

});


// ================================
// ВЫХОД ИЗ АККАУНТА
// ================================

app.post("/logout", function(req, res) {

    // Уничтожаем сессию

    req.session.destroy(function(error) {

        if (error) {

            return res.json({
                success: false,
                message: "Не удалось выйти из аккаунта"
            });

        }


        // Сессия удалена

        res.json({
            success: true,
            message: "Вы вышли из аккаунта"
        });

    });

});


// ================================
// ЗАПУСК СЕРВЕРА
// ================================

app.listen(PORT, function() {

    console.log(
        `Сервер запущен: http://localhost:${PORT}`
    );

});