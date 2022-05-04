/*
 *  if we want to GET the data from the database, we use GET method
 *  if we want to SAVE something in our database, we use POST method
 *  If we want to DELETE something in out database, we use DELETE method
 *  If we want to UPDATE something that is already in our database, we use PUT method
 */
const express = require("express");
const cors = require("cors");
const Jwt = require("jsonwebtoken")

const jwtKey = 'e-comm'

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
            Jwt.sign({user}, jwtKey, {expiresIn: "2h"}, (err, token) => {
                if (err) {
                    res.send({result: "something went wrong"})
                }
                res.send({user, auth: token})
            })
            // res.send(user);
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
    const result = await Product.deleteOne({_id: req.params.id});
    res.send(result);
});

app.get("/products/:id", async (req, res) => {
    let result = await Product.findOne({_id: req.params.id});
    if (result) {
        // sending data as a promise to the frontend.
        res.send(result);
    } else {
        res.send({result: "No record found"});
    }
});

app.put("/products/:id", async (req, res) => {
    // accept two pramaters, id of the data that is already in there, new data;
    let result = await Product.updateOne({_id: req.params.id}, {
        $set: req.body,
    });
    res.send(result);
});

app.get("/search/:key", async (req, res) => {
    let result = await Product.find({
        "$or": [{
            name: {
                $regex: req.params.key
            }
        }, {
            company: {
                $regex: req.params.key
            }
        },
            {
                category: {
                    $regex: req.params.key
                }
            }
        ]
    })
    // without mentioning this you won't be seeing data on your frontend side
    res.send(result);

})

app.listen(5000, () => {
});
