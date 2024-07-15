const express = require("express");
const routerPut = express.Router();
const upload = require("../../utils/multerConfig"); // Apenas para lidar com dados multipart/form-data
const { uploadBucketToGCS } = require("../../utils/googleCloudStorage");
const { getCurrentDay, getOneYearLater } = require("../../utils/dateUtils");
const PasseVerde = require("../../models/passeVerde"); // Importe o modelo correto
const ensureCollectionAndFields = require("../../db/mongodb/migrations/ensureCollectionAndFields");

routerPut.put("/", upload.single("photo"), async (req, res) => {
  try {
    const { nome, photo, email, ...rest } = req.body;

    // Verificação de campos adicionais não permitidos
    if (Object.keys(rest).length > 0) {
      return res.status(400).json({
        message:
          "Formato inválido. Apenas 'photo', 'nome' e 'email' são permitidos.",
      });
    }

    const current_day = getCurrentDay();
    const one_year_later = getOneYearLater();

    let photoData = {};

    if (req.file) {
      // Faz upload da nova foto para o Google Cloud Storage
      photoData = await uploadBucketToGCS(req.file);
    }

    // Montar o objeto com os dados atualizados
    const dataToUpdate = {
      photo: photoData,
      email: email,
      current_day: current_day,
      one_year_later: one_year_later,
      updatedAt: new Date(),
    };

    // conexão e garantia que a coleção e os campos estejam prontos
    await ensureCollectionAndFields(); // Garante que a coleção e campos estão criados
    const updateResult = await PasseVerde.updateOne(
      { email: email },
      dataToUpdate
    );

    if (updateResult.n === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum documento encontrado para atualizar." });
    }

    res.status(200).json({ message: "Dados atualizados com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar dados:", error);
    res.status(500).json({ message: "Erro ao atualizar dados." });
  }
});

module.exports = routerPut;
