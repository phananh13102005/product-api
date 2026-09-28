const express = require("express");

const productRoutes = require("./routes/productRoutes");

const app = express();

// Cho phép nhận JSON
app.use(express.json());

// Product API
app.use("/products", productRoutes);

// Healthcheck
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP"
    });
});

module.exports = app;