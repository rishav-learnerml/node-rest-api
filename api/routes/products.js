const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              description: "GET_THIS_PRODUCT",
              url: `http://localhost:5000/products/${doc._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:productId", (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
  .select('name price _id')
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "GET_ALL_PRODUCTS",
            url: `http://localhost:5000/products`
          }
        });
      } else {
        res
          .status(404)
          .json({ message: `No valid entry found for ID: ${productId}` });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created Product Succesfully!",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id : result._id,
          request: {
            type:'GET',
            url: `http://localhost:5000/products/${result._id}`
          }
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const productId = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: productId }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Updated",
        request: {
          type: 'GET',
          url: `http://localhost:5000/products/${productId}`

        }
    });
    })
    .catch((err) => {
      console.log(error);
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const productId = req.params.productId;
  Product.remove({ _id: productId })
    .exec()
    .then((result) => {
    
      res.status(200).json({
        message: `product with ID: ${productId} is deleted`,
        request: {
          type: 'POST',
          url: 'http://localhost:5000/products',
          body: {
            name: 'String',
            price: 'Number'
          }
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
