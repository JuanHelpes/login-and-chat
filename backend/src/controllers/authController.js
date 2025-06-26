const usuarioSchema = require("../models/Usuario.js");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET;

const register = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  const userExists = await usuarioSchema.findOne({ email });

  if (userExists) {
    return res.status(400).json({ error: "Usuário já existe!" });
  }

  const hashedPassword = bcrypt.hashSync(senha, 12); // Hash the password

  const newUser = new usuarioSchema({
    _id: uuid(),
    nome,
    email,
    senha: hashedPassword, // Store the hashed password
  });

  try {
    await newUser.save();
    console.log("Usuário criado com sucesso!");
    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await usuarioSchema.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado!" });
    }

    const isPasswordValid = bcrypt.compareSync(req.body.senha, user.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha inválida!" });
    }
    const token = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: 86400,
    }); // 24 horas
    return res
      .status(200)
      .json({ id: user.id, auth: true, token: token, nome: user.nome });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const GoogleLogin = async (req, res) => {
  try {
    var user = await usuarioSchema.findOne({ email: req.body.email });

    if (!user) {
      const newUser = new usuarioSchema({
        _id: uuid(),
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.jti,
      });
      try {
        await newUser.save();
        user = newUser; // Assign the newly created user to the user variable
        console.log("Usuário criado com sucesso!");
        // return res.status(201).json({ message: "Usuário criado com sucesso!" });
      } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ error: error.message });
      }
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: 86400,
    }); // 24 horas
    return res
      .status(200)
      .json({ id: user.id, auth: true, token: token, nome: user.nome });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const verifyToken = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  const token = tokenHeader && tokenHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido!" });
  }

  try {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido!" });
      }
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao verificar o token!" });
  }
};

module.exports = {
  login,
  GoogleLogin,
  verifyToken,
  register,
};
