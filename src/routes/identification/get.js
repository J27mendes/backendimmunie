const express = require("express");
const routerGet = express.Router();
const PasseVerde = require("../../models/passeVerde");

routerGet.get("/:email", async (req, res) => {
  const { email: userEmail } = req.params; // Renomeie para evitar conflito

  const existingDocument = await PasseVerde.findOne({ email: userEmail });

  if (existingDocument) {
    const { nome, photo, userEmail } = existingDocument; // Renomeie email para userEmail, se necessário
    res.status(200).json({
      exists: true,
      nome: nome,
      photo: photo,
      email: userEmail, // Renomeie para evitar conflito
    });
  } else {
    res.status(200).json({ exists: false });
  }
});

module.exports = routerGet;
