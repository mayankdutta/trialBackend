/*
 *  if we want to GET the data from the database, we use GET method
 *  if we want to SAVE something in our database, we use POST method
 *  If we want to DELETE something in out database, we use DELETE method
 */
const express = require("express");
const cors = require("cors");

require("./db/config");
const User = require("./db/User");
const Product = require("./db/Products");

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
  let result = await product.save();
  res.send(result);
});

// await can only be used in async function.
app.get("/products", async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({
      result: "No products found",
    });
  }
});

// req.params to get the parameter mentioned in URL like id
app.delete("/products/:id", async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/products/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    // sending data as a promise to the frontend.
    res.send(result);
  } else {
    res.send({ result: "No record found" });
  }
});

app.listen(5000, () => {});
