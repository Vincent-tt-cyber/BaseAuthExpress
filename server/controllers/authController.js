const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { pool } = require("../db");

const jwtSecret = "secret";

// Регистрация
module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [isUser] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (isUser.length > 0) {
      console.log("Пользователь существует =>>>>>>", isUser[0].email);
      return res.status(409).json({
        success: false,
        message: "Пользователь с таким email уже существует.",
      });
    }

    const [results] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    console.log("Новый пользователь создан =>", results);

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

// Удаление пользователя
module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    return res.json({
      success: true,
      message: `Пользователь c id ${id} удален`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Не удалось удалить пользователя. Попробуйте еще раз.",
      error: err.message,
    });
  }
};
