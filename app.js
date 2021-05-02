require("dotenv").config();
const express = require("express");
const app = express();
const indexRoute = require("./routes/indexRoute");
const itemRoute = require("./routes/itemRoute");

const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const cors = require("cors");
mongoose.connect(
  process.env.mongoURL,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("Database connected");
  }
);

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/", indexRoute);
app.use("/api/shop", itemRoute);

app.use((req, res) => {
  res
    .status(404)
    .json({ status: { error: true, message: "404 Page not found" } });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port http://localhost:${process.env.PORT}`);
});

////////////////////////test//////////////////
