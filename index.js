const express = require("express");
const cors = require("cors");

require("./db/config");
const User = require("./db/User");
const Product = require("./db/Products")

const app = express();

app.use(express.json());

app.use(cors());

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();

  // removing password field from the register page as well.
  // couldn't use .select as we did below because this ain't mongo db
  result = result.toObject();
  delete result.password;

  res.send(result);
});

app.post("/login", async (req, res) => {
  // removed password from the login
  let user = await User.findOne(req.body).select("-password");
  if (req.body.password && req.body.email) {
    if (user) {
      res.send(user);
    } else {
      res.send({
        result: "no user found",
      });
    }
  } else {
    res.send({
      result: "no user found",
    });
  }
});

app.post("/add-product", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save()
  res.send(result);

})

app.listen(5000, () => {});
