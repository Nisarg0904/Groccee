const { validateItem } = require("./utils/apiHelper");

validateItem("Milk")
  .then((item) => console.log("Validated Item:", item))
  .catch((err) => console.error("Error:", err.message));
