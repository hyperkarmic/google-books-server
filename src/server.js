const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const api = require("./routes/api");
const auth = require("./routes/auth");
const authenticateUser = require("./middlewares/authenticateUser");
const { PORT, DB_URI, MONGOOSE_OPTIONS } = require("./config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/auth", auth);
app.use("/api", authenticateUser, api);

mongoose.connect(DB_URI, MONGOOSE_OPTIONS);

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
