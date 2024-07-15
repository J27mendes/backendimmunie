const express = require("express");
const routerPost = express.Router();
const upload = require("../../utils/multerConfig"); // Apenas para lidar com dados multipart/form-data
const fs = require("fs");
const { uploadToGCS } = require("../../utils/googleCloudStorage");
const { getCurrentDay, getOneYearLater } = require("../../utils/dateUtils");
const isValidEmail = require("../../utils/emailValidation");
const PasseVerde = require("../../models/passeVerde"); // Importe o modelo correto
const ensureCollectionAndFields = require("../../db/mongodb/migrations/ensureCollectionAndFields");

routerPost.post("/", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file || !req.body.nome || !req.body.email) {
      return res
        .status(400)
        .json({ message: "Campos obrigatórios não foram enviados." });
    }

    const { nome, email } = req.body;
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email inválido." });
    }

    const current_day = getCurrentDay();
    const one_year_later = getOneYearLater();

    // Faz upload do arquivo para o Google Cloud Storage
    const photoData = await uploadToGCS(req.file.path, req.file.mimetype);

    const dataToInsert = {
      photo: photoData,
      nome: nome,
      email: email,
      current_day: current_day,
      one_year_later: one_year_later,
    };

    // Obtém a coleção no banco de dados
    await ensureCollectionAndFields(); // Garante que a coleção e campos estão criados
    const insertResult = await PasseVerde.create(dataToInsert);

    // Remove o arquivo após o upload e inserção no banco de dados
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: "Dados inseridos com sucesso.",
      data: insertResult,
    });
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
    res.status(500).json({ message: "Erro ao inserir dados." });
  }
});

module.exports = routerPost;
