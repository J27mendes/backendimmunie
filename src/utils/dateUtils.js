const { format, addYears } = require("date-fns");

function getCurrentDay() {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
}

function getOneYearLater() {
  const dateOneYearLater = addYears(new Date(), 1);
  return format(dateOneYearLater, "yyyy-MM-dd'T'HH:mm:ss'Z'");
}

module.exports = {
  getCurrentDay,
  getOneYearLater,
};
