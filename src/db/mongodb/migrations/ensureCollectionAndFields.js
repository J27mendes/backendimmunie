const PasseVerde = require("../../../models/passeVerde");

async function ensureCollectionAndFields() {
  try {
    const hasExistingData = await PasseVerde.findOne();

    if (hasExistingData) {
      return;
    } else {
      const uploadedAt = new Date("2024-07-06T00:00:00Z");
      const editedAt = new Date("2024-07-06T00:00:00Z");
      const currentDay = new Date();
      const oneYearLater = new Date(currentDay);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      const document = new PasseVerde({
        photo: {
          url: "string",
          uploaded_at: uploadedAt,
          edited_at: editedAt,
        },
        nome: "string",
        current_day: currentDay,
        one_year_later: oneYearLater,
        email: "exemplo@email.com",
      });

      await document.save();
    }
  } catch (error) {
    console.error("Erro ao garantir a coleção e campos:", error);
  }
}

module.exports = ensureCollectionAndFields;
