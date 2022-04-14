const express = require("express");
const cors = require("cors");

require("./db/config");
const User = require("./db/User");

const app = express();

// post, req, will be in JSON format
app.use(express.json());

app.use(cors());

// request body
// res is something we send
// req is something we receive

app.post("/register", async (req, res) => {
  let use = new User(req.body);
  let result = await use.save();
  res.send(result);
});

app.listen(5000, () => {});
