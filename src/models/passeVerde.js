const mongoose = require("mongoose");
const { Schema } = mongoose;

const passeVerdeSchema = new Schema(
  {
    photo: {
      url: { type: String },
      uploaded_at: { type: Date },
      edited_at: { type: Date },
    },
    nome: { type: String },
    current_day: { type: Date },
    one_year_later: { type: Date },
    email: { type: String },
  },
  {
    collection: "tabelaPasseVerde", // Define o nome da coleção
  }
);

const PasseVerde = mongoose.model("PasseVerde", passeVerdeSchema);

module.exports = PasseVerde;
