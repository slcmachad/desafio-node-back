require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

app.get('/', (req, res) => {
    res.status(200).json({msg: 'funciona pplease'});
})

app.listen(process.env.PORT, () => {
    console.log("funfa?");
});

