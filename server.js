const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;
const PORT = 8000;
const uriDB = `mongodb+srv://liamskurwol:${secretKey}@b-zone.w1prhep.mongodb.net/wallet?retryWrites=true&w=majority`;

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
