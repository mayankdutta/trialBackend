// object of express
// const express = require("express");
// const mongoose = require("mongoose");

import express from "express";
import mongoose from "mongoose";

// executable express
const app = express();

const connectDB = async () => {
  mongoose.connect("mongodb://localhost:27017/ecomm");

  // making schemas, when to define schema, when u need to insert, delete, update

  const productSchema = new mongoose.Schema({});

  // check schema making model, whether to nikalna hai data ki ni
  const product = mongoose.model("product", productSchema);

  const data = await product.find();

  console.warn(data);
};

// to make api's
app.get("/", (req, res) => {
  res.send("app is working");
});

connectDB();
// to run server at
app.listen(5000, () => {
});
