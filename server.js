//!import lib

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const configJson = require("./util/config");

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
const config = configJson[env];

//! setting
const app = express();
const routes = require("./route/routes");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use((req, res , next)=>{
    res.header("Access-Control-Allow-Origin","*"),
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-Wth, Content-Type, Accept" 
    ),
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE"),
    next()
});

app.use("/api",routes);


app.listen(config.port, ()=>{
    console.log(`Server start on port ${config.port}`);
});