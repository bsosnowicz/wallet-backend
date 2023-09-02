const app = require("./app");
const mongoose = require("mongoose");

const PORT = 8000;
const uriDB =
  "mongodb+srv://bsosnowicz:kupsko333@wallet.lshufuy.mongodb.net/wallet?retryWrites=true&w=majority";

const connections = mongoose.connect(uriDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connections
  .then(() => {
    app.listen(PORT, function () {
      console.log(
        `Database  connection succesful. App is running on port ${PORT}`
      );
    });
  })
  .catch((e) => {
    console.log(e.message);
    process.exit[1];
  });
