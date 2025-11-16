const express = require("express");
const app = express();
const authRoute = require("./routes/auth.routes");
const fetchProduct = require('./routes/user.product')

app.use(express.json());
app.use("/api/auth", authRoute);
app.use('/api/product/',fetchProduct)

module.exports = app;
