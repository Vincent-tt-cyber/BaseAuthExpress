const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { pool } = require("../db");

const jwtSecret = "secret";

// Регистрация
module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const results = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    // console.log(results);
    res.status(201).json({
      success: true,
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Не удалось совершить регистрацию. Попробуйте еще раз.",
      error: err.message,
    });
  }
};

// Авторизация
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length == 0) {
      return res.status(401).json({
        success: false,
        message: "Не верный email. Попробуйте еще раз.",
      });
    }

    const user = results[0];

    // console.log("user =====>", user);

    const passwordMatch = await bcrypt.compare(password, user.password);
    // console.log("passwordMatch =====>", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Не верный пароль. Попробуйте еще раз.",
      });
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

    res.json({
      success: true,
      name: user.name,
      email: user.email,
      password: user.password,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Не удалось войти. Попробуйте еще раз.",
      error: err.message,
    });
  }
};

// Пользователи
module.exports.getUsers = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM users");
    return res.json(results);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Не удалось получить данные. Попробуйте еще раз.",
      error: err.message,
    });
  }
};
