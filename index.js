const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const carteirinhaPut = require("./src/routes/identification/put");
const carteirinhaPost = require("./src/routes/identification/post");
const carteirinhaGet = require("./src/routes/identification/get");
dotenv.config();

const app = express();

const corsOptions = {
  origin: "*", // Permitindo requisições de qualquer origem
  methods: ["GET", "POST", "PUT"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
};
app.use(cors(corsOptions));

const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${MONGO_DB_PASS}@cluster0.dhdmkoc.mongodb.net/${MONGO_DB_DB}`; //process.env.MONGO_URI; // Adicione sua URI do MongoDB aqui

mongoose
  .connect(uri)
  .then(() => console.log("Conexão com o MongoDB estabelecida com sucesso"))
  .catch((error) => console.error("Erro ao conectar com o MongoDB:", error));

module.exports = mongoose.connection;

const port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Bem-vindo a immunie carteirinha!");
});

app.use("/carteirinha", carteirinhaGet);

app.use("/carteirinha", carteirinhaPost);

app.use("/carteirinha", carteirinhaPut);

//Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
